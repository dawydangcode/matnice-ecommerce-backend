import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../middlewares/guards/jwt-auth.guard';
import { Roles } from '../role/decorators/roles.decorator';
import { RoleType } from '../role/enum/role.enum';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@Roles(RoleType.Admin)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Get dashboard statistics
   */
  @Get('stats')
  async getStats(@Query('timeRange') timeRange?: string) {
    return await this.dashboardService.getStats(timeRange as any);
  }

  /**
   * Get recent orders
   */
  @Get('recent-orders')
  async getRecentOrders(@Query('limit') limit?: string) {
    const orderLimit = limit ? parseInt(limit, 10) : 5;
    return await this.dashboardService.getRecentOrders(orderLimit);
  }

  /**
   * Get revenue data based on time range
   */
  @Get('revenue-data')
  async getRevenueData(@Query('timeRange') timeRange?: string) {
    return await this.dashboardService.getRevenueData(timeRange as any);
  }

  /**
   * Get monthly revenue data
   */
  @Get('monthly-revenue')
  async getMonthlyRevenue(@Query('months') months?: string) {
    const monthsCount = months ? parseInt(months, 10) : 12;
    return await this.dashboardService.getMonthlyRevenue(monthsCount);
  }

  /**
   * Get top selling products
   */
  @Get('top-products')
  async getTopProducts(@Query('limit') limit?: string) {
    const limitCount = limit ? parseInt(limit, 10) : 5;
    return await this.dashboardService.getTopProducts(limitCount);
  }
}
