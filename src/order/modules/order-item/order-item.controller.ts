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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { JwtAuthGuard } from 'src/middlewares/guards/jwt-auth.guard';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';
import { OrderItemService } from './order-item.service';
import {
  CreateOrderItemDto,
  UpdateOrderItemDto,
  GetOrderItemsQueryDto,
  GetOrderItemByIdParamsDto,
  UpdateOrderItemParamsDto,
  DeleteOrderItemParamsDto,
  OrderItemResponseDto,
} from './dtos/order-item.dto';

@ApiTags('Order Items')
@Controller('api/v1/order-items')
@UseGuards(JwtAuthGuard)
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Create a new order item' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Order item created successfully',
    type: OrderItemResponseDto,
  })
  async createOrderItem(
    @Body() createOrderItemDto: CreateOrderItemDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.orderItemService.createOrderItem(
        createOrderItemDto,
        userId,
      );

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Order item created successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Get list of order items' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order items retrieved successfully',
    type: [OrderItemResponseDto],
  })
  async getOrderItems(
    @Query() params: GetOrderItemsQueryDto,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.orderItemService.getOrderItems(params);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order items retrieved successfully',
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

  @Get('order/:orderId')
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Get order items for a specific order' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order items retrieved successfully',
    type: [OrderItemResponseDto],
  })
  async getOrderItemsByOrderId(
    @Param('orderId') orderId: number,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result =
        await this.orderItemService.getOrderItemsByOrderId(orderId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order items retrieved successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Get an order item by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order item retrieved successfully',
    type: OrderItemResponseDto,
  })
  async getOrderItemById(
    @Param() params: GetOrderItemByIdParamsDto,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.orderItemService.getOrderItemById(params.id);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order item retrieved successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Update an order item' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order item updated successfully',
    type: OrderItemResponseDto,
  })
  async updateOrderItem(
    @Param() params: UpdateOrderItemParamsDto,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.orderItemService.updateOrderItem(
        params.id,
        updateOrderItemDto,
        userId,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order item updated successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Delete an order item' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order item deleted successfully',
  })
  async deleteOrderItem(
    @Param() params: DeleteOrderItemParamsDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      await this.orderItemService.deleteOrderItem(params.id, userId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order item deleted successfully',
      });
    } catch (error) {
      throw error;
    }
  }
}
