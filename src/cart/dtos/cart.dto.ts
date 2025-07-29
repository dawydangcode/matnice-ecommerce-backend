import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CartDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  cartId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId!: number;

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

  @ApiProperty()
  @IsString()
  q!: string;
}

export class GetCartQueryDto extends PartialType(
  PickType(CartDto, ['page', 'limit', 'q']),
) {}

export class GetCartByIdParamsDto extends PickType(CartDto, ['cartId']) {}

export class CartCreateBodyDto extends PickType(CartDto, ['userId']) {}

export class CartUpdateParamsDto extends PickType(CartDto, ['cartId']) {}

export class CartUpdateBodyDto extends PartialType(
  PickType(CartDto, ['userId']),
) {}

export class CartDeleteParamsDto extends PickType(CartDto, ['cartId']) {}
