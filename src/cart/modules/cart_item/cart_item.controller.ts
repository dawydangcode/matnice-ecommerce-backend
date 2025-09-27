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
import { ApiTags } from '@nestjs/swagger';
import { CartItemService } from './cart_item.service';
import { RequestModel } from 'src/common/models/request.model';
import {
  CreateCartItemBodyDto,
  UpdateCartItemBodyDto,
  CartItemQueryDto,
  GetCartItemParamsDto,
} from './dtos/cart_item.dto';
import { CartItemModel } from './models/cart_item.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';

@ApiTags('Cart / Cart Item')
@Controller('api/v1/cart-item')
@Roles(RoleType.Admin, RoleType.User, RoleType.Employee, RoleType.Guest)
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Get('list')
  async getCartItems(
    @Query() query: CartItemQueryDto,
  ): Promise<CartItemModel[]> {
    if (query.cartId) {
      return await this.cartItemService.getCartItemsByCartId(query.cartId);
    }
    return [];
  }

  @Get(':cartItemId/detail')
  async getCartItemById(
    @Param() params: GetCartItemParamsDto,
  ): Promise<CartItemModel> {
    return await this.cartItemService.getCartItemById(params.cartItemId);
  }

  @Post('create')
  async createCartItem(
    @Req() req: RequestModel,
    @Body() body: CreateCartItemBodyDto,
  ): Promise<CartItemModel> {
    // Check if item already exists
    const existingItem = await this.cartItemService.getCartItemByProductAndLens(
      body.cartId,
      body.productId,
      body.lensId,
    );

    if (existingItem) {
      // Update quantity if item exists
      return await this.cartItemService.updateCartItemQuantity(
        existingItem,
        existingItem.quantity + body.quantity,
        req.user.userId,
      );
    }

    return await this.cartItemService.createCartItem(
      body.cartId,
      body.productId,
      body.lensId,
      body.quantity,
      req.user.userId,
    );
  }

  @Put(':cartItemId/update')
  async updateCartItem(
    @Req() req: RequestModel,
    @Param() params: GetCartItemParamsDto,
    @Body() body: UpdateCartItemBodyDto,
  ): Promise<CartItemModel> {
    const cartItem = await this.cartItemService.getCartItemById(
      params.cartItemId,
    );
    return await this.cartItemService.updateCartItemQuantity(
      cartItem,
      body.quantity,
      req.user.userId,
    );
  }

  @Delete(':cartItemId/delete')
  async deleteCartItem(
    @Req() req: RequestModel,
    @Param() params: GetCartItemParamsDto,
  ): Promise<boolean> {
    const cartItem = await this.cartItemService.getCartItemById(
      params.cartItemId,
    );
    return await this.cartItemService.deleteCartItem(cartItem, req.user.userId);
  }

  @Get('cart/:cartId/summary')
  async getCartSummary(@Param('cartId') cartId: number): Promise<{
    totalItems: number;
    totalAmount: number;
    items: CartItemModel[];
  }> {
    return await this.cartItemService.getCartSummary(cartId);
  }

  @Get('cart/:cartId/with-details')
  async getCartItemsWithDetails(
    @Param('cartId') cartId: number,
  ): Promise<CartItemModel[]> {
    return await this.cartItemService.getCartItemsWithDetails(cartId);
  }

  @Get('cart/:cartId/count')
  async countCartItems(@Param('cartId') cartId: number): Promise<number> {
    return await this.cartItemService.countCartItems(cartId);
  }

  @Delete('cart/:cartId/clear')
  async clearCartItems(
    @Req() req: RequestModel,
    @Param('cartId') cartId: number,
  ): Promise<boolean> {
    return await this.cartItemService.clearCartItems(cartId, req.user.userId);
  }
}
