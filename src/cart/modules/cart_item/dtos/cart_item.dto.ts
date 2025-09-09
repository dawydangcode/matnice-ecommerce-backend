import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateCartItemBodyDto {
  @ApiProperty()
  @IsNumber()
  cartId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  cartItemId!: number;

  @ApiProperty()
  @IsNumber()
  productId!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lensId!: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class UpdateCartItemBodyDto extends PickType(CreateCartItemBodyDto, [
  'quantity',
]) {}

export class GetCartItemParamsDto extends PickType(CreateCartItemBodyDto, [
  'cartItemId',
]) {}

export class CartItemQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  cartId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lensId?: number;
}
