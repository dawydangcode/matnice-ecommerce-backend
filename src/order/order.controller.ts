import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { JwtAuthGuard } from 'src/middlewares/guards/jwt-auth.guard';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  GetOrdersQueryDto,
  GetOrderByIdParamsDto,
  UpdateOrderParamsDto,
  DeleteOrderParamsDto,
  OrderResponseDto,
} from './dtos/order.dto';
import { OrderStatus, PaymentStatus } from './enums/order.enum';

@ApiTags('Orders')
@Controller('api/v1/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.orderService.createOrder(
        createOrderDto,
        userId,
      );

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Order created successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Get list of orders' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders retrieved successfully',
    type: [OrderResponseDto],
  })
  async getOrders(
    @Query() params: GetOrdersQueryDto,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.orderService.getOrders(params);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Orders retrieved successfully',
        data: result.data,
        total: result.total,
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: result.total,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('detailed')
  @Roles(RoleType.Admin)
  @ApiOperation({
    summary: 'Get list of orders with detailed product and lens information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders with detailed information retrieved successfully',
  })
  async getOrdersWithFullDetails(
    @Query() params: GetOrdersQueryDto,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.orderService.getOrdersWithFullDetails(params);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Orders with detailed information retrieved successfully',
        data: result.data,
        total: result.total,
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: result.total,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('my-orders')
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User orders retrieved successfully',
    type: [OrderResponseDto],
  })
  async getMyOrders(@Request() req: any, @Response() res: ExpressResponse) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.orderService.getOrdersByUserId(userId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User orders retrieved successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order retrieved successfully',
    type: OrderResponseDto,
  })
  async getOrderById(
    @Param() params: GetOrderByIdParamsDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.orderService.getOrderById(params.id);

      // Check if user can access this order (admin or order owner)
      const userId = req.user?.id || req.user?.userId;
      const userRole = req.user?.role;

      if (userRole !== RoleType.Admin && result.userId !== userId) {
        return res.status(HttpStatus.FORBIDDEN).json({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Access denied',
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order retrieved successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get(':id/details')
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  @ApiOperation({
    summary: 'Get detailed order information including items and lens details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order details retrieved successfully',
    type: OrderResponseDto,
  })
  async getOrderDetails(
    @Param() params: GetOrderByIdParamsDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.orderService.getOrderWithDetails(params.id);

      // Check if user can access this order (admin or order owner)
      const userId = req.user?.id || req.user?.userId;
      const userRole = req.user?.role;

      if (userRole !== RoleType.Admin && result.userId !== userId) {
        return res.status(HttpStatus.FORBIDDEN).json({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Access denied',
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order details retrieved successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order updated successfully',
    type: OrderResponseDto,
  })
  async updateOrder(
    @Param() params: UpdateOrderParamsDto,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.orderService.updateOrder(
        params.id,
        updateOrderDto,
        userId,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order updated successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':id/status')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Update order status' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(OrderStatus),
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order status updated successfully',
    type: OrderResponseDto,
  })
  async updateOrderStatus(
    @Param() params: UpdateOrderParamsDto,
    @Body('status') status: OrderStatus,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.orderService.updateOrderStatus(
        params.id,
        status,
        userId,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order status updated successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':id/payment-status')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Update payment status' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paymentStatus: {
          type: 'string',
          enum: Object.values(PaymentStatus),
        },
      },
      required: ['paymentStatus'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment status updated successfully',
    type: OrderResponseDto,
  })
  async updatePaymentStatus(
    @Param() params: UpdateOrderParamsDto,
    @Body('paymentStatus') paymentStatus: PaymentStatus,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.orderService.updatePaymentStatus(
        params.id,
        paymentStatus,
        userId,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Payment status updated successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':id/tracking')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Update tracking information' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        trackingNumber: {
          type: 'string',
          nullable: true,
        },
        deliveryDate: {
          type: 'string',
          format: 'date',
          nullable: true,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tracking information updated successfully',
    type: OrderResponseDto,
  })
  async updateTrackingInfo(
    @Param() params: UpdateOrderParamsDto,
    @Body() trackingInfo: { trackingNumber?: string; deliveryDate?: string },
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.orderService.updateTrackingInfo(
        params.id,
        trackingInfo,
        userId,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Tracking information updated successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('export/pdf')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Export orders to PDF' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders exported to PDF successfully',
  })
  async exportOrdersPDF(
    @Query() params: GetOrdersQueryDto,
    @Response() res: ExpressResponse,
  ) {
    try {
      const buffer = await this.orderService.exportOrdersToPDF(params);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=orders_${new Date().toISOString().split('T')[0]}.pdf`,
        'Content-Length': buffer.length,
      });

      return res.send(buffer);
    } catch (error) {
      throw error;
    }
  }

  @Get('export/excel')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Export orders to Excel' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders exported to Excel successfully',
  })
  async exportOrdersExcel(
    @Query() params: GetOrdersQueryDto,
    @Response() res: ExpressResponse,
  ) {
    try {
      const buffer = await this.orderService.exportOrdersToExcel(params);

      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=orders_${new Date().toISOString().split('T')[0]}.xlsx`,
        'Content-Length': buffer.length,
      });

      return res.send(buffer);
    } catch (error) {
      throw error;
    }
  }

  @Get('reports')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Get order reports and statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order reports retrieved successfully',
  })
  async getOrderReports(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.orderService.getOrderReports(
        startDate,
        endDate,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order reports retrieved successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/notifications')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Send order notification to customer' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['status_update', 'tracking_update'],
        },
      },
      required: ['type'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification sent successfully',
  })
  async sendOrderNotification(
    @Param() params: UpdateOrderParamsDto,
    @Body('type') type: 'status_update' | 'tracking_update',
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      await this.orderService.sendOrderNotification(params.id, type, userId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Notification sent successfully',
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order deleted successfully',
  })
  async deleteOrder(
    @Param() params: DeleteOrderParamsDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      await this.orderService.deleteOrder(params.id, userId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order deleted successfully',
      });
    } catch (error) {
      throw error;
    }
  }
}
