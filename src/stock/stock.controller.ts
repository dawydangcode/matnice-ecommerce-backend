import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { StockService, OrderStockUpdateResult } from './stock.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Stock Management')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('orders/:orderId/reduce')
  @ApiOperation({ summary: 'Manually reduce stock for an order' })
  @ApiResponse({ status: 200, description: 'Stock reduced successfully' })
  @ApiResponse({
    status: 400,
    description: 'Insufficient stock or invalid order',
  })
  async reduceStockForOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() body: { userId: number },
  ): Promise<OrderStockUpdateResult> {
    return await this.stockService.reduceStockForOrder(
      orderId,
      body.userId || 1,
    );
  }

  @Post('orders/:orderId/restore')
  @ApiOperation({ summary: 'Manually restore stock for an order' })
  @ApiResponse({ status: 200, description: 'Stock restored successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order' })
  async restoreStockForOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() body: { userId: number },
  ): Promise<OrderStockUpdateResult> {
    return await this.stockService.restoreStockForOrder(
      orderId,
      body.userId || 1,
    );
  }

  @Get('orders/:orderId/check')
  @ApiOperation({ summary: 'Check stock availability for an order' })
  @ApiResponse({ status: 200, description: 'Stock availability checked' })
  async checkOrderStockAvailability(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<{
    available: boolean;
    issues: string[];
  }> {
    return await this.stockService.checkOrderStockAvailability(orderId);
  }

  @Post('product-colors/:productColorId/update')
  @ApiOperation({ summary: 'Manually update stock for a product color' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully' })
  async updateProductColorStock(
    @Param('productColorId', ParseIntPipe) productColorId: number,
    @Body() body: { stock: number; userId: number },
  ): Promise<{ message: string }> {
    await this.stockService.updateStock(
      productColorId,
      body.stock,
      body.userId || 1,
    );
    return { message: 'Stock updated successfully' };
  }

  @Post('lens-variants/:lensVariantId/update')
  @ApiOperation({ summary: 'Manually update stock for a lens variant' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully' })
  async updateLensVariantStock(
    @Param('lensVariantId', ParseIntPipe) lensVariantId: number,
    @Body() body: { stock: number; userId: number },
  ): Promise<{ message: string }> {
    await this.stockService.updateLensVariantStock(
      lensVariantId,
      body.stock,
      body.userId || 1,
    );
    return { message: 'Stock updated successfully' };
  }

  @Get('items')
  @ApiOperation({ summary: 'Get all stock items (products + lens variants)' })
  @ApiResponse({
    status: 200,
    description: 'Stock items retrieved successfully',
  })
  async getAllStockItems(): Promise<
    Array<{
      id: number;
      name: string;
      type: 'product' | 'lens-variant';
      stock: number;
      status: 'in-stock' | 'low-stock' | 'out-of-stock';
      [key: string]: any;
    }>
  > {
    return await this.stockService.getAllStockItems();
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all product color stock' })
  @ApiResponse({
    status: 200,
    description: 'Product stock retrieved successfully',
  })
  async getAllProductColorStock(): Promise<
    Array<{
      id: number;
      name: string;
      type: 'product';
      stock: number;
      status: 'in-stock' | 'low-stock' | 'out-of-stock';
      productName: string;
      colorName: string;
      productId: number;
    }>
  > {
    return await this.stockService.getAllProductColorStock();
  }

  @Get('lens-variants')
  @ApiOperation({ summary: 'Get all lens variant stock' })
  @ApiResponse({
    status: 200,
    description: 'Lens variant stock retrieved successfully',
  })
  async getAllLensVariantStock(): Promise<
    Array<{
      id: number;
      name: string;
      type: 'lens-variant';
      stock: number;
      status: 'in-stock' | 'low-stock' | 'out-of-stock';
      material: string;
      design: string;
      lensId: number;
    }>
  > {
    return await this.stockService.getAllLensVariantStock();
  }
}
