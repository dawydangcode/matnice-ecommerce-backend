import { Inject, Injectable } from '@nestjs/common';
import { CartEntity } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CartModel } from './models/cart.model';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  async getCartByUserId(userId: number): Promise<CartModel> {
    console.log('[CartService] getCartByUserId called with userId:', userId);
    const cart = await this.cartRepository.findOne({
      where: { userId: userId, deletedAt: IsNull() },
    });

    console.log('[CartService] getCartByUserId found cart:', cart);
    if (!cart) {
      console.log('[CartService] No cart found for userId:', userId);
      throw new Error('Cart not found for the user');
    }
    const model = cart.toModel();
    console.log('[CartService] getCartByUserId returning model:', model);
    return model;
  }

  async getCartById(cartId: number): Promise<CartModel | null> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId, deletedAt: IsNull() },
    });

    return cart ? cart.toModel() : null;
  }

  async createCart(userId: number): Promise<CartModel> {
    console.log('createCart called with userId:', userId);
    const entity = new CartEntity();
    entity.userId = userId;
    entity.createdAt = new Date();
    entity.createdBy = userId;
    entity.updatedAt = new Date();
    entity.updatedBy = userId;

    console.log('Entity before save:', entity);
    const savedCart = await this.cartRepository.save(entity);
    console.log('Entity after save:', savedCart);

    const model = savedCart.toModel();
    console.log('Converted to model:', model);
    console.log('Model ID:', model.id, 'Type:', typeof model.id);

    return model;
  }

  async findOrCreateCartForUser(userId: number): Promise<CartModel> {
    console.log(
      '[CartService] findOrCreateCartForUser called with userId:',
      userId,
      'Type:',
      typeof userId,
    );
    try {
      const existingCart = await this.getCartByUserId(userId);
      console.log('[CartService] Found existing cart:', existingCart);
      console.log(
        '[CartService] Existing cart ID:',
        existingCart.id,
        'Type:',
        typeof existingCart.id,
      );

      if (
        !existingCart.id ||
        existingCart.id === null ||
        existingCart.id === undefined ||
        isNaN(existingCart.id)
      ) {
        throw new Error(
          `[CartService] Invalid existing cart ID: ${existingCart.id} (type: ${typeof existingCart.id})`,
        );
      }

      return existingCart;
    } catch (error) {
      console.log(
        '[CartService] Cart not found, creating new one. Error:',
        error instanceof Error ? error.message : String(error),
      );
      // Cart not found, create new one
      const newCart = await this.createCart(userId);
      console.log('[CartService] Created new cart:', newCart);
      console.log(
        '[CartService] New cart ID:',
        newCart.id,
        'Type:',
        typeof newCart.id,
      );

      if (
        !newCart.id ||
        newCart.id === null ||
        newCart.id === undefined ||
        isNaN(newCart.id)
      ) {
        throw new Error(
          `[CartService] Invalid new cart ID: ${newCart.id} (type: ${typeof newCart.id})`,
        );
      }

      return newCart;
    }
  }
}
