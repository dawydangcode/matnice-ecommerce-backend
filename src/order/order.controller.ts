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
  @UseGuards(JwtAuthGuard)
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

  @Get('my-orders')
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
