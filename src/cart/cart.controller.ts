import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartCombinedService } from './modules/cart-combined.service';
import { CartService } from './cart.service';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';
import { RequestModel } from 'src/common/models/request.model';

@ApiTags('cart')
@Controller('/api/v1/cart')
@Roles(RoleType.Admin, RoleType.User, RoleType.Employee, RoleType.Guest)
export class CartController {
  constructor(
    private readonly cartCombinedService: CartCombinedService,
    private readonly cartService: CartService,
  ) {}

  @Get('my-cart/items-with-details')
  @ApiOperation({ summary: 'Get current user cart items with details' })
  @ApiResponse({
    status: 200,
    description: 'User cart items retrieved successfully',
  })
  async getMyCartItemsWithDetails(@Req() req: RequestModel) {
    console.log('=== MY CART ITEMS WITH DETAILS CALLED ===');
    console.log('User ID from request:', req.user.userId);

    // Get or create cart for current user
    const cart = await this.cartService.findOrCreateCartForUser(
      req.user.userId,
    );

    console.log('Cart found/created:', cart);
    console.log('Cart ID:', cart.id, 'Type:', typeof cart.id);

    if (
      !cart.id ||
      cart.id === null ||
      cart.id === undefined ||
      isNaN(cart.id)
    ) {
      throw new Error(`Invalid cart ID: ${cart.id}`);
    }

    return await this.cartCombinedService.getCartItemsWithFullDetails(cart.id);
  }

  @Get('my-cart/summary')
  @ApiOperation({ summary: 'Get current user cart summary' })
  @ApiResponse({
    status: 200,
    description: 'User cart summary retrieved successfully',
  })
  async getMyCartSummary(@Req() req: RequestModel) {
    console.log('User ID from request (summary):', req.user.userId);

    // Get or create cart for current user
    const cart = await this.cartService.findOrCreateCartForUser(
      req.user.userId,
    );

    console.log('Cart found/created (summary):', cart);
    console.log('Cart ID (summary):', cart.id, 'Type:', typeof cart.id);

    if (
      !cart.id ||
      cart.id === null ||
      cart.id === undefined ||
      isNaN(cart.id)
    ) {
      throw new Error(`Invalid cart ID: ${cart.id}`);
    }

    return await this.cartCombinedService.getCartSummary(cart.id);
  }

  @Get(':cartId/items-with-details')
  async getCartItemsWithDetails(@Param('cartId') cartId: number) {
    const cartIdNum = Number(cartId);
    console.log(
      `[CartController] Received cartId:`,
      cartId,
      `Type:`,
      typeof cartId,
      `Converted:`,
      cartIdNum,
    );
    if (isNaN(cartIdNum) || cartIdNum <= 0) {
      throw new Error(
        `[CartController] Invalid cartId received: ${cartId} (type: ${typeof cartId})`,
      );
    }
    return await this.cartCombinedService.getCartItemsWithFullDetails(
      cartIdNum,
    );
  }

  @Get(':cartId/summary')
  @ApiOperation({ summary: 'Get cart summary' })
  @ApiResponse({
    status: 200,
    description: 'Cart summary retrieved successfully',
  })
  async getCartSummary(@Param('cartId') cartId: number) {
    const cartIdNum = Number(cartId);
    console.log(
      `[CartController] getCartSummary received cartId:`,
      cartId,
      `Type:`,
      typeof cartId,
      `Converted:`,
      cartIdNum,
    );
    if (isNaN(cartIdNum) || cartIdNum <= 0) {
      throw new Error(
        `[CartController] Invalid cartId received in getCartSummary: ${cartId} (type: ${typeof cartId})`,
      );
    }
    return await this.cartCombinedService.getCartSummary(cartIdNum);
  }

  @Get('debug/create-cart')
  @ApiOperation({ summary: 'Debug: Create a test cart' })
  async debugCreateCart(@Req() req: RequestModel) {
    try {
      console.log('[DEBUG] Creating cart for userId:', req.user.userId);
      const cart = await this.cartService.createCart(req.user.userId);
      console.log('[DEBUG] Created cart:', cart);
      return {
        success: true,
        cart,
        cartId: cart.id,
        cartIdType: typeof cart.id,
      };
    } catch (error: any) {
      console.error('[DEBUG] Error creating cart:', error);
      return {
        success: false,
        error: error?.message || 'Unknown error',
      };
    }
  }
}
