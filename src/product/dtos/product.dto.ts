import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsPositive,
  IsString,
  IsArray,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';
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
  @IsBoolean()
  isSustainable!: boolean;

  @ApiProperty()
  @IsBoolean()
  isNew!: boolean;

  @ApiProperty()
  @IsDate()
  newUntil!: Date;

  @ApiProperty()
  @IsBoolean()
  isBoutique!: boolean;

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

export class GetProductsForCardQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  productTypeIds?: number[];

  @ApiProperty({ enum: ProductType, required: false })
  @IsOptional()
  @IsEnum(ProductType)
  productType?: ProductType;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  brandIds?: number[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  categoryIds?: number[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  gender?: ProductGenderType[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'name' | 'newest';

  @ApiProperty()
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
  // Filter productDetail
  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  frameType?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  frameShape?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  frameMaterial?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  bridgeDesign?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  style?: string[];

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  frameWidthMin?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  frameWidthMax?: number;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === '1' || value === 'true') return 'true';
    if (value === '0' || value === 'false') return 'false';
    return value;
  })
  boutique?: string;
}

export class GetProductByIdParamsDto extends PickType(ProductDto, [
  'productId',
]) {}

export class CreateProductBodyDto extends PickType(ProductDto, [
  'productName',
  'productType',
  'gender',
  'price',
  'description',
  'isSustainable',
  'brandId',
  'isNew',
  'isBoutique',
]) {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  categoryIds?: number[];
}

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
    'description',
    'isSustainable',
    'brandId',
    'isNew',
    'isBoutique',
  ]),
) {}

export class DeleteProductParamsDto extends PickType(ProductDto, [
  'productId',
]) {}
