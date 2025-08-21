import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { LensThicknessService } from './lens_thickness.service';
import {
  CreateLensThicknessDto,
  UpdateLensThicknessDto,
  LensThicknessFilterDto,
} from './dtos/lens_thickness.dto';

@ApiTags('Lens Thickness')
@Controller('api/v1/lens-thickness')
export class LensThicknessController {
  constructor(private readonly lensThicknessService: LensThicknessService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lens thickness options' })
  @ApiResponse({
    status: 200,
    description: 'List of lens thickness options retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'Standard' })
  @ApiQuery({ name: 'isActive', required: false, example: true })
  async findAll(@Query() filters: LensThicknessFilterDto) {
    return this.lensThicknessService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lens thickness by ID' })
  @ApiResponse({
    status: 200,
    description: 'Lens thickness retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Lens thickness not found' })
  @ApiParam({ name: 'id', example: 1 })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lensThicknessService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new lens thickness' })
  @ApiResponse({
    status: 201,
    description: 'Lens thickness created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createDto: CreateLensThicknessDto) {
    return this.lensThicknessService.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lens thickness' })
  @ApiResponse({
    status: 200,
    description: 'Lens thickness updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Lens thickness not found' })
  @ApiParam({ name: 'id', example: 1 })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateLensThicknessDto,
  ) {
    return this.lensThicknessService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete lens thickness' })
  @ApiResponse({
    status: 204,
    description: 'Lens thickness deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Lens thickness not found' })
  @ApiParam({ name: 'id', example: 1 })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.lensThicknessService.remove(id);
  }
}
