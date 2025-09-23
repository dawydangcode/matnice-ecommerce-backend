import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { LensService } from './lens.service';
import {
  CreateLensBodyDto,
  DeleteLensParamsDto,
  GetLensesQueryDto,
  UpdateLensParamsDto,
  UpdateLensBodyDto,
  GetLensByIdParamsDto,
} from './dtos/lens.dto';
import {
  GetLensFullDetailsQueryDto,
  LensFullDetailsResponseDto,
} from './dtos/lens-full-details.dto';
import {
  LensPrescriptionFilterQueryDto,
  LensPrescriptionFilterResponseDto,
} from './dtos/lens-prescription-filter.dto';
import { RequestModel } from '../common/models/request.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';

@Controller('api/v1')
@ApiTags('Lens')
export class LensController {
  constructor(private readonly lensService: LensService) {}

  @Get('lens/list')
  async getLenses(@Query() query: GetLensesQueryDto) {
    return this.lensService.getLenses(
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      query.q,
      undefined,
    );
  }

  @Get('lens/cards')
  @Public()
  @ApiOperation({
    summary: 'Get lens cards for frontend display',
    description:
      'Get lenses with images, brand, category info for product listing',
  })
  async getLensCards(@Query() query: any) {
    return this.lensService.getLensCards(
      new PaginationParamsModel(
        parseInt(query.page) || 1,
        parseInt(query.limit) || 12,
      ),
      query.search,
      query.brandLensIds
        ? query.brandLensIds.split(',').map(Number)
        : undefined,
      query.categoryLensIds
        ? query.categoryLensIds.split(',').map(Number)
        : undefined,
      query.lensTypes ? query.lensTypes.split(',') : undefined,
      query.minPrice ? Number(query.minPrice) : undefined,
      query.maxPrice ? Number(query.maxPrice) : undefined,
      query.sortBy || 'newest',
      query.sortOrder || 'DESC',
    );
  }

  @Get('lens/filter-by-prescription')
  @Public()
  @ApiOperation({
    summary: 'Filter lenses by prescription values',
    description:
      'Filter lenses based on prescription values (sphere, cylinder, add). Returns lenses that have variants compatible with the provided prescription values.',
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered lenses retrieved successfully',
    type: LensPrescriptionFilterResponseDto,
  })
  async filterLensesByPrescription(
    @Query() query: LensPrescriptionFilterQueryDto,
  ): Promise<LensPrescriptionFilterResponseDto> {
    const prescriptionData = {
      sphereLeft: query.sphereLeft,
      sphereRight: query.sphereRight,
      cylinderLeft: query.cylinderLeft,
      cylinderRight: query.cylinderRight,
      addLeft: query.addLeft,
      addRight: query.addRight,
    };

    return this.lensService.filterLensesByPrescription(
      prescriptionData,
      new PaginationParamsModel(query.page || 1, query.limit || 12),
      query.lensType,
    );
  }

  @Get('lens/:lensId/detail')
  @Public()
  async getLensById(@Param() params: GetLensByIdParamsDto) {
    return this.lensService.getLensById(Number(params.lensId));
  }

  @Get('lens/:lensId/full-details')
  @Public()
  @ApiOperation({
    summary: 'Get full lens details with all related data',
    description:
      'Retrieve comprehensive lens information including variants, coatings, images, categories, and summary statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Lens full details retrieved successfully',
    type: LensFullDetailsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Lens not found',
  })
  async getLensFullDetails(
    @Param() params: GetLensByIdParamsDto,
    @Query() query: GetLensFullDetailsQueryDto,
  ): Promise<LensFullDetailsResponseDto> {
    return this.lensService.getLensFullDetails(
      Number(params.lensId),
      query.include,
    );
  }

  @Post('lens/create')
  async createLens(@Body() body: CreateLensBodyDto, @Req() req: RequestModel) {
    return this.lensService.createLens(
      body.name,
      body.brandId,
      body.origin,
      body.lensType,
      body.status,
      body.description,
      req.user.userId,
    );
  }

  @Put('lens/:lensId/update')
  async updateLens(
    @Param() params: UpdateLensParamsDto,
    @Body() body: UpdateLensBodyDto,
    @Req() req: RequestModel,
  ) {
    const lens = await this.lensService.getLensById(params.lensId);
    return this.lensService.updateLens(
      lens,
      body.name,
      body.brandId,
      body.origin,
      body.lensType,
      body.status,
      body.description,
      req.user.userId,
    );
  }

  @Delete('lens/:lensId/delete')
  async deleteLens(
    @Param() params: DeleteLensParamsDto,
    @Req() req: RequestModel,
  ) {
    const lens = await this.lensService.getLensById(params.lensId);

    return this.lensService.deleteLens(lens, req.user.userId);
  }
}
