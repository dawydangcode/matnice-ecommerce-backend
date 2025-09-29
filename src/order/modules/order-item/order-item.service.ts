import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderItemModel } from './models/order-item.model';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import {
  CreateOrderItemDto,
  UpdateOrderItemDto,
  GetOrderItemsQueryDto,
} from './dtos/order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async createOrderItem(
    createOrderItemDto: CreateOrderItemDto,
    userId: number,
  ): Promise<OrderItemModel> {
    try {
      console.log(
        '[OrderItemService] Creating order item with DTO:',
        createOrderItemDto,
      );
      console.log('[OrderItemService] userId:', userId);

      const orderItemEntity = new OrderItemEntity();
      orderItemEntity.orderId = createOrderItemDto.orderId;
      orderItemEntity.productId = createOrderItemDto.productId;
      orderItemEntity.quantity = createOrderItemDto.quantity;
      orderItemEntity.framePrice = createOrderItemDto.framePrice;
      orderItemEntity.totalPrice = createOrderItemDto.totalPrice;
      orderItemEntity.discount = createOrderItemDto.discount || 0;
      orderItemEntity.selectedColorId = createOrderItemDto.selectedColorId;
      orderItemEntity.createdBy = userId;
      orderItemEntity.updatedBy = userId;

      console.log('[OrderItemService] Created entity:', orderItemEntity);

      const savedOrderItem =
        await this.orderItemRepository.save(orderItemEntity);

      console.log('[OrderItemService] Saved order item:', savedOrderItem);
      return savedOrderItem.toModel();
    } catch (error) {
      console.error('[OrderItemService] Error creating order item:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack =
        error instanceof Error ? error.stack : 'No stack trace available';
      console.error('[OrderItemService] Error message:', errorMessage);
      console.error('[OrderItemService] Error stack:', errorStack);
      throw new HttpException(
        `Failed to create order item: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderItems(
    params: GetOrderItemsQueryDto,
  ): Promise<PageList<OrderItemModel>> {
    try {
      const pagination = new PaginationParamsModel(params.page, params.limit);
      const queryBuilder = this.orderItemRepository
        .createQueryBuilder('orderItem')
        .leftJoinAndSelect('orderItem.lensDetails', 'lensDetails')
        .where('orderItem.deletedAt IS NULL');

      // Add filters
      if (params.orderId) {
        queryBuilder.andWhere('orderItem.orderId = :orderId', {
          orderId: params.orderId,
        });
      }

      if (params.productId) {
        queryBuilder.andWhere('orderItem.productId = :productId', {
          productId: params.productId,
        });
      }

      // Add pagination
      if (pagination) {
        const paginationQuery = pagination.toQuery();
        queryBuilder.skip(paginationQuery.skip).take(paginationQuery.take);
      }

      // Order by created date descending
      queryBuilder.orderBy('orderItem.createdAt', 'DESC');

      const [orderItems, total] = await queryBuilder.getManyAndCount();

      const orderItemModels = orderItems.map((orderItem) =>
        orderItem.toModel(),
      );

      return new PageList<OrderItemModel>(total, orderItemModels);
    } catch (error) {
      throw new HttpException(
        'Failed to get order items',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderItemById(id: number): Promise<OrderItemModel> {
    try {
      const orderItem = await this.orderItemRepository.findOne({
        where: { id, deletedAt: IsNull() },
        relations: ['lensDetails'],
      });

      if (!orderItem) {
        throw new HttpException('Order item not found', HttpStatus.NOT_FOUND);
      }

      return orderItem.toModel();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get order item',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItemModel[]> {
    try {
      const orderItems = await this.orderItemRepository.find({
        where: { orderId, deletedAt: IsNull() },
        relations: ['lensDetails'],
        order: { createdAt: 'DESC' },
      });

      return orderItems.map((orderItem) => orderItem.toModel());
    } catch (error) {
      throw new HttpException(
        'Failed to get order items for order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrderItem(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
    userId: number,
  ): Promise<OrderItemModel> {
    try {
      // Check if order item exists
      const existingOrderItem = await this.orderItemRepository.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!existingOrderItem) {
        throw new HttpException('Order item not found', HttpStatus.NOT_FOUND);
      }

      // Update order item
      await this.orderItemRepository.update(
        { id, deletedAt: IsNull() },
        {
          ...updateOrderItemDto,
          updatedBy: userId,
        },
      );

      return await this.getOrderItemById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update order item',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteOrderItem(id: number, userId: number): Promise<boolean> {
    try {
      const existingOrderItem = await this.orderItemRepository.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!existingOrderItem) {
        throw new HttpException('Order item not found', HttpStatus.NOT_FOUND);
      }

      // Soft delete order item
      await this.orderItemRepository.update(
        { id, deletedAt: IsNull() },
        {
          deletedAt: new Date(),
          deletedBy: userId,
        },
      );

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete order item',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async calculateOrderItemTotal(
    framePrice: number,
    quantity: number,
    discount: number = 0,
  ): Promise<number> {
    const subtotal = framePrice * quantity;
    return subtotal - discount;
  }
}
