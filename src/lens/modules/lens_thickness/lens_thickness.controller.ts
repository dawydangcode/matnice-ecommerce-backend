import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { LensThicknessService } from './lens_thickness.service';
import { LensThicknessEntity } from './entities/lens_thickness.entity';

@ApiTags('Lens Thickness')
@Controller('lens-thickness')
export class LensThicknessController {
  constructor(private readonly lensThicknessService: LensThicknessService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lens thicknesses' })
  async findAll(): Promise<LensThicknessEntity[]> {
    return this.lensThicknessService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lens thickness by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async findById(@Param('id') id: number): Promise<LensThicknessEntity | null> {
    return this.lensThicknessService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new lens thickness' })
  @ApiBody({ type: Object })
  async create(
    @Body() data: Partial<LensThicknessEntity>,
  ): Promise<LensThicknessEntity> {
    return this.lensThicknessService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lens thickness' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: Object })
  async update(
    @Param('id') id: number,
    @Body() data: Partial<LensThicknessEntity>,
  ): Promise<LensThicknessEntity | null> {
    return this.lensThicknessService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lens thickness' })
  @ApiParam({ name: 'id', type: 'number' })
  async delete(@Param('id') id: number): Promise<void> {
    return this.lensThicknessService.delete(id);
  }
}
