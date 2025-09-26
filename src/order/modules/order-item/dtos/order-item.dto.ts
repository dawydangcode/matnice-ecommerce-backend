import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class OrderItemDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  id!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  orderId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
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

// Create OrderItem DTO
export class CreateOrderItemDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  orderId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  quantity!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  framePrice!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  totalPrice!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  selectedColorId?: number;
}

// Update OrderItem DTO
export class UpdateOrderItemDto extends PartialType(
  PickType(OrderItemDto, [
    'productId',
    'quantity',
    'framePrice',
    'totalPrice',
    'discount',
    'selectedColorId',
  ]),
) {}

// Get OrderItems Query DTO
export class GetOrderItemsQueryDto extends PartialType(
  PickType(OrderItemDto, ['page', 'limit', 'search']),
) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  orderId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  productId?: number;
}

// Get OrderItem by ID Params DTO
export class GetOrderItemByIdParamsDto extends PickType(OrderItemDto, ['id']) {}

// Update OrderItem Params DTO
export class UpdateOrderItemParamsDto extends PickType(OrderItemDto, ['id']) {}

// Delete OrderItem Params DTO
export class DeleteOrderItemParamsDto extends PickType(OrderItemDto, ['id']) {}

// OrderItem Response DTO
export class OrderItemResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  orderId!: number;

  @ApiProperty()
  productId!: number;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  framePrice!: number;

  @ApiProperty()
  totalPrice!: number;

  @ApiProperty()
  discount!: number;

  @ApiProperty({ required: false })
  selectedColorId?: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
