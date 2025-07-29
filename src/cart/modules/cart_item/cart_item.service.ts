import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CartItemEntity } from './entities/cart_item.entity';
import { CartItemModel } from './models/cart_item.model';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
  ) {}

  async getCartItemsByCartId(cartId: number): Promise<CartItemModel[]> {
    const cartItems = await this.cartItemRepository.find({
      where: {
        cartId: cartId,
        deletedAt: IsNull(),
      },
      // relations: ['product', 'lens'], // Tạm comment
      order: {
        addedAt: 'DESC',
      },
    });

    return cartItems.map((item) => item.toModel());
  }

  async getCartItemById(cartItemId: number): Promise<CartItemModel> {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        id: cartItemId,
        deletedAt: IsNull(),
      },
    });

    if (!cartItem) {
      throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
    }

    return cartItem.toModel();
  }

  async getCartItemByProductAndLens(
    cartId: number,
    productId: number,
    lensId?: number,
  ): Promise<CartItemModel | null> {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        cartId: cartId,
        productId: productId,
        lensId: lensId || IsNull(),
        deletedAt: IsNull(),
      },
    });

    return cartItem ? cartItem.toModel() : null;
  }

  async createCartItem(
    cartId: number,
    productId: number,
    lensId: number | undefined,
    quantity: number,
    reqUserId: number,
  ): Promise<CartItemModel> {
    const entity = new CartItemEntity();
    entity.cartId = cartId;
    entity.productId = productId;
    entity.lensId = lensId || null;
    entity.quantity = quantity;
    entity.addedAt = new Date();
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedCartItem = await this.cartItemRepository.save(entity);
    return savedCartItem.toModel();
  }

  async updateCartItemQuantity(
    cartItem: CartItemModel,
    newQuantity: number,
    reqUserId: number,
  ): Promise<CartItemModel> {
    await this.cartItemRepository.update(
      {
        id: cartItem.id,
        deletedAt: IsNull(),
      },
      {
        quantity: newQuantity,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getCartItemById(cartItem.id);
  }

  async deleteCartItem(
    cartItem: CartItemModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.cartItemRepository.update(
      {
        id: cartItem.id,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async clearCartItems(cartId: number, reqUserId: number): Promise<boolean> {
    await this.cartItemRepository.update(
      {
        cartId: cartId,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async getCartSummary(cartId: number): Promise<{
    totalItems: number;
    totalAmount: number;
    items: CartItemModel[];
  }> {
    const cartItems = await this.cartItemRepository.find({
      where: {
        cartId: cartId,
        deletedAt: IsNull(),
      },
      relations: ['product'],
    });

    const items = cartItems.map((item) => item.toModel());
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const totalAmount = 0;

    return {
      totalItems,
      totalAmount,
      items,
    };
  }

  async getCartItemsWithDetails(cartId: number): Promise<CartItemModel[]> {
    const cartItems = await this.cartItemRepository.find({
      where: {
        cartId: cartId,
        deletedAt: IsNull(),
      },
      // relations: ['product', 'lens', 'product.category', 'product.brand'], // Tạm comment
      order: {
        addedAt: 'DESC',
      },
    });

    return cartItems.map((item) => item.toModel());
  }

  async countCartItems(cartId: number): Promise<number> {
    return await this.cartItemRepository.count({
      where: {
        cartId: cartId,
        deletedAt: IsNull(),
      },
    });
  }

  async validateCartItem(
    cartId: number,
    productId: number,
    lensId?: number,
  ): Promise<boolean> {
    // Add validation logic here
    // Check if product exists, lens exists (if provided), etc.
    return true;
  }
}
