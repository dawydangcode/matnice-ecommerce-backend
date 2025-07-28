import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class ProductImageDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productImageId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productId!: number;

  @ApiProperty()
  @IsString()
  @IsUrl()
  imageUrl!: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  page!: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  limit!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  q!: string;
}

export class GetProductImagesQueryDto extends PartialType(
  PickType(ProductImageDto, ['page', 'limit', 'q']),
) {}

export class GetProductImagesByProductIdParamsDto extends PickType(
  ProductImageDto,
  ['productId'],
) {}

export class GetProductImageParamsDto extends PickType(ProductImageDto, [
  'productImageId',
]) {}

export class CreateProductImageBodyDto extends PickType(ProductImageDto, [
  'productId',
  'imageUrl',
]) {}

export class UpdateProductImageParamsDto extends PickType(ProductImageDto, [
  'productImageId',
]) {}

export class UpdateProductImageBodyDto extends PartialType(
  PickType(ProductImageDto, ['imageUrl']),
) {}

export class DeleteProductImageParamsDto extends PickType(ProductImageDto, [
  'productImageId',
]) {}

// Upload DTOs
export class UploadProductImageParamsDto extends PickType(ProductImageDto, [
  'productId',
]) {}
