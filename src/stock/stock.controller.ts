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
}
