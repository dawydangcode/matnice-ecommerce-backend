import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';
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
  color!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  stock!: number;

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

export class GetProductsQueryDto extends PickType(ProductDto, [
  'page',
  'limit',
  'q',
]) {}

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
  'color',
  'description',
  'brandId',
]) {}
