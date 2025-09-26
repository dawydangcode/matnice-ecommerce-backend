import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/middlewares/guards/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/guards/role.guard';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { OrderLensDetailService } from './order-lens-detail.service';
import {
  CreateOrderLensDetailDto,
  UpdateOrderLensDetailDto,
  OrderLensDetailResponseDto,
} from './dtos/order-lens-detail.dto';

@ApiTags('Order Lens Details')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order-lens-details')
export class OrderLensDetailController {
  constructor(
    private readonly orderLensDetailService: OrderLensDetailService,
  ) {}

  @Post()
  @Roles(RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Create a new order lens detail' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Order lens detail created successfully',
    type: OrderLensDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async create(
    @Body() createOrderLensDetailDto: CreateOrderLensDetailDto,
  ): Promise<OrderLensDetailResponseDto> {
    return this.orderLensDetailService.create(createOrderLensDetailDto);
  }

  @Get()
  @Roles(RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Get all order lens details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order lens details retrieved successfully',
    type: [OrderLensDetailResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async findAll(): Promise<OrderLensDetailResponseDto[]> {
    return this.orderLensDetailService.findAll();
  }

  @Get('by-order-item/:orderItemId')
  @Roles(RoleType.Admin, RoleType.Employee, RoleType.User)
  @ApiOperation({ summary: 'Get order lens details by order item ID' })
  @ApiParam({
    name: 'orderItemId',
    description: 'Order item ID',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order lens details retrieved successfully',
    type: [OrderLensDetailResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async findByOrderItemId(
    @Param('orderItemId', ParseIntPipe) orderItemId: number,
  ): Promise<OrderLensDetailResponseDto[]> {
    return this.orderLensDetailService.findByOrderItemId(orderItemId);
  }

  @Get(':id')
  @Roles(RoleType.Admin, RoleType.Employee, RoleType.User)
  @ApiOperation({ summary: 'Get order lens detail by ID' })
  @ApiParam({
    name: 'id',
    description: 'Order lens detail ID',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order lens detail retrieved successfully',
    type: OrderLensDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order lens detail not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderLensDetailResponseDto> {
    return this.orderLensDetailService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Update order lens detail' })
  @ApiParam({
    name: 'id',
    description: 'Order lens detail ID',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order lens detail updated successfully',
    type: OrderLensDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order lens detail not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderLensDetailDto: UpdateOrderLensDetailDto,
  ): Promise<OrderLensDetailResponseDto> {
    return this.orderLensDetailService.update(id, updateOrderLensDetailDto);
  }

  @Delete(':id')
  @Roles(RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Soft delete order lens detail' })
  @ApiParam({
    name: 'id',
    description: 'Order lens detail ID',
    type: 'number',
  })
  @ApiQuery({
    name: 'deletedBy',
    description: 'User ID who deletes the record',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Order lens detail deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order lens detail not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to delete order lens detail',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('deletedBy', ParseIntPipe) deletedBy: number,
  ): Promise<void> {
    return this.orderLensDetailService.remove(id, deletedBy);
  }

  @Patch(':id/restore')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Restore soft deleted order lens detail' })
  @ApiParam({
    name: 'id',
    description: 'Order lens detail ID',
    type: 'number',
  })
  @ApiQuery({
    name: 'restoredBy',
    description: 'User ID who restores the record',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order lens detail restored successfully',
    type: OrderLensDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order lens detail not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Order lens detail is not deleted or failed to restore',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Query('restoredBy', ParseIntPipe) restoredBy: number,
  ): Promise<OrderLensDetailResponseDto> {
    return this.orderLensDetailService.restore(id, restoredBy);
  }
}
