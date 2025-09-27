import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartCombinedService } from './cart-combined.service';
import { RequestModel } from 'src/common/models/request.model';
import {
  CreateCartItemCompleteDto,
  CartSummary,
  AddLensProductToCartDto,
} from './dtos/cart-combined.dto';
import { CartFrameModel } from './cart_frame/models/cart_frame.model';
import { CartLensDetailModel } from './cart_lens_detail/models/cart_lens_detail.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';

@ApiTags('Cart / Combined Operations')
@Controller('api/v1/cart')
@Roles(RoleType.Admin, RoleType.User, RoleType.Employee, RoleType.Guest)
export class CartCombinedController {
  constructor(private readonly cartCombinedService: CartCombinedService) {}

  @Post('item/create-complete')
  async createCartItemComplete(
    @Req() req: RequestModel,
    @Body() body: CreateCartItemCompleteDto,
  ): Promise<{
    frame: CartFrameModel;
    lensDetail?: CartLensDetailModel;
  }> {
    return await this.cartCombinedService.createCartItemComplete(
      body,
      req.user.userId,
    );
  }

  @Post('add-lens-product')
  async addLensProductToCart(
    @Req() req: RequestModel,
    @Body() body: AddLensProductToCartDto,
  ): Promise<{
    frame: CartFrameModel;
    lensDetail: CartLensDetailModel;
  }> {
    return await this.cartCombinedService.addLensProductToCart(
      body,
      req.user.userId,
    );
  }

  @Get(':cartId/summary')
  async getCartSummary(@Param('cartId') cartId: number): Promise<CartSummary> {
    return await this.cartCombinedService.getCartSummary(cartId);
  }

  @Get(':cartId/items-with-details')
  async getCartItemsWithFullDetails(@Param('cartId') cartId: number): Promise<
    {
      frame: CartFrameModel;
      lensDetail?: CartLensDetailModel;
    }[]
  > {
    return await this.cartCombinedService.getCartItemsWithFullDetails(cartId);
  }

  @Delete('item/:cartFrameId/delete-complete')
  async deleteCartItemComplete(
    @Req() req: RequestModel,
    @Param('cartFrameId') cartFrameId: number,
  ): Promise<boolean> {
    return await this.cartCombinedService.deleteCartItemComplete(
      cartFrameId,
      req.user.userId,
    );
  }

  @Delete(':cartId/clear')
  async clearCart(
    @Req() req: RequestModel,
    @Param('cartId') cartId: number,
  ): Promise<boolean> {
    return await this.cartCombinedService.clearCart(cartId, req.user.userId);
  }
}
