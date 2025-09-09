import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Product3dModelService } from './product-3d-model.service';
import {
  CreateProduct3dModelDto,
  UpdateProduct3dModelDto,
  Product3dModelQueryDto,
} from './dtos/product-3d-model.dto';
import { JwtAuthGuard } from '../../../middlewares/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Product 3D Models')
@Controller('product-3d-model')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class Product3dModelController {
  constructor(private readonly product3dModelService: Product3dModelService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new 3D model for a product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '3D model created successfully',
  })
  async create(
    @Body() createDto: CreateProduct3dModelDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.id;
    const result = await this.product3dModelService.createProduct3dModel(
      createDto.productId,
      createDto.modelName,
      createDto.modelFilePath,
      createDto.modelType as any,
      createDto.mtlFilePath || '',
      createDto.textureBasePath || '',
      createDto.configJson || '',
      createDto.isActive ?? true,
      userId,
    );
    return result.toModel();
  }

  @Get()
  @ApiOperation({ summary: 'Get all 3D models' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all 3D models',
  })
  async findAll() {
    return await this.product3dModelService.getProduct3dModels();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get 3D model for a specific product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '3D model for the product',
  })
  async findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    return await this.product3dModelService.getProduct3dModelByProductId(
      productId,
    );
  }

  @Get('product/:productId/active')
  @ApiOperation({ summary: 'Get active 3D models for a specific product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active 3D models for the product',
  })
  async findActiveByProductId(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return await this.product3dModelService.getActiveByProductId(productId);
  }

  @Get('type/:modelType')
  @ApiOperation({ summary: 'Get all 3D models by type' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of 3D models by type',
  })
  async findByModelType(@Param('modelType') modelType: string) {
    return await this.product3dModelService.findByModelType(modelType as any);
  }

  @Get('stats/storage')
  @ApiOperation({ summary: 'Get storage statistics for 3D models' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Storage statistics' })
  async getStorageStats() {
    return await this.product3dModelService.getStorageStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific 3D model by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '3D model details',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.product3dModelService.getProduct3dModel(id);
    return result.toModel();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a 3D model' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '3D model updated successfully',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProduct3dModelDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.id;
    const model = await this.product3dModelService.getProduct3dModel(id);
    const modelData = model.toModel();

    return await this.product3dModelService.updateProduct3dModel(
      modelData,
      updateDto.modelName || modelData.modelName,
      updateDto.modelFilePath || modelData.modelFilePath,
      (updateDto.modelType as any) || modelData.modelType,
      updateDto.mtlFilePath || modelData.mtlFilePath || '',
      updateDto.textureBasePath || modelData.textureBasePath || '',
      updateDto.configJson || modelData.configJson || '',
      updateDto.isActive ?? modelData.isActive,
      userId,
    );
  }

  @Patch(':id/set-active')
  @ApiOperation({ summary: 'Set a 3D model as active/inactive' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '3D model activity status updated',
  })
  async setActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isActive: boolean },
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.id;
    const model = await this.product3dModelService.getProduct3dModel(id);
    const modelData = model.toModel();

    return await this.product3dModelService.setActive(
      modelData,
      body.isActive,
      userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a 3D model' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '3D model deleted successfully',
  })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any)?.id;
    const model = await this.product3dModelService.getProduct3dModel(id);
    const modelData = model.toModel();

    return await this.product3dModelService.deleteProduct3dModel(
      modelData,
      userId,
    );
  }
}
