import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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
import { StockService } from '../stock/stock.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly cartService: CartService,
    private readonly cartCombinedService: CartCombinedService,
    private readonly orderItemService: OrderItemService,
    private readonly orderLensDetailService: OrderLensDetailService,
    private readonly stockService: StockService,
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

            // Validate that we have a valid lens variant ID
            if (!cartItem.lensDetail.lensVariantId) {
              console.warn(
                `[OrderService] No lens variant ID found for cart item lens detail. Skipping lens detail creation.`,
              );
              continue;
            }

            const lensDetailDto = {
              orderItemId: orderItem.id,
              lensVariantId: cartItem.lensDetail.lensVariantId, // Use correct field name
              rightEyeSphere: cartItem.lensDetail.rightEyeSphere || 0,
              rightEyeCylinder: cartItem.lensDetail.rightEyeCylinder || 0,
              rightEyeAxis: cartItem.lensDetail.rightEyeAxis || 0,
              leftEyeSphere: cartItem.lensDetail.leftEyeSphere || 0,
              leftEyeCylinder: cartItem.lensDetail.leftEyeCylinder || 0,
              leftEyeAxis: cartItem.lensDetail.leftEyeAxis || 0,
              pdLeft: cartItem.lensDetail.pdLeft || 31.5,
              pdRight: cartItem.lensDetail.pdRight || 31.5,
              lensPrice: cartItem.lensDetail.lensPrice || 0,
              selectedCoatingIds:
                cartItem.lensDetail.selectedCoatingIds || undefined,
              selectedTintColorId:
                cartItem.lensDetail.selectedTintColorId || undefined,
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

      // Check stock availability before reducing
      try {
        this.logger.log(
          `Checking stock availability for order ${savedOrder.id}`,
        );
        const stockCheck = await this.stockService.checkOrderStockAvailability(
          savedOrder.id,
        );

        if (!stockCheck.available) {
          this.logger.error(
            `Insufficient stock for order ${savedOrder.id}:`,
            stockCheck.issues,
          );
          throw new HttpException(
            `Insufficient stock: ${stockCheck.issues.join(', ')}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        this.logger.log(`Stock check passed for order ${savedOrder.id}`);
      } catch (stockCheckError) {
        this.logger.error(
          `Stock check failed for order ${savedOrder.id}:`,
          stockCheckError,
        );

        if (stockCheckError instanceof HttpException) {
          throw stockCheckError;
        }

        throw new HttpException(
          'Could not verify stock availability',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Reduce stock for the order
      try {
        this.logger.log(`Reducing stock for order ${savedOrder.id}`);
        const stockResult = await this.stockService.reduceStockForOrder(
          savedOrder.id,
          userId,
        );

        if (stockResult.success) {
          this.logger.log(
            `Stock reduced successfully for order ${savedOrder.id}`,
            stockResult.details,
          );
        } else {
          this.logger.error(
            `Failed to reduce stock for order ${savedOrder.id}: ${stockResult.message}`,
          );
          throw new HttpException(
            `Order created but stock reduction failed: ${stockResult.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } catch (stockError) {
        this.logger.error(
          `Stock reduction error for order ${savedOrder.id}:`,
          stockError,
        );

        // Note: Order has been created but stock reduction failed
        // In a production system, you might want to:
        // 1. Mark the order as having stock issues
        // 2. Send alert to admin
        // 3. Or rollback the entire order creation

        if (stockError instanceof HttpException) {
          throw stockError;
        }

        throw new HttpException(
          'Order created but stock could not be updated. Please contact support.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

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

  async getOrdersWithFullDetails(
    params: GetOrdersQueryDto,
  ): Promise<PageList<any>> {
    try {
      const pagination = new PaginationParamsModel(params.page, params.limit);
      const queryBuilder = this.orderRepository
        .createQueryBuilder('order')
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

      // Enrich each order with detailed item and lens information
      const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
          const orderModel = order.toModel();
          const orderItemsWithDetails =
            await this.orderItemService.getOrderItemsWithFullDetails(order.id);

          return {
            ...orderModel,
            orderItems: orderItemsWithDetails,
          };
        }),
      );

      return new PageList<any>(total, enrichedOrders);
    } catch (error) {
      console.error('Error getting orders with full details:', error);
      throw new HttpException(
        'Failed to get orders with full details',
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
      // Get current order to check previous status
      const currentOrder = await this.getOrderById(id);
      const previousStatus = currentOrder.status;

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

      // Handle stock restoration when order is cancelled
      if (
        status === OrderStatus.CANCELLED &&
        previousStatus !== OrderStatus.CANCELLED
      ) {
        try {
          this.logger.log(`Restoring stock for cancelled order ${id}`);
          const stockResult = await this.stockService.restoreStockForOrder(
            id,
            userId,
          );

          if (stockResult.success) {
            this.logger.log(
              `Stock restored successfully for cancelled order ${id}`,
              stockResult.details,
            );
          } else {
            this.logger.error(
              `Failed to restore stock for cancelled order ${id}: ${stockResult.message}`,
            );
            // Note: We don't throw here as the order cancellation should still proceed
            // Admin should be notified to manually check stock
          }
        } catch (stockError) {
          this.logger.error(
            `Stock restoration error for cancelled order ${id}:`,
            stockError,
          );
          // Log but don't throw - order cancellation should proceed
        }
      }

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

  async getOrderWithDetails(id: number): Promise<OrderModel> {
    try {
      const order = await this.getOrderById(id);

      // Get order items with full details including product and lens information
      const orderItemsWithDetails =
        await this.orderItemService.getOrderItemsWithFullDetails(id);

      // Create new OrderModel with enriched orderItems
      return new OrderModel(
        order.id,
        order.userId,
        order.cartId,
        order.orderDate,
        order.subtotal,
        order.shippingCost,
        order.totalPrice,
        order.paymentMethod,
        order.paymentStatus,
        order.trackingNumber,
        order.deliveryDate,
        order.fullName,
        order.phone,
        order.email,
        order.province,
        order.district,
        order.ward,
        order.addressDetail,
        order.notes,
        order.status,
        order.createdAt,
        order.createdBy,
        order.updatedAt,
        order.updatedBy,
        order.deletedAt,
        order.deletedBy,
        orderItemsWithDetails,
      );
    } catch (error) {
      console.error('Error getting order with details:', error);
      throw new HttpException(
        'Failed to get order details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTrackingInfo(
    id: number,
    trackingInfo: { trackingNumber?: string; deliveryDate?: string },
    userId: number,
  ): Promise<OrderModel> {
    try {
      const updateData: any = {
        updatedBy: userId,
      };

      if (trackingInfo.trackingNumber !== undefined) {
        updateData.trackingNumber = trackingInfo.trackingNumber;
      }

      if (trackingInfo.deliveryDate !== undefined) {
        updateData.deliveryDate = trackingInfo.deliveryDate;
      }

      await this.orderRepository.update(
        { id, deletedAt: IsNull() },
        updateData,
      );

      return await this.getOrderById(id);
    } catch (error) {
      throw new HttpException(
        'Failed to update tracking information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async exportOrdersToPDF(params: GetOrdersQueryDto): Promise<Buffer> {
    try {
      // For now, return a placeholder. You'll need to implement PDF generation
      // using libraries like puppeteer, jsPDF, or similar
      throw new HttpException(
        'PDF export not implemented yet',
        HttpStatus.NOT_IMPLEMENTED,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to export orders to PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async exportOrdersToExcel(params: GetOrdersQueryDto): Promise<Buffer> {
    try {
      // For now, return a placeholder. You'll need to implement Excel generation
      // using libraries like exceljs, xlsx, or similar
      throw new HttpException(
        'Excel export not implemented yet',
        HttpStatus.NOT_IMPLEMENTED,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to export orders to Excel',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderReports(startDate: string, endDate: string): Promise<any> {
    try {
      // Basic reports implementation
      const orders = await this.orderRepository.find({
        where: {
          deletedAt: IsNull(),
          orderDate: {
            // You may need to adjust this based on your TypeORM version
            // This is a simplified implementation
          } as any,
        },
      });

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0,
      );

      const ordersByStatus = orders.reduce(
        (acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        totalOrders,
        totalRevenue,
        ordersByStatus,
        ordersByDate: [], // Implement date grouping as needed
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get order reports',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendOrderNotification(
    orderId: number,
    type: 'status_update' | 'tracking_update',
    userId: number,
  ): Promise<void> {
    try {
      // For now, just log the notification. You'll need to implement
      // email service integration here
      console.log(
        `Sending ${type} notification for order ${orderId} by user ${userId}`,
      );

      // TODO: Implement email notification service
      // - Get order details
      // - Get customer email
      // - Send appropriate email template

      throw new HttpException(
        'Email notification service not implemented yet',
        HttpStatus.NOT_IMPLEMENTED,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to send notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
