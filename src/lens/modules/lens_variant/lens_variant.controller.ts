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
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  LensVariantService,
  LensVariantResponse,
} from './lens_variant.service';
import { LensVariantModel } from './models/lens_variant.model';
import {
  CreateLensVariantDto,
  UpdateLensVariantDto,
  LensVariantFiltersDto,
  LensVariantParamsDto,
} from './dtos/lens_variant.dto';
import { RequestModel } from '../../../common/models/request.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';

@ApiTags('Lens Variant')
@Controller('lens-variant')
@Roles(RoleType.Admin)
export class LensVariantController {
  constructor(private readonly lensVariantService: LensVariantService) {}

  @Get('list')
  @ApiOperation({
    summary: 'Get all lens variants with pagination and filters',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'FSV' })
  @ApiQuery({ name: 'lensId', required: false, example: 1 })
  @ApiQuery({ name: 'lensThicknessId', required: false, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'List of lens variants retrieved successfully',
  })
  async findAll(
    @Query() filters: LensVariantFiltersDto,
  ): Promise<LensVariantResponse> {
    return await this.lensVariantService.findAll(filters);
  }

  @Get('by-lens/:lensId')
  @ApiOperation({ summary: 'Get all variants for a specific lens' })
  @ApiParam({ name: 'lensId', description: 'Lens ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Lens variants retrieved successfully',
  })
  async findByLensId(
    @Param('lensId') lensId: number,
  ): Promise<LensVariantModel[]> {
    return await this.lensVariantService.findByLensId(lensId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lens variant by ID' })
  @ApiParam({ name: 'id', description: 'Lens variant ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Lens variant retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Lens variant not found' })
  async findById(
    @Param() params: LensVariantParamsDto,
  ): Promise<LensVariantModel> {
    return await this.lensVariantService.findById(params.id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new lens variant' })
  @ApiResponse({
    status: 201,
    description: 'Lens variant created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Lens variant with this combination already exists',
  })
  async create(
    @Body() createDto: CreateLensVariantDto,
    @Req() req: RequestModel,
  ): Promise<LensVariantModel> {
    return await this.lensVariantService.create(createDto, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lens variant by ID' })
  @ApiParam({ name: 'id', description: 'Lens variant ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Lens variant updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Lens variant not found' })
  async update(
    @Param() params: LensVariantParamsDto,
    @Body() updateDto: UpdateLensVariantDto,
    @Req() req: RequestModel,
  ): Promise<LensVariantModel> {
    return await this.lensVariantService.update(
      params.id,
      updateDto,
      req.user.userId,
    );
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Update lens variant stock' })
  @ApiParam({ name: 'id', description: 'Lens variant ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Stock updated successfully' })
  @ApiResponse({ status: 404, description: 'Lens variant not found' })
  async updateStock(
    @Param() params: LensVariantParamsDto,
    @Body('stock') stock: number,
    @Req() req: RequestModel,
  ): Promise<LensVariantModel> {
    return await this.lensVariantService.updateStock(
      params.id,
      stock,
      req.user.userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lens variant by ID (soft delete)' })
  @ApiParam({ name: 'id', description: 'Lens variant ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Lens variant deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Lens variant not found' })
  async delete(
    @Param() params: LensVariantParamsDto,
    @Req() req: RequestModel,
  ): Promise<{ success: boolean }> {
    const success = await this.lensVariantService.delete(
      params.id,
      req.user.userId,
    );
    return { success };
  }
}
