import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class ProductColorDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productColorId!: number;

  @ApiProperty()
  @IsString()
  colorName!: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productId!: number;

  @ApiProperty()
  @IsString()
  productVariantName!: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productNumber!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  stock!: number;

  @ApiProperty()
  @IsBoolean()
  isThumbnail!: boolean;
}

export class GetProductColorByIdParamsDto extends PickType(ProductColorDto, [
  'productColorId',
]) {}

export class CreateProductColorBodyDto extends PickType(ProductColorDto, [
  'productId',
  'colorName',
  'productVariantName',
  'productNumber',
  'stock',
  'isThumbnail',
]) {}

export class UpdateProductColorParamsDto extends PickType(ProductColorDto, [
  'productColorId',
]) {}

export class UpdateProductColorBodyDto extends PartialType(
  PickType(ProductColorDto, [
    'productId',
    'colorName',
    'productVariantName',
    'productNumber',
    'stock',
    'isThumbnail',
  ]),
) {}

export class DeleteProductColorParamsDto extends PickType(ProductColorDto, [
  'productColorId',
]) {}
