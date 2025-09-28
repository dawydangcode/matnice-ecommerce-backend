import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class PaymentItemDto {
  @ApiProperty({ description: 'Item name' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Item quantity' })
  @IsNumber()
  @Type(() => Number)
  quantity!: number;

  @ApiProperty({ description: 'Item price' })
  @IsNumber()
  @Type(() => Number)
  price!: number;
}

export class CreatePaymentLinkDto {
  @ApiProperty({ description: 'Order ID from your system' })
  @IsNumber()
  @Type(() => Number)
  orderId!: number;

  @ApiProperty({ description: 'Total amount' })
  @IsNumber()
  @Type(() => Number)
  amount!: number;

  @ApiProperty({ description: 'Payment description' })
  @IsString()
  description!: string;

  @ApiProperty({ description: 'List of items', type: [PaymentItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDto)
  items!: PaymentItemDto[];

  @ApiProperty({ description: 'Return URL after successful payment' })
  @IsString()
  returnUrl!: string;

  @ApiProperty({ description: 'Cancel URL when payment is cancelled' })
  @IsString()
  cancelUrl!: string;

  @ApiProperty({ description: 'Buyer name', required: false })
  @IsOptional()
  @IsString()
  buyerName?: string;

  @ApiProperty({ description: 'Buyer email', required: false })
  @IsOptional()
  @IsEmail()
  buyerEmail?: string;

  @ApiProperty({ description: 'Buyer phone', required: false })
  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @ApiProperty({ description: 'Buyer address', required: false })
  @IsOptional()
  @IsString()
  buyerAddress?: string;
}

export class PaymentLinkResponseDto {
  @ApiProperty()
  bin!: string;

  @ApiProperty()
  accountNumber!: string;

  @ApiProperty()
  accountName!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  orderCode!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  paymentLinkId!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  checkoutUrl!: string;

  @ApiProperty()
  qrCode!: string;
}

export class PaymentWebhookDto {
  @ApiProperty()
  @IsString()
  code!: string;

  @ApiProperty()
  @IsString()
  desc!: string;

  @ApiProperty()
  success!: boolean;

  @ApiProperty()
  data!: any;

  @ApiProperty()
  @IsString()
  signature!: string;
}

export class CreateEmbeddedPaymentDto {
  @ApiProperty({ description: 'Cart ID to create payment for' })
  @IsNumber()
  @Type(() => Number)
  cartId!: number;

  @ApiProperty({ description: 'Return URL after successful payment' })
  @IsString()
  returnUrl!: string;

  @ApiProperty({ description: 'Cancel URL when payment is cancelled' })
  @IsString()
  cancelUrl!: string;

  @ApiProperty({ description: 'Buyer name', required: false })
  @IsOptional()
  @IsString()
  buyerName?: string;

  @ApiProperty({ description: 'Buyer email', required: false })
  @IsOptional()
  @IsEmail()
  buyerEmail?: string;

  @ApiProperty({ description: 'Buyer phone', required: false })
  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @ApiProperty({ description: 'Buyer address', required: false })
  @IsOptional()
  @IsString()
  buyerAddress?: string;
}
