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
import { throwError } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { CartCombinedService } from '../cart/modules/cart-combined.service';
import { OrderItemService } from './modules/order-item/order-item.service';
import { OrderLensDetailService } from './modules/order-lens-detail/order-lens-detail.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly cartService: CartService,
    private readonly cartCombinedService: CartCombinedService,
    private readonly orderItemService: OrderItemService,
    private readonly orderLensDetailService: OrderLensDetailService,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<OrderModel> {
    try {
      // Get user's cart
      const userCart = await this.cartService.getCartByUserId(userId);

      // Get user's cart items with full details
      const cartItems =
        await this.cartCombinedService.getCartItemsWithFullDetails(userCart.id);

      if (!cartItems || cartItems.length === 0) {
        throw new HttpException(
          'Cannot create order: Cart is empty',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Use actual cart ID
      const currentCartId = userCart.id;

      // Create order entity
      const orderEntity = new OrderEntity();
      orderEntity.userId = userId; // Use userId from JWT token
      orderEntity.cartId = currentCartId; // Use actual cart ID
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

      // Create order items from cart items
      console.log(
        `[OrderService] Creating order items for ${cartItems.length} cart items`,
      );

      for (let i = 0; i < cartItems.length; i++) {
        const cartItem = cartItems[i];
        console.log(`[OrderService] Processing cart item ${i + 1}:`, {
          frameId: cartItem.frame.id,
          productId: cartItem.frame.productId,
          hasLensDetail: !!cartItem.lensDetail,
        });

        try {
          const orderItemDto = {
            orderId: savedOrder.id,
            productId: cartItem.frame.productId,
            quantity: cartItem.frame.quantity,
            framePrice: cartItem.frame.framePrice,
            totalPrice: cartItem.frame.totalPrice,
            discount: cartItem.frame.discount || 0,
            selectedColorId: cartItem.frame.selectedColorId,
          };

          console.log(
            `[OrderService] Creating order item with DTO:`,
            orderItemDto,
          );
          const orderItem = await this.orderItemService.createOrderItem(
            orderItemDto,
            userId,
          );
          console.log(
            `[OrderService] Created order item with ID: ${orderItem.id}`,
          );

          // Create lens details if exists
          if (cartItem.lensDetail) {
            console.log(
              `[OrderService] Creating lens detail for order item ${orderItem.id}`,
            );

            const lensDetailDto = {
              orderItemId: orderItem.id,
              lensVariantId: cartItem.lensDetail.lensId || 1, // Default lens variant ID
              rightEyeSphere: cartItem.lensDetail.rightEyeSphere || 0,
              rightEyeCylinder: cartItem.lensDetail.rightEyeCylinder || 0,
              rightEyeAxis: cartItem.lensDetail.rightEyeAxis || 0,
              leftEyeSphere: cartItem.lensDetail.leftEyeSphere || 0,
              leftEyeCylinder: cartItem.lensDetail.leftEyeCylinder || 0,
              leftEyeAxis: cartItem.lensDetail.leftEyeAxis || 0,
              pdLeft: cartItem.lensDetail.pdLeft || 31.5,
              pdRight: cartItem.lensDetail.pdRight || 31.5,
              lensPrice: cartItem.lensDetail.lensPrice || 0,
              prescriptionNotes: cartItem.lensDetail.prescriptionNotes || '',
              lensNotes: cartItem.lensDetail.lensNotes || '',
              addLeft: cartItem.lensDetail.addLeft,
              addRight: cartItem.lensDetail.addRight,
              createdBy: userId,
            };

            console.log(
              `[OrderService] Creating lens detail with DTO:`,
              lensDetailDto,
            );
            await this.orderLensDetailService.create(lensDetailDto);
            console.log(`[OrderService] Created lens detail successfully`);
          }
        } catch (itemError) {
          console.error(
            `[OrderService] Error processing cart item ${i + 1}:`,
            itemError,
          );
          throw itemError;
        }
      }

      console.log(`[OrderService] Successfully created all order items`);

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
