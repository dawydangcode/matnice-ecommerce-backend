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
import { PaymentService } from './payment.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  GetPaymentsQueryDto,
  GetPaymentByIdParamsDto,
  UpdatePaymentParamsDto,
  DeletePaymentParamsDto,
  PaymentResponseDto,
} from './dtos/payment.dto';
import { PaymentStatus } from './enums/payment.enum';

@ApiTags('Payments')
@Controller('api/v1/payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment created successfully',
    type: PaymentResponseDto,
  })
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.paymentService.createPayment(
        createPaymentDto,
        userId,
      );

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Payment created successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Get list of payments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payments retrieved successfully',
    type: [PaymentResponseDto],
  })
  async getPayments(
    @Query() params: GetPaymentsQueryDto,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.paymentService.getPayments(params);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Payments retrieved successfully',
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
  @ApiOperation({ summary: 'Get payments for a specific order' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order payments retrieved successfully',
    type: [PaymentResponseDto],
  })
  async getPaymentsByOrderId(
    @Param('orderId') orderId: number,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.paymentService.getPaymentsByOrderId(orderId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order payments retrieved successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Get a payment by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment retrieved successfully',
    type: PaymentResponseDto,
  })
  async getPaymentById(
    @Param() params: GetPaymentByIdParamsDto,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.paymentService.getPaymentById(params.id);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Payment retrieved successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Update a payment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment updated successfully',
    type: PaymentResponseDto,
  })
  async updatePayment(
    @Param() params: UpdatePaymentParamsDto,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.paymentService.updatePayment(
        params.id,
        updatePaymentDto,
        userId,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Payment updated successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':id/status')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Update payment status' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(PaymentStatus),
        },
        transactionId: {
          type: 'string',
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment status updated successfully',
    type: PaymentResponseDto,
  })
  async updatePaymentStatus(
    @Param() params: UpdatePaymentParamsDto,
    @Body('status') status: PaymentStatus,
    @Body('transactionId') transactionId: string | undefined,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.paymentService.updatePaymentStatus(
        params.id,
        status,
        userId,
        transactionId,
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

  @Post(':id/process')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Process payment' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        transactionId: {
          type: 'string',
        },
      },
      required: ['transactionId'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment processed successfully',
    type: PaymentResponseDto,
  })
  async processPayment(
    @Param() params: UpdatePaymentParamsDto,
    @Body('transactionId') transactionId: string,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.paymentService.processPayment(
        params.id,
        transactionId,
        userId,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Payment processed successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/complete')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Complete payment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment completed successfully',
    type: PaymentResponseDto,
  })
  async completePayment(
    @Param() params: UpdatePaymentParamsDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.paymentService.completePayment(
        params.id,
        userId,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Payment completed successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/fail')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Fail payment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment failed successfully',
    type: PaymentResponseDto,
  })
  async failPayment(
    @Param() params: UpdatePaymentParamsDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.paymentService.failPayment(params.id, userId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Payment failed successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/refund')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Refund payment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment refunded successfully',
    type: PaymentResponseDto,
  })
  async refundPayment(
    @Param() params: UpdatePaymentParamsDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.paymentService.refundPayment(params.id, userId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Payment refunded successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Delete a payment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment deleted successfully',
  })
  async deletePayment(
    @Param() params: DeletePaymentParamsDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id || req.user?.userId;
      await this.paymentService.deletePayment(params.id, userId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Payment deleted successfully',
      });
    } catch (error) {
      throw error;
    }
  }
}
