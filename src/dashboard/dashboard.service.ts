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
  paymentStatus?: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: number;
  name: string;
  brand: string;
  soldQuantity: number;
  revenue: number;
}

export type TimeRange = 'week' | 'month' | 'year';

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
  async getStats(timeRange: TimeRange = 'month'): Promise<DashboardStats> {
    try {
      const now = new Date();
      const { current, previous } = this.getTimePeriods(timeRange, now);

      // Revenue calculations
      const currentPeriodRevenue = await this.calculateRevenue(
        current.start,
        current.end,
      );
      const previousPeriodRevenue = await this.calculateRevenue(
        previous.start,
        previous.end,
      );
      const revenueGrowth = this.calculateGrowth(
        currentPeriodRevenue,
        previousPeriodRevenue,
      );

      // Orders calculations
      const currentPeriodOrders = await this.countOrders(
        current.start,
        current.end,
      );
      const previousPeriodOrders = await this.countOrders(
        previous.start,
        previous.end,
      );
      const ordersGrowth = this.calculateGrowth(
        currentPeriodOrders,
        previousPeriodOrders,
      );

      // Products calculations
      const totalProducts = await this.productRepository.count({
        where: { deletedAt: IsNull() },
      });
      const newProducts = await this.productRepository.count({
        where: {
          deletedAt: IsNull(),
          createdAt: Between(current.start, current.end),
        },
      });

      // Customers calculations
      const currentPeriodCustomers = await this.countNewCustomers(
        current.start,
        current.end,
      );
      const previousPeriodCustomers = await this.countNewCustomers(
        previous.start,
        previous.end,
      );
      const customersGrowth = this.calculateGrowth(
        currentPeriodCustomers,
        previousPeriodCustomers,
      );

      // Get period label
      const periodLabel = this.getPeriodLabel(timeRange);

      return {
        revenue: {
          total: currentPeriodRevenue,
          growth: revenueGrowth,
          period: periodLabel,
        },
        orders: {
          total: currentPeriodOrders,
          growth: ordersGrowth,
          period: periodLabel,
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
        paymentStatus: this.getPaymentStatusInVietnamese(order.paymentStatus),
      }));
    } catch (error) {
      this.logger.error('Failed to get recent orders:', error);
      throw new Error('Failed to retrieve recent orders');
    }
  }

  /**
   * Get revenue data based on time range
   */
  async getRevenueData(
    timeRange: TimeRange = 'month',
  ): Promise<MonthlyRevenue[]> {
    try {
      const result: MonthlyRevenue[] = [];
      const now = new Date();

      let periods: { start: Date; end: Date; label: string }[] = [];

      switch (timeRange) {
        case 'week':
          // Last 7 weeks
          for (let i = 6; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - i * 7 - now.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            periods.push({
              start: weekStart,
              end: weekEnd,
              label: `Tuần ${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
            });
          }
          break;

        case 'year':
          // 12 months of current year
          for (let i = 0; i < 12; i++) {
            const monthStart = new Date(now.getFullYear(), i, 1);
            const monthEnd = new Date(now.getFullYear(), i + 1, 0);

            periods.push({
              start: monthStart,
              end: monthEnd,
              label: monthStart.toLocaleDateString('vi-VN', {
                month: 'short',
                year: 'numeric',
              }),
            });
          }
          break;

        default: // month
          // Last 12 months
          for (let i = 11; i >= 0; i--) {
            const monthStart = new Date(
              now.getFullYear(),
              now.getMonth() - i,
              1,
            );
            const monthEnd = new Date(
              now.getFullYear(),
              now.getMonth() - i + 1,
              0,
            );

            periods.push({
              start: monthStart,
              end: monthEnd,
              label: monthStart.toLocaleDateString('vi-VN', {
                month: 'short',
                year: 'numeric',
              }),
            });
          }
      }

      for (const period of periods) {
        const revenue = await this.calculateRevenue(period.start, period.end);
        const orders = await this.countOrders(period.start, period.end);

        result.push({
          month: period.label,
          revenue: revenue,
          orders: orders,
        });
      }

      return result;
    } catch (error) {
      this.logger.error('Failed to get revenue data:', error);
      throw new Error('Failed to retrieve revenue data');
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
   * Get time periods for current and previous comparison
   */
  private getTimePeriods(
    timeRange: TimeRange,
    now: Date,
  ): {
    current: { start: Date; end: Date };
    previous: { start: Date; end: Date };
  } {
    switch (timeRange) {
      case 'week':
        const currentWeekStart = new Date(now);
        currentWeekStart.setDate(now.getDate() - now.getDay());
        const currentWeekEnd = new Date(now);

        const previousWeekStart = new Date(currentWeekStart);
        previousWeekStart.setDate(currentWeekStart.getDate() - 7);
        const previousWeekEnd = new Date(currentWeekStart);
        previousWeekEnd.setDate(currentWeekStart.getDate() - 1);

        return {
          current: { start: currentWeekStart, end: currentWeekEnd },
          previous: { start: previousWeekStart, end: previousWeekEnd },
        };

      case 'year':
        const currentYearStart = new Date(now.getFullYear(), 0, 1);
        const currentYearEnd = new Date(now);

        const previousYearStart = new Date(now.getFullYear() - 1, 0, 1);
        const previousYearEnd = new Date(now.getFullYear() - 1, 11, 31);

        return {
          current: { start: currentYearStart, end: currentYearEnd },
          previous: { start: previousYearStart, end: previousYearEnd },
        };

      default: // month
        const currentMonthStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          1,
        );
        const currentMonthEnd = new Date(now);

        const previousMonthStart = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        );
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        return {
          current: { start: currentMonthStart, end: currentMonthEnd },
          previous: { start: previousMonthStart, end: previousMonthEnd },
        };
    }
  }

  /**
   * Get period label for comparison
   */
  private getPeriodLabel(timeRange: TimeRange): string {
    switch (timeRange) {
      case 'week':
        return 'so với tuần trước';
      case 'year':
        return 'so với năm trước';
      default:
        return 'so với tháng trước';
    }
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

  /**
   * Get payment status in Vietnamese
   */
  private getPaymentStatusInVietnamese(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thất bại',
      refunded: 'Đã hoàn tiền',
      cancelled: 'Đã hủy',
    };
    return statusMap[status] || status;
  }

  /**
   * Get top selling products
   */
  async getTopProducts(limit: number = 5): Promise<TopProduct[]> {
    try {
      const query = `
        SELECT 
          p.productId as id,
          p.productName as name,
          COALESCE(b.brandName, 'Unknown') as brand,
          COALESCE(SUM(oi.quantity), 0) as soldQuantity,
          COALESCE(SUM(oi.quantity * oi.unitPrice), 0) as revenue
        FROM products p
        LEFT JOIN brands b ON p.brandId = b.brandId
        LEFT JOIN order_items oi ON p.productId = oi.productId
        LEFT JOIN orders o ON oi.orderId = o.orderId
        WHERE o.status IN ('completed', 'delivered')
        GROUP BY p.productId, p.productName, b.brandName
        HAVING soldQuantity > 0
        ORDER BY soldQuantity DESC, revenue DESC
        LIMIT ?
      `;

      const result = await this.orderRepository.query(query, [limit]);

      return result.map((row: any) => ({
        id: row.id,
        name: row.name,
        brand: row.brand,
        soldQuantity: parseInt(row.soldQuantity) || 0,
        revenue: parseFloat(row.revenue) || 0,
      }));
    } catch (error) {
      this.logger.error('Error fetching top products:', error);
      return [];
    }
  }
}
