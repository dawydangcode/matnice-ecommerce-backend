import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LensThicknessService } from './lens_thickness.service';
import { LensThicknessModel } from './models/lens_thickness.model';

@ApiTags('Lens Thickness')
@Controller('lens-thickness')
export class LensThicknessController {
  constructor(private readonly lensThicknessService: LensThicknessService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lens thicknesses' })
  @ApiResponse({
    status: 200,
    description: 'List of lens thicknesses retrieved successfully',
  })
  async findAll(): Promise<LensThicknessModel[]> {
    return this.lensThicknessService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lens thickness by ID' })
  @ApiResponse({
    status: 200,
    description: 'Lens thickness retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Lens thickness not found' })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LensThicknessModel> {
    return this.lensThicknessService.findById(id);
  }
}
