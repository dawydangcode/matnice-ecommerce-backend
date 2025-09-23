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
    const cart = await this.cartRepository.findOne({
      where: { userId: userId, deletedAt: IsNull() },
    });

    if (!cart) {
      throw new Error('Cart not found for the user');
    }
    return cart.toModel();
  }

  async getCartById(cartId: number): Promise<CartModel | null> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId, deletedAt: IsNull() },
    });

    return cart ? cart.toModel() : null;
  }

  async createCart(userId: number): Promise<CartModel> {
    const entity = new CartEntity();
    entity.userId = userId;
    entity.createdAt = new Date();
    entity.createdBy = userId;
    entity.updatedAt = new Date();
    entity.updatedBy = userId;

    const savedCart = await this.cartRepository.save(entity);
    return savedCart.toModel();
  }

  async findOrCreateCartForUser(userId: number): Promise<CartModel> {
    try {
      return await this.getCartByUserId(userId);
    } catch (error) {
      // Cart not found, create new one
      return await this.createCart(userId);
    }
  }
}
