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
import { OrderService } from 'src/order/order.service';
import {
  CreatePaymentLinkDto,
  PaymentLinkResponseDto,
  PaymentWebhookDto,
  CreateEmbeddedPaymentDto,
} from '../dtos/payos.dto';
import { PaymentMethod, PaymentStatus } from '../enums/payment.enum';
import {
  OrderStatus,
  PaymentStatus as OrderPaymentStatus,
} from 'src/order/enums/order.enum';
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
    private readonly orderService: OrderService,
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
          console.log(
            `🔍 Processing successful payment for order code: ${orderCode}`,
          );

          // 1. Find payment by transaction ID (order code)
          const payment =
            await this.paymentService.getPaymentByTransactionId(orderCode);
          console.log(`💰 Found payment:`, payment);

          if (payment.status === PaymentStatus.COMPLETED) {
            console.log(
              `⚠️ Payment already completed for order code: ${orderCode}`,
            );
            return res.status(HttpStatus.OK).json({
              statusCode: HttpStatus.OK,
              message: 'Payment already processed',
            });
          }

          // 2. Update payment status to completed
          await this.paymentService.updatePaymentStatus(
            payment.id,
            PaymentStatus.COMPLETED,
            1, // System user ID
            orderCode,
          );
          console.log(`✅ Payment status updated to COMPLETED`);

          // 3. For embedded payments (cart payments), create order
          if (!payment.orderId) {
            console.log(`🛒 Creating order from cart for embedded payment...`);

            // Find cart by checking payment data or user
            // Since we don't have direct cart reference in payment, we'll need to
            // get the cart by the amount or other matching criteria
            // For now, we'll create a simplified approach

            // TODO: Add cartId to payment record for better tracking
            // For now, we'll skip automatic order creation and handle it in frontend
            console.log(
              `⚠️ Cannot create order automatically - cart reference not found in payment`,
            );
          } else {
            console.log(`📦 Order already exists with ID: ${payment.orderId}`);
          }

          console.log(
            `🎉 Successfully processed payment for order code: ${orderCode}`,
          );
        } catch (error) {
          console.error('❌ Error processing successful payment:', error);

          // Don't fail the webhook if payment processing fails
          // PayOS expects 200 response
        }
      } else {
        // Payment failed or cancelled
        const orderCode = webhookData.data?.orderCode;
        console.log(`❌ Payment failed/cancelled for order code: ${orderCode}`);

        if (orderCode) {
          try {
            // Update payment status to failed
            const payment = await this.paymentService.getPaymentByTransactionId(
              orderCode.toString(),
            );
            await this.paymentService.updatePaymentStatus(
              payment.id,
              PaymentStatus.FAILED,
              1, // System user ID
            );
            console.log(`❌ Payment status updated to FAILED`);
          } catch (error) {
            console.error('Error updating failed payment status:', error);
          }
        }
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

  @Post('create-order-from-payment')
  @UseGuards(JwtAuthGuard)
  @Roles(RoleType.Admin, RoleType.User, RoleType.Employee)
  @ApiOperation({ summary: 'Create order from successful PayOS payment' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        transactionId: {
          type: 'string',
          description: 'PayOS transaction ID (order code)',
        },
        customerInfo: {
          type: 'object',
          properties: {
            fullName: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            province: { type: 'string' },
            district: { type: 'string' },
            ward: { type: 'string' },
            addressDetail: { type: 'string' },
            notes: { type: 'string' },
          },
        },
      },
      required: ['transactionId', 'customerInfo'],
    },
  })
  async createOrderFromPayment(
    @Body()
    body: {
      transactionId: string;
      customerInfo: {
        fullName: string;
        phone: string;
        email: string;
        province: string;
        district: string;
        ward: string;
        addressDetail: string;
        notes?: string;
      };
    },
    @Req() req: RequestModel,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const { transactionId, customerInfo } = body;

      console.log(
        `🛒 Creating order from payment - Transaction ID: ${transactionId}`,
      );
      console.log('Customer info:', JSON.stringify(customerInfo, null, 2));

      // 1. Find payment by transaction ID
      let payment;
      try {
        payment =
          await this.paymentService.getPaymentByTransactionId(transactionId);
        console.log('💰 Found payment:', JSON.stringify(payment, null, 2));
      } catch (error) {
        console.error('❌ Payment not found:', error);
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Payment not found with this transaction ID',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      if (payment.status !== PaymentStatus.COMPLETED) {
        console.log(
          `⚠️ Payment status is ${payment.status}, expected COMPLETED`,
        );
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Payment is not completed',
          currentStatus: payment.status,
        });
      }

      if (payment.orderId) {
        console.log(`⚠️ Order already exists: ${payment.orderId}`);
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Order already created for this payment',
          data: { orderId: payment.orderId },
        });
      }

      // 2. Get user's cart
      let userCart;
      try {
        userCart = await this.cartService.getCartByUserId(userId);
        console.log('🛒 Found user cart:', userCart.id);
      } catch (error) {
        console.error('❌ Error getting user cart:', error);
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User cart not found',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // 3. Calculate shipping cost (free if has lenses, 30k if frame only)
      let cartItems;
      try {
        cartItems = await this.cartCombinedService.getCartItemsWithFullDetails(
          userCart.id,
        );
        console.log(`📦 Found ${cartItems.length} cart items`);
      } catch (error) {
        console.error('❌ Error getting cart items:', error);
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Error getting cart items',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      const hasLenses = cartItems.some((item) => item.lensDetail);
      const shippingCost = hasLenses ? 0 : 30000;
      console.log(
        `🚚 Shipping cost: ${shippingCost} (hasLenses: ${hasLenses})`,
      );

      // 4. Create order
      let order;
      try {
        order = await this.orderService.createOrder(
          {
            subtotal: payment.amount,
            shippingCost: shippingCost,
            totalPrice: payment.amount + shippingCost,
            paymentMethod: payment.paymentMethod,
            fullName: customerInfo.fullName,
            phone: customerInfo.phone,
            email: customerInfo.email,
            province: customerInfo.province,
            district: customerInfo.district,
            ward: customerInfo.ward,
            addressDetail: customerInfo.addressDetail,
            notes: customerInfo.notes,
          },
          userId,
        );
        console.log(`📋 Order created with ID: ${order.id}`);
      } catch (error) {
        console.error('❌ Error creating order:', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error creating order',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // 5. Update order status to PROCESSING (since payment is completed)
      try {
        await this.orderService['orderRepository'].update(order.id, {
          status: OrderStatus.PROCESSING, // Order status: processing (payment completed)
          paymentStatus: OrderPaymentStatus.COMPLETED, // Payment status: completed
          updatedBy: userId,
        });
        console.log(
          `📋 Order status updated to PROCESSING for order ID: ${order.id}`,
        );
      } catch (error) {
        console.error('❌ Error updating order status:', error);
        // Continue even if order status update fails
      }

      // 6. Update payment with order ID using raw repository update
      try {
        await this.paymentService['paymentRepository'].update(payment.id, {
          orderId: order.id,
          updatedBy: userId,
        });
        console.log(`💰 Payment updated with order ID: ${order.id}`);
      } catch (error) {
        console.error('❌ Error updating payment:', error);
        // Continue with cart clearing even if payment update fails
      }

      // 7. Clear cart
      try {
        await this.cartCombinedService.clearCart(userCart.id, userId);
        console.log('🧹 Cart cleared successfully');
      } catch (error) {
        console.error('❌ Error clearing cart:', error);
        // Don't fail the whole process if cart clearing fails
      }

      console.log(`✅ Order created successfully - Order ID: ${order.id}`);

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Order created successfully from payment',
        data: {
          orderId: order.id,
          paymentId: payment.id,
          transactionId: transactionId,
        },
      });
    } catch (error) {
      console.error('❌ Error creating order from payment:', error);

      // Return proper error response instead of throwing
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error while creating order',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
