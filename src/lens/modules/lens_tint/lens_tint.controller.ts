import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LensTintService } from './lens_tint.service';
import { LensTintModel } from './models/lens_tint.model';
import { TintColorModel } from './models/tint_color.model';

@ApiTags('Lens Tint')
@Controller('lens-tint')
export class LensTintController {
  constructor(private readonly lensTintService: LensTintService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lens tints' })
  @ApiResponse({
    status: 200,
    description: 'List of lens tints retrieved successfully',
  })
  async findAllTints(): Promise<LensTintModel[]> {
    return this.lensTintService.findAllTints();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lens tint by ID' })
  @ApiResponse({
    status: 200,
    description: 'Lens tint retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Lens tint not found' })
  async findTintById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LensTintModel> {
    return this.lensTintService.findTintById(id);
  }

  @Get('colors/all')
  @ApiOperation({ summary: 'Get all tint colors' })
  @ApiResponse({
    status: 200,
    description: 'List of tint colors retrieved successfully',
  })
  async findAllTintColors(): Promise<TintColorModel[]> {
    return this.lensTintService.findAllTintColors();
  }

  @Get(':tintId/colors')
  @ApiOperation({ summary: 'Get tint colors by tint ID' })
  @ApiResponse({
    status: 200,
    description: 'List of tint colors for specific tint retrieved successfully',
  })
  async findTintColorsByTintId(
    @Param('tintId', ParseIntPipe) tintId: number,
  ): Promise<TintColorModel[]> {
    return this.lensTintService.findTintColorsByTintId(tintId);
  }
}
