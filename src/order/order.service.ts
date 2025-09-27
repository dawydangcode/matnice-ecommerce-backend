import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderModel } from './models/order.model';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import {
  CreateOrderDto,
  UpdateOrderDto,
  GetOrdersQueryDto,
} from './dtos/order.dto';
import { OrderStatus, PaymentStatus } from './enums/order.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<OrderModel> {
    try {
      // Create order entity
      const orderEntity = new OrderEntity();
      orderEntity.userId = createOrderDto.userId;
      orderEntity.cartId = createOrderDto.cartId;
      orderEntity.orderDate = new Date();
      orderEntity.subtotal = createOrderDto.subtotal;
      orderEntity.shippingCost = createOrderDto.shippingCost;
      orderEntity.totalPrice = createOrderDto.totalPrice;
      orderEntity.paymentMethod = createOrderDto.paymentMethod;
      orderEntity.paymentStatus = PaymentStatus.PENDING;
      orderEntity.fullName = createOrderDto.fullName;
      orderEntity.phone = createOrderDto.phone;
      orderEntity.email = createOrderDto.email;
      orderEntity.province = createOrderDto.province;
      orderEntity.district = createOrderDto.district;
      orderEntity.ward = createOrderDto.ward;
      orderEntity.addressDetail = createOrderDto.addressDetail;
      orderEntity.notes = createOrderDto.notes;
      orderEntity.status = OrderStatus.PENDING;
      orderEntity.createdBy = userId;
      orderEntity.updatedBy = userId;

      // Save order
      const savedOrder = await this.orderRepository.save(orderEntity);

      // Note: Order items and lens details are now handled by their respective submodules

      return savedOrder.toModel();
    } catch (error) {
      throw new HttpException(
        'Failed to create order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrders(params: GetOrdersQueryDto): Promise<PageList<OrderModel>> {
    try {
      const pagination = new PaginationParamsModel(params.page, params.limit);
      const queryBuilder = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.orderItems', 'orderItems')
        .leftJoinAndSelect('orderItems.lensDetails', 'lensDetails')
        .where('order.deletedAt IS NULL');

      // Add filters
      if (params.status) {
        queryBuilder.andWhere('order.status = :status', {
          status: params.status,
        });
      }

      if (params.paymentStatus) {
        queryBuilder.andWhere('order.paymentStatus = :paymentStatus', {
          paymentStatus: params.paymentStatus,
        });
      }

      if (params.userId) {
        queryBuilder.andWhere('order.userId = :userId', {
          userId: params.userId,
        });
      }

      if (params.search) {
        queryBuilder.andWhere(
          '(order.trackingNumber LIKE :search OR order.fullName LIKE :search OR order.phone LIKE :search OR order.addressDetail LIKE :search)',
          { search: `%${params.search}%` },
        );
      }

      // Add pagination
      if (pagination) {
        const paginationQuery = pagination.toQuery();
        queryBuilder.skip(paginationQuery.skip).take(paginationQuery.take);
      }

      // Order by created date descending
      queryBuilder.orderBy('order.createdAt', 'DESC');

      const [orders, total] = await queryBuilder.getManyAndCount();

      const orderModels = orders.map((order) => order.toModel());

      return new PageList<OrderModel>(total, orderModels);
    } catch (error) {
      throw new HttpException(
        'Failed to get orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderById(id: number): Promise<OrderModel> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id, deletedAt: IsNull() },
        relations: ['orderItems', 'orderItems.lensDetails'],
      });

      if (!order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      return order.toModel();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
    userId: number,
  ): Promise<OrderModel> {
    try {
      // Check if order exists
      const existingOrder = await this.orderRepository.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!existingOrder) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      // Update order
      await this.orderRepository.update(
        { id, deletedAt: IsNull() },
        {
          ...updateOrderDto,
          updatedBy: userId,
        },
      );

      return await this.getOrderById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteOrder(id: number, userId: number): Promise<boolean> {
    try {
      const existingOrder = await this.orderRepository.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!existingOrder) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      // Soft delete order
      await this.orderRepository.update(
        { id, deletedAt: IsNull() },
        {
          deletedAt: new Date(),
          deletedBy: userId,
        },
      );

      // Note: Related order items and lens details deletion should be handled by their respective submodules

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrdersByUserId(userId: number): Promise<OrderModel[]> {
    try {
      const orders = await this.orderRepository.find({
        where: { userId, deletedAt: IsNull() },
        order: { createdAt: 'DESC' },
      });

      return orders.map((order) => order.toModel());
    } catch (error) {
      throw new HttpException(
        'Failed to get user orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrderStatus(
    id: number,
    status: OrderStatus,
    userId: number,
  ): Promise<OrderModel> {
    try {
      const updateData: any = {
        status,
        updatedBy: userId,
      };

      // Set delivery date when status is delivered
      if (status === OrderStatus.DELIVERED) {
        updateData.deliveryDate = new Date();
      }

      await this.orderRepository.update(
        { id, deletedAt: IsNull() },
        updateData,
      );

      return await this.getOrderById(id);
    } catch (error) {
      throw new HttpException(
        'Failed to update order status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePaymentStatus(
    id: number,
    paymentStatus: PaymentStatus,
    userId: number,
  ): Promise<OrderModel> {
    try {
      await this.orderRepository.update(
        { id, deletedAt: IsNull() },
        {
          paymentStatus,
          updatedBy: userId,
        },
      );

      return await this.getOrderById(id);
    } catch (error) {
      throw new HttpException(
        'Failed to update payment status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
