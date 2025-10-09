import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull } from 'typeorm';
import { OrderEntity } from '../order/entities/order.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { UserEntity } from '../user/entities/user.entity';

export interface DashboardStats {
  revenue: {
    total: number;
    growth: number;
    period: string;
  };
  orders: {
    total: number;
    growth: number;
    period: string;
  };
  products: {
    total: number;
    newProducts: number;
    period: string;
  };
  customers: {
    total: number;
    growth: number;
    period: string;
  };
}

export interface RecentOrder {
  id: number;
  orderNumber: string;
  itemCount: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  customerName?: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    try {
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Revenue calculations
      const currentMonthRevenue = await this.calculateRevenue(
        currentMonth,
        now,
      );
      const lastMonthRevenue = await this.calculateRevenue(
        lastMonth,
        lastMonthEnd,
      );
      const revenueGrowth = this.calculateGrowth(
        currentMonthRevenue,
        lastMonthRevenue,
      );

      // Orders calculations
      const currentMonthOrders = await this.countOrders(currentMonth, now);
      const lastMonthOrders = await this.countOrders(lastMonth, lastMonthEnd);
      const ordersGrowth = this.calculateGrowth(
        currentMonthOrders,
        lastMonthOrders,
      );

      // Products calculations
      const totalProducts = await this.productRepository.count({
        where: { deletedAt: IsNull() },
      });
      const newProducts = await this.productRepository.count({
        where: {
          deletedAt: IsNull(),
          createdAt: Between(currentMonth, now),
        },
      });

      // Customers calculations
      const currentMonthCustomers = await this.countNewCustomers(
        currentMonth,
        now,
      );
      const lastMonthCustomers = await this.countNewCustomers(
        lastMonth,
        lastMonthEnd,
      );
      const customersGrowth = this.calculateGrowth(
        currentMonthCustomers,
        lastMonthCustomers,
      );

      return {
        revenue: {
          total: currentMonthRevenue,
          growth: revenueGrowth,
          period: 'so với tháng trước',
        },
        orders: {
          total: currentMonthOrders,
          growth: ordersGrowth,
          period: 'so với tháng trước',
        },
        products: {
          total: totalProducts,
          newProducts: newProducts,
          period: 'sản phẩm mới',
        },
        customers: {
          total: await this.userRepository.count({
            where: { deletedAt: IsNull() },
          }),
          growth: customersGrowth,
          period: 'so với tháng trước',
        },
      };
    } catch (error) {
      this.logger.error('Failed to get dashboard stats:', error);
      throw new Error('Failed to retrieve dashboard statistics');
    }
  }

  /**
   * Get recent orders
   */
  async getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
    try {
      const orders = await this.orderRepository.find({
        relations: ['orderItems'],
        where: { deletedAt: IsNull() },
        order: { createdAt: 'DESC' },
        take: limit,
      });

      return orders.map((order) => ({
        id: order.id,
        orderNumber: `#${order.id.toString().padStart(6, '0')}`,
        itemCount: order.orderItems?.length || 0,
        totalAmount: order.totalPrice,
        status: this.getOrderStatusInVietnamese(order.status),
        createdAt: order.createdAt
          ? order.createdAt.toISOString()
          : new Date().toISOString(),
        customerName: order.fullName || order.email || 'Khách hàng',
      }));
    } catch (error) {
      this.logger.error('Failed to get recent orders:', error);
      throw new Error('Failed to retrieve recent orders');
    }
  }

  /**
   * Get monthly revenue data
   */
  async getMonthlyRevenue(months: number = 12): Promise<MonthlyRevenue[]> {
    try {
      const result: MonthlyRevenue[] = [];
      const now = new Date();

      for (let i = months - 1; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const revenue = await this.calculateRevenue(monthStart, monthEnd);
        const orders = await this.countOrders(monthStart, monthEnd);

        result.push({
          month: monthStart.toLocaleDateString('vi-VN', {
            month: 'short',
            year: 'numeric',
          }),
          revenue: revenue,
          orders: orders,
        });
      }

      return result;
    } catch (error) {
      this.logger.error('Failed to get monthly revenue:', error);
      throw new Error('Failed to retrieve monthly revenue data');
    }
  }

  /**
   * Calculate revenue for a period
   */
  private async calculateRevenue(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    // Calculate total revenue (all orders except cancelled)
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'total')
      .where('order.orderDate >= :startDate', { startDate })
      .andWhere('order.orderDate <= :endDate', { endDate })
      .andWhere('order.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: ['cancelled', 'refunded'],
      })
      .andWhere('order.deletedAt IS NULL')
      .getRawOne();

    return parseFloat(result?.total || '0');
  }

  /**
   * Calculate completed revenue only (for comparison)
   */
  private async calculateCompletedRevenue(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'total')
      .where('order.orderDate >= :startDate', { startDate })
      .andWhere('order.orderDate <= :endDate', { endDate })
      .andWhere('order.status IN (:...statuses)', {
        statuses: ['completed', 'shipped', 'delivered'],
      })
      .andWhere('order.deletedAt IS NULL')
      .getRawOne();

    return parseFloat(result?.total || '0');
  }

  /**
   * Count orders for a period
   */
  private async countOrders(startDate: Date, endDate: Date): Promise<number> {
    return await this.orderRepository.count({
      where: {
        orderDate: Between(startDate, endDate),
        deletedAt: IsNull(),
      },
    });
  }

  /**
   * Count new customers for a period
   */
  private async countNewCustomers(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return await this.userRepository.count({
      where: {
        createdAt: Between(startDate, endDate),
        deletedAt: IsNull(),
      },
    });
  }

  /**
   * Calculate growth percentage
   */
  private calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  /**
   * Get order status in Vietnamese
   */
  private getOrderStatusInVietnamese(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      processing: 'Đang xử lý',
      shipped: 'Đã gửi hàng',
      delivered: 'Đã giao hàng',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
      refunded: 'Đã hoàn tiền',
    };
    return statusMap[status] || status;
  }
}
