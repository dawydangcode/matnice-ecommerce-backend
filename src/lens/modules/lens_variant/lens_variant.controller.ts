import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LensVariantService } from './lens_variant.service';
import { LensVariantModel } from './models/lens_variant.model';
import {
  GetLensVariantByIdParamsDto,
  GetLensVariantsQueryDto,
  CreateLensVariantBodyDto,
  UpdateLensVariantParamsDto,
  UpdateLensVariantBodyDto,
  DeleteLensVariantParamsDto,
} from './dtos/lens_variant.dto';
import { RequestModel } from '../../../common/models/request.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';

@ApiTags('Lens Variant')
@Controller('api/v1/')
@Roles(RoleType.Admin)
export class LensVariantController {
  constructor(private readonly lensVariantService: LensVariantService) {}

  @Get('lens-variants/list')
  async getLensVariant(@Query() query: GetLensVariantsQueryDto) {
    return await this.lensVariantService.getLensVariants(
      undefined,
      query.lensId,
      query.lensThicknessId,
      new PaginationParamsModel(query.page, query.limit),
      query.search,
      undefined,
    );
  }

  @Get('lens-variants/by-lens/:lensId')
  async findByLensId(
    @Param('lensId') lensId: number,
  ): Promise<LensVariantModel[]> {
    return await this.lensVariantService.findByLensId(lensId);
  }

  @Get('lens-variant/:lensVariantId')
  async getLensVariantById(
    @Param() params: GetLensVariantByIdParamsDto,
  ): Promise<LensVariantModel> {
    return await this.lensVariantService.findById(params.lensVariantId);
  }

  @Post('lens-variant/create')
  async createLensVariant(
    @Body() body: CreateLensVariantBodyDto,
    @Req() req: RequestModel,
  ): Promise<LensVariantModel> {
    return await this.lensVariantService.createLensVariant(
      body.lensId,
      body.lensThicknessId,
      body.design,
      body.material,
      body.price,
      body.stock,
      req.user.userId,
    );
  }

  @Put('lens-variant/:lensVariantId/update')
  async update(
    @Param() params: UpdateLensVariantParamsDto,
    @Body() body: UpdateLensVariantBodyDto,
    @Req() req: RequestModel,
  ): Promise<LensVariantModel> {
    const lensVariant = await this.lensVariantService.findById(
      params.lensVariantId,
    );

    return await this.lensVariantService.update(
      lensVariant,
      undefined,
      undefined,
      body.design,
      body.material,
      body.price,
      body.stock,
      req.user.userId,
    );
  }

  @Delete('lens-variant/:lensVariantId/delete')
  async deleteLensVariant(
    @Param() params: DeleteLensVariantParamsDto,
    @Req() req: RequestModel,
  ): Promise<boolean> {
    const lensVariant = await this.lensVariantService.findById(
      params.lensVariantId,
    );

    return await this.lensVariantService.deleteLensVariant(
      lensVariant,
      req.user.userId,
    );
  }
}
