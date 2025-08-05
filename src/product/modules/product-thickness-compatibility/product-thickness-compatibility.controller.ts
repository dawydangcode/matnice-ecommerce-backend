import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductThicknessCompatibilityService } from './product-thickness-compatibility.service';
import { RequestModel } from 'src/common/models/request.model';
import { ProductThicknessCompatibilityModel } from './models/product-thickness-compatibility.model';
import {
  CreateProductThicknessCompatibilityDto,
  UpdateProductCompatibilityDto,
  ProductThicknessCompatibilityQueryDto,
} from './dtos/product-thickness-compatibility.dto';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';

@ApiTags('Product Thickness Compatibility')
@Controller('api/v1/product-thickness-compatibility')
@Roles(RoleType.Admin)
export class ProductThicknessCompatibilityController {
  constructor(
    private readonly compatibilityService: ProductThicknessCompatibilityService,
  ) {}

  @Get('list')
  @ApiOperation({ summary: 'Get all product thickness compatibilities' })
  @ApiResponse({
    status: 200,
    description: 'List of product thickness compatibilities',
    type: [ProductThicknessCompatibilityModel],
  })
  async getCompatibilities(
    @Query() query: ProductThicknessCompatibilityQueryDto,
  ): Promise<ProductThicknessCompatibilityModel[]> {
    return await this.compatibilityService.getCompatibilities(
      query.productId,
      query.lensThicknessId,
    );
  }

  @Get('product/:productId/thickness-ids')
  @ApiOperation({ summary: 'Get compatible lens thickness IDs for a product' })
  @ApiResponse({
    status: 200,
    description: 'Array of compatible lens thickness IDs',
    type: [Number],
  })
  async getCompatibleThicknessIds(
    @Param('productId') productId: number,
  ): Promise<number[]> {
    return await this.compatibilityService.getCompatibleThicknessIdsByProductId(
      Number(productId),
    );
  }

  @Get('thickness/:thicknessId/product-ids')
  @ApiOperation({ summary: 'Get compatible product IDs for a lens thickness' })
  @ApiResponse({
    status: 200,
    description: 'Array of compatible product IDs',
    type: [Number],
  })
  async getCompatibleProductIds(
    @Param('thicknessId') thicknessId: number,
  ): Promise<number[]> {
    return await this.compatibilityService.getCompatibleProductIdsByThicknessId(
      Number(thicknessId),
    );
  }

  @Get('check/:productId/:thicknessId')
  @ApiOperation({
    summary: 'Check if product and lens thickness are compatible',
  })
  @ApiResponse({
    status: 200,
    description: 'Boolean indicating compatibility',
    type: Boolean,
  })
  async checkCompatibility(
    @Param('productId') productId: number,
    @Param('thicknessId') thicknessId: number,
  ): Promise<{ compatible: boolean }> {
    const compatible = await this.compatibilityService.isCompatible(
      Number(productId),
      Number(thicknessId),
    );
    return { compatible };
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new product thickness compatibility' })
  @ApiResponse({
    status: 201,
    description: 'Product thickness compatibility created successfully',
    type: ProductThicknessCompatibilityModel,
  })
  async createCompatibility(
    @Req() req: RequestModel,
    @Body() body: CreateProductThicknessCompatibilityDto,
  ): Promise<ProductThicknessCompatibilityModel> {
    return await this.compatibilityService.createCompatibility(
      body.productId,
      body.lensThicknessId,
      req.user.userId,
    );
  }

  @Put('product/:productId/compatibilities')
  @ApiOperation({ summary: 'Update all compatibilities for a product' })
  @ApiResponse({
    status: 200,
    description: 'Product compatibilities updated successfully',
    type: [ProductThicknessCompatibilityModel],
  })
  async updateProductCompatibilities(
    @Req() req: RequestModel,
    @Param('productId') productId: number,
    @Body() body: UpdateProductCompatibilityDto,
  ): Promise<ProductThicknessCompatibilityModel[]> {
    return await this.compatibilityService.updateProductCompatibilities(
      Number(productId),
      body.lensThicknessIds,
      req.user.userId,
    );
  }

  @Delete(':productId/:thicknessId')
  @ApiOperation({
    summary: 'Delete a specific product thickness compatibility',
  })
  @ApiResponse({
    status: 200,
    description: 'Product thickness compatibility deleted successfully',
    type: Boolean,
  })
  async deleteCompatibility(
    @Req() req: RequestModel,
    @Param('productId') productId: number,
    @Param('thicknessId') thicknessId: number,
  ): Promise<{ success: boolean }> {
    const success = await this.compatibilityService.deleteCompatibility(
      Number(productId),
      Number(thicknessId),
      req.user.userId,
    );
    return { success };
  }

  @Delete('product/:productId/all')
  @ApiOperation({ summary: 'Delete all compatibilities for a product' })
  @ApiResponse({
    status: 200,
    description: 'All product compatibilities deleted successfully',
    type: Boolean,
  })
  async deleteProductCompatibilities(
    @Req() req: RequestModel,
    @Param('productId') productId: number,
  ): Promise<{ success: boolean }> {
    const success =
      await this.compatibilityService.deleteCompatibilitiesByProductId(
        Number(productId),
        req.user.userId,
      );
    return { success };
  }
}
