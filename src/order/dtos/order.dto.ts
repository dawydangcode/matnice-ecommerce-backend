import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsArray,
  ValidateNested,
  IsEnum,
  IsPositive,
} from 'class-validator';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../enums/order.enum';

// Base DTO for common fields
export class OrderDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  id!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  cartId!: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  orderDate!: Date;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  subtotal!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  shippingCost!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  totalPrice!: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  paymentStatus!: PaymentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deliveryDate?: Date;

  @ApiProperty()
  @IsString()
  address!: string;

  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status!: OrderStatus;

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

// Order Item DTO
export class OrderItemDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  quantity!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  framePrice!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  totalPrice!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  discount!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  selectedColorId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderLensDetailDto)
  lensDetail?: OrderLensDetailDto;
}

// Order Lens Detail DTO
export class OrderLensDetailDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensVariantId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  rightEyeSphere!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rightEyeCylinder?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rightEyeAxis?: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  leftEyeSphere!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  leftEyeCylinder?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  leftEyeAxis?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pdLeft?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pdRight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  addLeft?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  addRight?: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensPrice!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  selectedCoatingIds?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  selectedTintColorId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  prescriptionNotes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lensNotes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  manufacturingNotes?: string;
}

// Create Order DTO
export class CreateOrderDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  cartId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  subtotal!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  shippingCost!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  totalPrice!: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty()
  @IsString()
  address!: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems!: OrderItemDto[];
}

// Update Order DTO
export class UpdateOrderDto extends PartialType(
  PickType(OrderDto, [
    'paymentStatus',
    'trackingNumber',
    'deliveryDate',
    'status',
  ]),
) {}

// Get Orders Query DTO
export class GetOrdersQueryDto extends PartialType(
  PickType(OrderDto, ['page', 'limit', 'search']),
) {
  @ApiProperty({ required: false, enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({ required: false, enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;
}

// Get Order by ID Params DTO
export class GetOrderByIdParamsDto extends PickType(OrderDto, ['id']) {}

// Update Order Params DTO
export class UpdateOrderParamsDto extends PickType(OrderDto, ['id']) {}

// Delete Order Params DTO
export class DeleteOrderParamsDto extends PickType(OrderDto, ['id']) {}

// Order Response DTO
export class OrderResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  cartId!: number;

  @ApiProperty()
  orderDate!: Date;

  @ApiProperty()
  subtotal!: number;

  @ApiProperty()
  shippingCost!: number;

  @ApiProperty()
  totalPrice!: number;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod!: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  paymentStatus!: PaymentStatus;

  @ApiProperty({ required: false })
  trackingNumber?: string;

  @ApiProperty({ required: false })
  deliveryDate?: Date;

  @ApiProperty()
  address!: string;

  @ApiProperty({ enum: OrderStatus })
  status!: OrderStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
