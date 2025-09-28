import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/middlewares/guards/jwt-auth.guard';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';
import { PayOSService } from '../services/payos.service';
import { PaymentService } from '../payment.service';
import { CartCombinedService } from 'src/cart/modules/cart-combined.service';
import { CartService } from 'src/cart/cart.service';
import {
  CreatePaymentLinkDto,
  PaymentLinkResponseDto,
  PaymentWebhookDto,
  CreateEmbeddedPaymentDto,
} from '../dtos/payos.dto';
import { PaymentMethod, PaymentStatus } from '../enums/payment.enum';
import { RequestModel } from 'src/common/models/request.model';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';
import { type Webhook } from '@payos/node';

@ApiTags('PayOS Payment')
@Controller('api/payment/payos')
export class PayOSController {
  constructor(
    private readonly payosService: PayOSService,
    private readonly paymentService: PaymentService,
    private readonly cartCombinedService: CartCombinedService,
    private readonly cartService: CartService,
  ) {}

  @Post('create-payment-link')
  @UseGuards(JwtAuthGuard)
  @Roles(RoleType.Admin, RoleType.User, RoleType.Employee)
  @ApiOperation({ summary: 'Create PayOS payment link' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment link created successfully',
    type: PaymentLinkResponseDto,
  })
  async createPaymentLink(
    @Body() createPaymentLinkDto: CreatePaymentLinkDto,
    @Req() req: RequestModel,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;

      // Generate unique order code
      const orderCode = this.payosService.generateOrderCode();

      // Create payment record in database
      const payment = await this.paymentService.createPayment(
        {
          orderId: createPaymentLinkDto.orderId,
          paymentMethod: PaymentMethod.VNPAY, // PayOS uses VNPay gateway
          amount: createPaymentLinkDto.amount,
          transactionId: orderCode.toString(),
        },
        userId,
      );

      // Create PayOS payment link
      const paymentLink = await this.payosService.createPaymentLink({
        orderCode,
        amount: createPaymentLinkDto.amount,
        description: createPaymentLinkDto.description,
        items: createPaymentLinkDto.items,
        returnUrl: createPaymentLinkDto.returnUrl,
        cancelUrl: createPaymentLinkDto.cancelUrl,
        buyerName: createPaymentLinkDto.buyerName,
        buyerEmail: createPaymentLinkDto.buyerEmail,
        buyerPhone: createPaymentLinkDto.buyerPhone,
        buyerAddress: createPaymentLinkDto.buyerAddress,
      });

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Payment link created successfully',
        data: {
          ...paymentLink,
          paymentId: payment.id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('create-embedded-payment-link')
  @UseGuards(JwtAuthGuard)
  @Roles(RoleType.Admin, RoleType.User, RoleType.Employee)
  @ApiOperation({ summary: 'Create embedded PayOS payment link for cart' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Embedded payment link created successfully',
    type: PaymentLinkResponseDto,
  })
  async createEmbeddedPaymentLink(
    @Body() createEmbeddedPaymentDto: CreateEmbeddedPaymentDto,
    @Req() req: RequestModel,
    @Res() res: Response,
  ) {
    try {
      console.log('---[PayOS] Embedded Payment Request---');
      console.log('User:', req.user?.userId);
      console.log(
        'Payload:',
        JSON.stringify(createEmbeddedPaymentDto, null, 2),
      );

      const userId = req.user.userId;

      // Get cart items and summary
      const [cartItems, cartSummary] = await Promise.all([
        this.cartCombinedService.getCartItemsWithFullDetails(
          createEmbeddedPaymentDto.cartId,
        ),
        this.cartCombinedService.getCartSummary(
          createEmbeddedPaymentDto.cartId,
        ),
      ]);

      if (!cartItems || cartItems.length === 0) {
        console.error('---[PayOS] Cart is empty---');
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Cart is empty',
        });
      }

      // Generate unique order code
      const orderCode = this.payosService.generateOrderCode();

      // Prepare items for PayOS
      const payosItems = cartItems.map((item) => ({
        name: `${item.frame.productName || 'Product'} ${item.lensDetail ? '+ Lens' : ''}`,
        quantity: item.frame.quantity,
        price: Math.round(
          parseFloat(item.frame.totalPrice.toString()) +
            (item.lensDetail
              ? parseFloat(item.lensDetail.lensPrice.toString())
              : 0),
        ),
      }));

      const totalAmount = Math.round(
        parseFloat(cartSummary.grandTotal.toString()),
      );

      // Create payment record in database (will be linked to order later)
      const payment = await this.paymentService.createPayment(
        {
          orderId: undefined, // Will be updated when order is created after successful payment
          paymentMethod: PaymentMethod.VNPAY,
          amount: totalAmount,
          transactionId: orderCode.toString(),
        },
        userId,
      );

      // Create PayOS payment link
      const paymentLink = await this.payosService.createPaymentLink({
        orderCode,
        amount: totalAmount,
        description: `Payment for Cart #${createEmbeddedPaymentDto.cartId}`,
        items: payosItems,
        returnUrl: createEmbeddedPaymentDto.returnUrl,
        cancelUrl: createEmbeddedPaymentDto.cancelUrl,
        buyerName: createEmbeddedPaymentDto.buyerName,
        buyerEmail: createEmbeddedPaymentDto.buyerEmail,
        buyerPhone: createEmbeddedPaymentDto.buyerPhone,
        buyerAddress: createEmbeddedPaymentDto.buyerAddress,
      });

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Embedded payment link created successfully',
        data: {
          checkoutUrl: paymentLink.checkoutUrl,
          paymentLinkId: paymentLink.paymentLinkId,
          orderCode: orderCode,
          amount: totalAmount,
          paymentId: payment.id,
        },
      });
    } catch (error) {
      console.error('---[PayOS] Embedded Payment Error---');
      console.error(error);
      throw error;
    }
  }

  @Get('payment-info/:paymentLinkId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get PayOS payment information' })
  async getPaymentInfo(
    @Param('paymentLinkId') paymentLinkId: string,
    @Res() res: Response,
  ) {
    try {
      const paymentInfo =
        await this.payosService.getPaymentLinkInfo(paymentLinkId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Payment information retrieved successfully',
        data: paymentInfo,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('cancel-payment/:paymentLinkId')
  @UseGuards(JwtAuthGuard)
  @Roles(RoleType.Admin, RoleType.User, RoleType.Employee)
  @ApiOperation({ summary: 'Cancel PayOS payment' })
  async cancelPayment(
    @Param('paymentLinkId') paymentLinkId: string,
    @Body('reason') reason: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.payosService.cancelPaymentLink(
        paymentLinkId,
        reason,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Payment cancelled successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'PayOS webhook endpoint' })
  @ApiBody({
    description: 'PayOS webhook payload',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        desc: { type: 'string' },
        success: { type: 'boolean' },
        data: { type: 'object' },
        signature: { type: 'string' },
      },
    },
  })
  async paymentWebhook(@Body() webhookData: Webhook, @Res() res: Response) {
    try {
      console.log(
        'PayOS Webhook received:',
        JSON.stringify(webhookData, null, 2),
      );

      // Verify webhook data signature
      const isValid = this.payosService.verifyPaymentWebhookData(webhookData);

      if (!isValid) {
        console.error(
          '❌ Invalid webhook signature for orderCode:',
          webhookData.data?.orderCode,
        );
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid webhook signature',
          orderCode: webhookData.data?.orderCode,
        });
      }

      console.log(
        '✅ Webhook signature verified successfully for orderCode:',
        webhookData.data?.orderCode,
      );

      // Process webhook based on payment status
      if (webhookData.success && webhookData.data.code === '00') {
        // Payment successful
        const orderCode = webhookData.data.orderCode.toString();

        try {
          // Find payment by transaction ID (order code)
          // Note: You might need to add a method to find payment by transaction ID
          // For now, we'll update payment status

          // Update payment status to completed
          // This is a simplified implementation - you should find the payment by orderCode
          console.log(`Payment successful for order code: ${orderCode}`);

          // TODO:
          // 1. Find payment by orderCode
          // 2. Update payment status to COMPLETED
          // 3. Create order from cart
          // 4. Clear cart
          // 5. Send confirmation email
        } catch (error) {
          console.error('Error processing successful payment:', error);
        }
      } else {
        // Payment failed or cancelled
        console.log(
          `Payment failed/cancelled for order code: ${webhookData.data.orderCode}`,
        );
      }

      // Return 200 status to confirm webhook received
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Webhook processed successfully',
      });
    } catch (error) {
      console.error('Webhook processing error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Webhook processing failed',
      });
    }
  }
}
