import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartCombinedService } from './modules/cart-combined.service';

@ApiTags('cart')
@Controller('/api/v1/cart')
export class CartController {
  constructor(private readonly cartCombinedService: CartCombinedService) {}

  @Get(':cartId/items-with-details')
  @ApiOperation({ summary: 'Get cart items with full details' })
  @ApiResponse({
    status: 200,
    description: 'Cart items retrieved successfully',
  })
  async getCartItemsWithDetails(@Param('cartId') cartId: number) {
    return await this.cartCombinedService.getCartItemsWithFullDetails(cartId);
  }

  @Get(':cartId/summary')
  @ApiOperation({ summary: 'Get cart summary' })
  @ApiResponse({
    status: 200,
    description: 'Cart summary retrieved successfully',
  })
  async getCartSummary(@Param('cartId') cartId: number) {
    return await this.cartCombinedService.getCartSummary(cartId);
  }
}
