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
import { LensRefractionRangeService } from './lens_refraction_range.service';
import { LensRefractionRangeModel } from './models/lens_refraction_range.model';
import {
  CreateLensRefractionRangeBodyDto,
  DeleteLensRefractionRangeParamsDto,
  GetLensRefractionRangeParamsDto,
  GetLensRefractionRangesQueryDto,
  UpdateLensRefractionRangeBodyDto,
  UpdateLensRefractionRangeParamsDto,
} from './dtos/lens_refraction_range.dto';
import { RequestModel } from '../../../common/models/request.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';

@ApiTags('Lens Refraction Range')
@Controller('api/v1/')
@Roles(RoleType.Admin)
export class LensRefractionRangeController {
  constructor(
    private readonly lensRefractionRangeService: LensRefractionRangeService,
  ) {}

  @Get('lens-refraction-range/list')
  async findAll(@Query() query: GetLensRefractionRangesQueryDto) {
    return await this.lensRefractionRangeService.getLensRefractionRanges(
      undefined,
      query.lensVariantId ? [query.lensVariantId] : undefined,
      query.refractionType,
      new PaginationParamsModel(query.page, query.limit),
      query.q,
      undefined,
    );
  }

  @Get('lens-refraction-range/:lensRefractionRangeId')
  async findOne(
    @Param() params: GetLensRefractionRangeParamsDto,
  ): Promise<LensRefractionRangeModel> {
    return await this.lensRefractionRangeService.getLensRefractionRangeById(
      params.lensRefractionRangeId,
    );
  }

  @Post('lens-refraction-range')
  async create(
    @Body() body: CreateLensRefractionRangeBodyDto,
    @Req() req: RequestModel,
  ): Promise<LensRefractionRangeModel> {
    return await this.lensRefractionRangeService.createLensRefractionRange(
      body.lensVariantId,
      body.refractionType,
      body.minValue,
      body.maxValue,
      body.stepValue,
      req.user.userId,
    );
  }

  @Put('lens-refraction-range/:lensRefractionRangeId')
  async update(
    @Param() params: UpdateLensRefractionRangeParamsDto,
    @Body() body: UpdateLensRefractionRangeBodyDto,
    @Req() req: RequestModel,
  ): Promise<LensRefractionRangeModel> {
    const lensRefractionRange =
      await this.lensRefractionRangeService.getLensRefractionRangeById(
        params.lensRefractionRangeId,
      );

    return await this.lensRefractionRangeService.updateLensRefractionRange(
      lensRefractionRange,
      body.lensVariantId,
      body.refractionType,
      body.minValue,
      body.maxValue,
      body.stepValue,
      req.user.userId,
    );
  }

  @Delete('lens-refraction-range/:lensRefractionRangeId')
  async remove(
    @Param() params: DeleteLensRefractionRangeParamsDto,
    @Req() req: RequestModel,
  ): Promise<{ success: boolean }> {
    const lensRefractionRange =
      await this.lensRefractionRangeService.getLensRefractionRangeById(
        params.lensRefractionRangeId,
      );

    const success =
      await this.lensRefractionRangeService.deleteLensRefractionRange(
        lensRefractionRange,
        req.user.userId,
      );

    return { success };
  }
}
