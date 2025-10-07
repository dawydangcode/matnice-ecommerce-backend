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
import { CartFrameService } from './cart_frame.service';
import { RequestModel } from 'src/common/models/request.model';
import {
  CreateCartFrameDto,
  UpdateCartFrameDto,
  CartFrameQueryDto,
  GetCartFrameParamsDto,
} from './dtos/cart_frame.dto';
import { CartFrameModel } from './models/cart_frame.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';

@ApiTags('Cart / Cart Frame')
@Controller('api/v1/cart-frame')
export class CartFrameController {
  constructor(private readonly cartFrameService: CartFrameService) {}

  @Get('list')
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  async getCartFrames(
    @Query() query: CartFrameQueryDto,
  ): Promise<CartFrameModel[]> {
    if (query.cartId) {
      return await this.cartFrameService.getCartFramesByCartId(query.cartId);
    }
    return [];
  }

  @Get(':cartFrameId/detail')
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  async getCartFrameById(
    @Param() params: GetCartFrameParamsDto,
  ): Promise<CartFrameModel> {
    return await this.cartFrameService.getCartFrameById(params.cartFrameId);
  }

  @Post('create')
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  async createCartFrame(
    @Req() req: RequestModel,
    @Body() body: CreateCartFrameDto,
  ): Promise<CartFrameModel> {
    // Check if frame already exists in cart
    const existingFrame = await this.cartFrameService.getCartFrameByProductId(
      body.cartId,
      body.productId,
    );

    if (existingFrame) {
      // Update quantity if frame exists
      return await this.cartFrameService.updateCartFrameQuantity(
        existingFrame,
        existingFrame.quantity + body.quantity,
        req.user.userId,
      );
    }

    return await this.cartFrameService.createCartFrame(
      body.cartId,
      body.productId,
      body.quantity,
      body.framePrice,
      body.totalPrice,
      body.discount || 0,
      req.user.userId,
      body.selectedColorId,
    );
  }

  @Put(':cartFrameId/update')
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  async updateCartFrame(
    @Req() req: RequestModel,
    @Param() params: GetCartFrameParamsDto,
    @Body() body: UpdateCartFrameDto,
  ): Promise<CartFrameModel> {
    const cartFrame = await this.cartFrameService.getCartFrameById(
      params.cartFrameId,
    );

    const updates: any = {};
    if (body.quantity !== undefined) updates.quantity = body.quantity;
    if (body.framePrice !== undefined) updates.framePrice = body.framePrice;
    if (body.totalPrice !== undefined) updates.totalPrice = body.totalPrice;
    if (body.discount !== undefined) updates.discount = body.discount;
    if (body.selectedColorId !== undefined)
      updates.selectedColorId = body.selectedColorId;

    return await this.cartFrameService.updateCartFrame(
      cartFrame,
      updates,
      req.user.userId,
    );
  }

  @Put(':cartFrameId/quantity')
  async updateCartFrameQuantity(
    @Req() req: RequestModel,
    @Param() params: GetCartFrameParamsDto,
    @Body('quantity') quantity: number,
  ): Promise<CartFrameModel> {
    const cartFrame = await this.cartFrameService.getCartFrameById(
      params.cartFrameId,
    );

    return await this.cartFrameService.updateCartFrameQuantity(
      cartFrame,
      quantity,
      req.user.userId,
    );
  }

  @Delete(':cartFrameId/delete')
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  async deleteCartFrame(
    @Req() req: RequestModel,
    @Param() params: GetCartFrameParamsDto,
  ): Promise<boolean> {
    const cartFrame = await this.cartFrameService.getCartFrameById(
      params.cartFrameId,
    );
    return await this.cartFrameService.deleteCartFrame(
      cartFrame,
      req.user.userId,
    );
  }

  @Get('cart/:cartId/summary')
  async getCartFrameSummary(@Param('cartId') cartId: number): Promise<{
    totalFrames: number;
    totalPrice: number;
    frames: CartFrameModel[];
  }> {
    const frames = await this.cartFrameService.getCartFramesByCartId(cartId);
    const totalPrice =
      await this.cartFrameService.getCartFramesTotalPrice(cartId);

    return {
      totalFrames: frames.length,
      totalPrice,
      frames,
    };
  }

  @Get('cart/:cartId/count')
  async countCartFrames(@Param('cartId') cartId: number): Promise<number> {
    return await this.cartFrameService.countCartFrames(cartId);
  }

  @Delete('cart/:cartId/clear')
  async clearCartFrames(
    @Req() req: RequestModel,
    @Param('cartId') cartId: number,
  ): Promise<boolean> {
    return await this.cartFrameService.clearCartFrames(cartId, req.user.userId);
  }
}
