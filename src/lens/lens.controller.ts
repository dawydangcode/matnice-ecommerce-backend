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
import { RequestModel } from '../common/models/request.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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

  @Get('lens/:lensId/detail')
  async getLensById(@Param() params: GetLensByIdParamsDto) {
    return this.lensService.getLensById(Number(params.lensId));
  }

  @Get('lens/:lensId/full-details')
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
