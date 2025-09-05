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
  Product3dModelResponseDto,
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
    type: Product3dModelResponseDto,
  })
  async create(
    @Body() createDto: CreateProduct3dModelDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.id;
    return await this.product3dModelService.create(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all 3D models' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all 3D models',
    type: [Product3dModelResponseDto],
  })
  async findAll() {
    return await this.product3dModelService.findAll();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all 3D models for a specific product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of 3D models for the product',
    type: [Product3dModelResponseDto],
  })
  async findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    return await this.product3dModelService.findByProductId(productId);
  }

  @Get('product/:productId/primary')
  @ApiOperation({ summary: 'Get primary 3D model for a specific product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Primary 3D model for the product',
    type: Product3dModelResponseDto,
  })
  async findPrimaryByProductId(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return await this.product3dModelService.findPrimaryByProductId(productId);
  }

  @Get('type/:modelType')
  @ApiOperation({ summary: 'Get all 3D models by type' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of 3D models by type',
    type: [Product3dModelResponseDto],
  })
  async findByModelType(@Param('modelType') modelType: string) {
    return await this.product3dModelService.findByModelType(modelType);
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
    type: Product3dModelResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.product3dModelService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a 3D model' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '3D model updated successfully',
    type: Product3dModelResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProduct3dModelDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.id;
    return await this.product3dModelService.update(id, updateDto, userId);
  }

  @Patch(':id/set-primary')
  @ApiOperation({ summary: 'Set a 3D model as primary for its product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '3D model set as primary',
    type: Product3dModelResponseDto,
  })
  async setPrimary(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any)?.id;
    return await this.product3dModelService.setPrimary(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a 3D model' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '3D model deleted successfully',
  })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any)?.id;
    await this.product3dModelService.remove(id, userId);
  }
}
