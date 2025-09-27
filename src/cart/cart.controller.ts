import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartCombinedService } from './modules/cart-combined.service';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';

@ApiTags('cart')
@Controller('/api/v1/cart')
@Roles(RoleType.Admin, RoleType.User, RoleType.Employee, RoleType.Guest)
export class CartController {
  constructor(private readonly cartCombinedService: CartCombinedService) {}

  @Get(':cartId/items-with-details')
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
