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
import { ApiTags } from '@nestjs/swagger';
import {
  LensVariantCoatingService,
  LensVariantCoatingResponse,
} from './lens_variant_coating.service';
import { LensVariantCoatingModel } from './models/lens_variant_coating.model';
import {
  CreateLensVariantCoatingBodyDto,
  DeleteLensVariantCoatingParamsDto,
  GetLensVariantCoatingParamsDto,
  GetLensVariantCoatingsQueryDto,
  UpdateLensVariantCoatingBodyDto,
  UpdateLensVariantCoatingParamsDto,
} from './dtos/lens_variant_coating.dto';
import { RequestModel } from '../../../common/models/request.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';

@ApiTags('Lens Variant Coating')
@Controller('api/v1/')
@Roles(RoleType.Admin)
export class LensVariantCoatingController {
  constructor(
    private readonly lensVariantCoatingService: LensVariantCoatingService,
  ) {}

  @Get('lens-variant-coating/list')
  async findAll(@Query() query: GetLensVariantCoatingsQueryDto) {
    return await this.lensVariantCoatingService.getLensVariantCoatings(
      undefined,
      query.lensVariantId ? [query.lensVariantId] : undefined,
      query.lensCoatingId ? [query.lensCoatingId] : undefined,
      new PaginationParamsModel(query.page, query.limit),
      ['lensCoating'],
    );
  }

  @Get('lens-variant-coating/:lensVariantCoatingId')
  async findOne(
    @Param() params: GetLensVariantCoatingParamsDto,
  ): Promise<LensVariantCoatingModel> {
    return await this.lensVariantCoatingService.getLensVariantCoatingById(
      params.lensVariantCoatingId,
    );
  }

  @Get('lens-variant/:lensVariantId/coatings')
  async getCoatingsByLensVariant(
    @Param('lensVariantId') lensVariantId: number,
  ): Promise<LensVariantCoatingModel[]> {
    return await this.lensVariantCoatingService.getCoatingsByLensVariantId(
      Number(lensVariantId),
    );
  }

  @Get('lens-coating/:lensCoatingId/variants')
  async getLensVariantsByCoating(
    @Param('lensCoatingId') lensCoatingId: number,
  ): Promise<LensVariantCoatingModel[]> {
    return await this.lensVariantCoatingService.getLensVariantsByCoatingId(
      Number(lensCoatingId),
    );
  }

  @Post('lens-variant-coating')
  async create(
    @Body() body: CreateLensVariantCoatingBodyDto,
    @Req() req: RequestModel,
  ): Promise<LensVariantCoatingModel> {
    return await this.lensVariantCoatingService.createLensVariantCoating(
      body.lensVariantId,
      body.lensCoatingId,
      req.user.userId,
    );
  }

  @Put('lens-variant-coating/:lensVariantCoatingId')
  async update(
    @Param() params: UpdateLensVariantCoatingParamsDto,
    @Body() body: UpdateLensVariantCoatingBodyDto,
    @Req() req: RequestModel,
  ): Promise<LensVariantCoatingModel> {
    const lensVariantCoating =
      await this.lensVariantCoatingService.getLensVariantCoatingById(
        params.lensVariantCoatingId,
      );

    return await this.lensVariantCoatingService.updateLensVariantCoating(
      lensVariantCoating,
      body.lensVariantId,
      body.lensCoatingId,
      req.user.userId,
    );
  }

  @Delete('lens-variant-coating/:lensVariantCoatingId')
  async remove(
    @Param() params: DeleteLensVariantCoatingParamsDto,
    @Req() req: RequestModel,
  ): Promise<{ success: boolean }> {
    const lensVariantCoating =
      await this.lensVariantCoatingService.getLensVariantCoatingById(
        params.lensVariantCoatingId,
      );

    const success =
      await this.lensVariantCoatingService.deleteLensVariantCoating(
        lensVariantCoating,
        req.user.userId,
      );

    return { success };
  }
}
