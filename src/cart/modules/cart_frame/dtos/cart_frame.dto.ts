import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min, IsString } from 'class-validator';

export class CreateCartFrameDto {
  @ApiProperty()
  @IsNumber()
  cartId!: number;

  @ApiProperty()
  @IsNumber()
  productId!: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty()
  @IsNumber()
  framePrice!: number;

  @ApiProperty()
  @IsNumber()
  totalPrice!: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  selectedColorId?: number;
}

export class UpdateCartFrameDto extends PickType(CreateCartFrameDto, [
  'quantity',
  'framePrice',
  'totalPrice',
  'discount',
  'selectedColorId',
]) {}

export class GetCartFrameParamsDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  cartFrameId!: number;
}

export class CartFrameQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cartId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  productId?: number;
}
