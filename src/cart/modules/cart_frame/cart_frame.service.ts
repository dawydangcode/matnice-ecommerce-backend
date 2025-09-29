import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CartFrameEntity } from './entities/cart_frame.entity';
import { CartFrameModel } from './models/cart_frame.model';

@Injectable()
export class CartFrameService {
  constructor(
    @InjectRepository(CartFrameEntity)
    private readonly cartFrameRepository: Repository<CartFrameEntity>,
  ) {}

  async getCartFrameById(id: number): Promise<CartFrameModel> {
    const cartFrame = await this.cartFrameRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!cartFrame) {
      throw new HttpException('Cart frame not found', HttpStatus.NOT_FOUND);
    }

    return cartFrame.toModel();
  }

  async getCartFramesByCartId(cartId: number): Promise<CartFrameModel[]> {
    console.log(
      '[CartFrameService] getCartFramesByCartId called with cartId:',
      cartId,
      'Type:',
      typeof cartId,
    );

    if (!cartId || cartId === null || cartId === undefined || isNaN(cartId)) {
      throw new Error(
        `[CartFrameService] Invalid cartId passed: ${cartId} (type: ${typeof cartId})`,
      );
    }

    const cartFrames = await this.cartFrameRepository.find({
      where: { cartId, deletedAt: IsNull() },
      order: { addedAt: 'DESC' },
    });

    console.log('[CartFrameService] Found cartFrames:', cartFrames.length);
    return cartFrames.map((frame) => frame.toModel());
  }

  async getCartFrameByProductId(
    cartId: number,
    productId: number,
  ): Promise<CartFrameModel | undefined> {
    const cartFrame = await this.cartFrameRepository.findOne({
      where: {
        cartId,
        productId,
        deletedAt: IsNull(),
      },
    });

    if (!cartFrame) {
      throw new HttpException(
        'Cart frame not found for the given product',
        HttpStatus.NOT_FOUND,
      );
    }

    return cartFrame.toModel();
  }

  async createCartFrame(
    cartId: number,
    productId: number,
    quantity: number,
    framePrice: number,
    totalPrice: number,
    discount: number = 0,
    reqUserId: number,
    selectedColorId?: number,
  ): Promise<CartFrameModel> {
    const entity = new CartFrameEntity();
    entity.cartId = cartId;
    entity.productId = productId;
    entity.quantity = quantity;
    entity.framePrice = framePrice;
    entity.totalPrice = totalPrice;
    entity.discount = discount;
    entity.selectedColorId = selectedColorId;
    entity.addedAt = new Date();
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;
    entity.updatedAt = new Date();
    entity.updatedBy = reqUserId;

    const savedCartFrame = await this.cartFrameRepository.save(entity);
    return savedCartFrame.toModel();
  }

  async updateCartFrame(
    cartFrame: CartFrameModel,
    updates: {
      quantity?: number;
      framePrice?: number;
      totalPrice?: number;
      discount?: number;
      selectedColorId?: number;
    },
    reqUserId: number,
  ): Promise<CartFrameModel> {
    const updateData: any = {
      updatedAt: new Date(),
      updatedBy: reqUserId,
    };

    if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
    if (updates.framePrice !== undefined)
      updateData.framePrice = updates.framePrice;
    if (updates.totalPrice !== undefined)
      updateData.totalPrice = updates.totalPrice;
    if (updates.discount !== undefined) updateData.discount = updates.discount;
    if (updates.selectedColorId !== undefined)
      updateData.selectedColorId = updates.selectedColorId;

    await this.cartFrameRepository.update(
      { id: cartFrame.id, deletedAt: IsNull() },
      updateData,
    );

    return await this.getCartFrameById(cartFrame.id);
  }

  async updateCartFrameQuantity(
    cartFrame: CartFrameModel,
    newQuantity: number,
    reqUserId: number,
  ): Promise<CartFrameModel> {
    const newTotalPrice =
      (cartFrame.framePrice - cartFrame.discount) * newQuantity;

    return await this.updateCartFrame(
      cartFrame,
      {
        quantity: newQuantity,
        totalPrice: newTotalPrice,
      },
      reqUserId,
    );
  }

  async deleteCartFrame(
    cartFrame: CartFrameModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.cartFrameRepository.update(
      { id: cartFrame.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async clearCartFrames(cartId: number, reqUserId: number): Promise<boolean> {
    await this.cartFrameRepository.update(
      { cartId, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async countCartFrames(cartId: number): Promise<number> {
    return await this.cartFrameRepository.count({
      where: { cartId, deletedAt: IsNull() },
    });
  }

  async getCartFramesTotalPrice(cartId: number): Promise<number> {
    const result = await this.cartFrameRepository
      .createQueryBuilder('cf')
      .select('SUM(cf.totalPrice)', 'total')
      .where('cf.cartId = :cartId', { cartId })
      .andWhere('cf.deletedAt IS NULL')
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async getCartFramesWithDetails(cartId: number): Promise<CartFrameModel[]> {
    // In future, này có thể join với Product table để lấy thêm thông tin
    return await this.getCartFramesByCartId(cartId);
  }
}
