import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

export class ProductColorDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productColorId!: number;

  @ApiProperty()
  @IsString()
  colorName!: string;
}

export class GetProductColorById extends PickType(ProductColorDto, [
  'productColorId',
]) {}

export class CreateProductColorBodyDto extends PickType(ProductColorDto, [
  'colorName',
]) {}

export class UpdateProductColorParamsDto extends PickType(ProductColorDto, [
  'productColorId',
]) {}

export class UpdateProductColorBodyDto extends PartialType(
  PickType(ProductColorDto, ['colorName']),
) {}
