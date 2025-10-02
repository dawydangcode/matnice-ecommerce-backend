import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ColorSkinRecommendationService } from './color-skin-recommendation.service';
import { PaginationParamsModel } from '../../../common/models/pagination-params.model';
import {
  CreateColorSkinRecommendationBodyDto,
  DeleteColorSkinRecommendationParamsDto,
  GetColorSkinRecommendationByIdParamsDto,
  GetColorSkinRecommendationsQueryDto,
  GetRecommendationsByProductColorParamsDto,
  GetRecommendationsBySkinColorParamsDto,
  UpdateColorSkinRecommendationBodyDto,
  UpdateColorSkinRecommendationParamsDto,
} from './dtos/color-skin-recommendation.dto';
import { RequestModel } from '../../../common/models/request.model';
import { RoleType } from '../../../role/enum/role.enum';
import { Roles } from '../../../role/decorators/roles.decorator';
import { SkinColorType } from './enum/skin-color.type';

@Controller('api/v1/')
@ApiTags('Color Skin Recommendation')
@Roles(RoleType.Admin)
export class ColorSkinRecommendationController {
  constructor(
    private readonly colorSkinRecommendationService: ColorSkinRecommendationService,
  ) {}

  @Get('color-skin-recommendations/list')
  async getColorSkinRecommendations(
    @Query() query: GetColorSkinRecommendationsQueryDto,
  ) {
    return await this.colorSkinRecommendationService.getColorSkinRecommendations(
      new PaginationParamsModel(query.page, query.limit),
      query.skinColorType,
      query.productColorId,
      ['productColor'],
    );
  }

  @Get('color-skin-recommendation/:id/detail')
  async getColorSkinRecommendationById(
    @Param() params: GetColorSkinRecommendationByIdParamsDto,
  ) {
    return await this.colorSkinRecommendationService.getColorSkinRecommendationById(
      params.id,
    );
  }

  @Get('product-color/:productColorId/skin-recommendations')
  @Roles()
  async getRecommendationsByProductColor(
    @Param() params: GetRecommendationsByProductColorParamsDto,
  ) {
    return await this.colorSkinRecommendationService.getRecommendationsByProductColorId(
      params.productColorId,
    );
  }

  @Get('skin-color/:skinColorType/color-recommendations')
  @Roles()
  async getRecommendationsBySkinColor(
    @Param() params: GetRecommendationsBySkinColorParamsDto,
  ) {
    return await this.colorSkinRecommendationService.getRecommendationsBySkinColorType(
      params.skinColorType,
    );
  }

  @Get('skin-color/:skinColorType/recommended-product-colors')
  @Roles()
  async getProductColorIdsBySkinColor(
    @Param() params: GetRecommendationsBySkinColorParamsDto,
  ) {
    const productColorIds =
      await this.colorSkinRecommendationService.getProductColorIdsBySkinColorType(
        params.skinColorType,
      );
    return {
      skinColorType: params.skinColorType,
      productColorIds: productColorIds,
      count: productColorIds.length,
    };
  }

  @Post('color-skin-recommendation/create')
  async createColorSkinRecommendation(
    @Req() req: RequestModel,
    @Body() body: CreateColorSkinRecommendationBodyDto,
  ) {
    return await this.colorSkinRecommendationService.createColorSkinRecommendation(
      body.productColorId,
      body.skinColorType,
      req.user.userId,
    );
  }

  @Post('product-color/:productColorId/bulk-recommendations')
  async bulkCreateRecommendations(
    @Req() req: RequestModel,
    @Param() params: GetRecommendationsByProductColorParamsDto,
    @Body() body: { skinColorTypes: SkinColorType[] },
  ) {
    return await this.colorSkinRecommendationService.bulkCreateRecommendations(
      params.productColorId,
      body.skinColorTypes,
      req.user.userId,
    );
  }

  @Put('color-skin-recommendation/:id/update')
  async updateColorSkinRecommendation(
    @Req() req: RequestModel,
    @Param() params: UpdateColorSkinRecommendationParamsDto,
    @Body() body: UpdateColorSkinRecommendationBodyDto,
  ) {
    const recommendation =
      await this.colorSkinRecommendationService.getColorSkinRecommendationById(
        params.id,
      );
    return await this.colorSkinRecommendationService.updateColorSkinRecommendation(
      recommendation,
      body.productColorId,
      body.skinColorType,
      req.user.userId,
    );
  }

  @Delete('color-skin-recommendation/:id/delete')
  async deleteColorSkinRecommendation(
    @Req() req: RequestModel,
    @Param() params: DeleteColorSkinRecommendationParamsDto,
  ) {
    const recommendation =
      await this.colorSkinRecommendationService.getColorSkinRecommendationById(
        params.id,
      );
    return await this.colorSkinRecommendationService.deleteColorSkinRecommendation(
      recommendation,
      req.user.userId,
    );
  }
}
