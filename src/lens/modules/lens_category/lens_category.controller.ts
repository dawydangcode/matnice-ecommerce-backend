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
import { LensCategoryService } from './lens_category.service';
import {
  CreateLensCategoryDto,
  LensCategoryFilterDto,
} from './dtos/lens_category.dto';

@ApiTags('Lens Category')
@Controller('lens-category')
export class LensCategoryController {
  constructor(private readonly lensCategoryService: LensCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lens-category relationships' })
  @ApiResponse({
    status: 200,
    description: 'List of lens-category relationships retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'lens name' })
  @ApiQuery({ name: 'lensId', required: false, example: 1 })
  @ApiQuery({ name: 'categoryId', required: false, example: 1 })
  async findAll(@Query() filters: LensCategoryFilterDto) {
    return this.lensCategoryService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lens-category relationship by ID' })
  @ApiResponse({
    status: 200,
    description: 'Lens-category relationship retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Lens-category relationship not found',
  })
  @ApiParam({ name: 'id', example: 1 })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lensCategoryService.findOne(id);
  }

  @Get('lens/:lensId')
  @ApiOperation({ summary: 'Get all categories for a lens' })
  @ApiResponse({
    status: 200,
    description: 'Categories for lens retrieved successfully',
  })
  @ApiParam({ name: 'lensId', example: 1 })
  async findByLensId(@Param('lensId', ParseIntPipe) lensId: number) {
    return this.lensCategoryService.findByLensId(lensId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new lens-category relationship' })
  @ApiResponse({
    status: 201,
    description: 'Lens-category relationship created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createDto: CreateLensCategoryDto) {
    return this.lensCategoryService.create(createDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete lens-category relationship' })
  @ApiResponse({
    status: 204,
    description: 'Lens-category relationship deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Lens-category relationship not found',
  })
  @ApiParam({ name: 'id', example: 1 })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.lensCategoryService.remove(id);
  }
}
