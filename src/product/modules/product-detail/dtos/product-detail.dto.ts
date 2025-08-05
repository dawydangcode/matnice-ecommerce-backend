import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { FrameShapeType, FrameType } from '../enum/frame.type';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDetailDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productDetailId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productId!: number;

  @ApiProperty()
  @IsString()
  productNumber!: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  bridgeWidth!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  frameWidth!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensHeight!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensWidth!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  templeLength!: number;

  @ApiProperty()
  @IsString()
  frameColor!: string;

  @ApiProperty()
  @IsString()
  frameMaterial!: string;

  @ApiProperty()
  @IsString()
  frameShape!: FrameShapeType;

  @ApiProperty()
  frameType!: FrameType;

  @ApiProperty()
  @IsBoolean()
  springHinge!: boolean;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  page!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  limit!: number;

  @ApiProperty()
  @IsString()
  q!: string;
}

export class GetProductDetailQueryDto extends PartialType(
  PickType(ProductDetailDto, ['page', 'limit', 'q']),
) {}

export class GetProductDetailByIdParamsDto extends PickType(ProductDetailDto, [
  'productDetailId',
]) {}

export class CreateProductDetailBodyDto extends PickType(ProductDetailDto, [
  'productId',
  'productNumber',
  'bridgeWidth',
  'frameWidth',
  'lensHeight',
  'lensWidth',
  'templeLength',
  'frameColor',
  'frameMaterial',
  'frameShape',
  'frameType',
  'springHinge',
]) {}

export class UpdateProductDetailParamsDto extends PickType(ProductDetailDto, [
  'productDetailId',
]) {}

export class UpdateProductDetailBodyDto extends PartialType(
  PickType(ProductDetailDto, [
    'productId',
    'productNumber',
    'bridgeWidth',
    'frameWidth',
    'lensHeight',
    'lensWidth',
    'templeLength',
    'frameColor',
    'frameMaterial',
    'frameShape',
    'frameType',
    'springHinge',
  ]),
) {}

export class DeleteProductDetailParamsDto extends PickType(ProductDetailDto, [
  'productDetailId',
]) {}
