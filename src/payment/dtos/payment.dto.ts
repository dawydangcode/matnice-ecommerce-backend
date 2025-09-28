import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsPositive,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../enums/payment.enum';

export class PaymentDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  id!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  orderId!: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  amount!: number;

  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status!: PaymentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  page!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  limit!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;
}

// Create Payment DTO
export class CreatePaymentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  orderId?: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  amount!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transactionId?: string;
}

// Update Payment DTO
export class UpdatePaymentDto extends PartialType(
  PickType(PaymentDto, ['status', 'transactionId']),
) {}

// Get Payments Query DTO
export class GetPaymentsQueryDto extends PartialType(
  PickType(PaymentDto, ['page', 'limit', 'search']),
) {
  @ApiProperty({ required: false, enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({ required: false, enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  orderId?: number;
}

// Get Payment by ID Params DTO
export class GetPaymentByIdParamsDto extends PickType(PaymentDto, ['id']) {}

// Update Payment Params DTO
export class UpdatePaymentParamsDto extends PickType(PaymentDto, ['id']) {}

// Delete Payment Params DTO
export class DeletePaymentParamsDto extends PickType(PaymentDto, ['id']) {}

// Payment Response DTO
export class PaymentResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  orderId!: number;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod!: PaymentMethod;

  @ApiProperty()
  amount!: number;

  @ApiProperty({ enum: PaymentStatus })
  status!: PaymentStatus;

  @ApiProperty({ required: false })
  transactionId?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
