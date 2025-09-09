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
}
