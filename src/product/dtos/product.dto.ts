import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsPositive, IsString } from 'class-validator';
import { ProductGenderType, ProductType } from '../enum/product.type';

export class ProductDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productId!: number;

  @ApiProperty()
  @IsString()
  productType!: ProductType;

  @ApiProperty()
  @IsString()
  productName!: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  categoryId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  brandId!: number;

  @ApiProperty()
  @IsString()
  gender!: ProductGenderType;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  price!: number;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  stock!: number;

  @ApiProperty()
  @IsBoolean()
  isSustainable!: boolean;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  reqUserId!: number;

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

export class GetProductsQueryDto extends PartialType(
  PickType(ProductDto, ['page', 'limit', 'q']),
) {}

export class GetProductByIdParamsDto extends PickType(ProductDto, [
  'productId',
]) {}

export class CreateProductBodyDto extends PickType(ProductDto, [
  'productName',
  'productType',
  'categoryId',
  'gender',
  'price',
  'stock',
  'description',
  'isSustainable',
  'brandId',
]) {}

export class UpdateProductParamsDto extends PickType(ProductDto, [
  'productId',
]) {}

export class UpdateProductBodyDto extends PartialType(
  PickType(ProductDto, [
    'productName',
    'productType',
    'categoryId',
    'gender',
    'price',
    'stock',
    'description',
    'isSustainable',
    'brandId',
  ]),
) {}

export class DeleteProductParamsDto extends PickType(ProductDto, [
  'productId',
]) {}
