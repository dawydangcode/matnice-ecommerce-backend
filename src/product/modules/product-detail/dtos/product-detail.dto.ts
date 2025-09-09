import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';
import {
  FrameBridgeDesignType,
  FrameMaterialType,
  FrameShapeType,
  FrameStyleType,
  FrameType,
} from '../enum/frame.type';

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
  lensWidth!: number;

  @ApiProperty()
  @IsNumber()
  templeLength!: number;

  @ApiProperty()
  @IsString()
  frameMaterial!: FrameMaterialType;

  @ApiProperty()
  @IsString()
  frameShape!: FrameShapeType;

  @ApiProperty()
  @IsString()
  frameType!: FrameType;

  @ApiProperty()
  @IsString()
  bridgeDesign!: FrameBridgeDesignType;

  @ApiProperty()
  @IsString()
  style!: FrameStyleType;

  @ApiProperty()
  @IsBoolean()
  springHinges!: boolean;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  weight!: number;

  @ApiProperty()
  @IsBoolean()
  multifocal!: boolean;
}

export class GetProductDetailByIdParamsDto extends PickType(ProductDetailDto, [
  'productDetailId',
]) {}

export class CreateProductDetailBodyDto extends PickType(ProductDetailDto, [
  'productId',
  'bridgeWidth',
  'frameWidth',
  'lensHeight',
  'lensWidth',
  'templeLength',
  'frameMaterial',
  'frameShape',
  'frameType',
  'bridgeDesign',
  'style',
  'springHinges',
  'weight',
  'multifocal',
]) {}

export class UpdateProductDetailParamsDto extends PickType(ProductDetailDto, [
  'productDetailId',
]) {}

export class UpdateProductDetailBodyDto extends PartialType(
  PickType(ProductDetailDto, [
    'productId',
    'bridgeWidth',
    'frameWidth',
    'lensHeight',
    'lensWidth',
    'templeLength',
    'frameMaterial',
    'frameShape',
    'frameType',
    'bridgeDesign',
    'style',
    'springHinges',
    'weight',
    'multifocal',
  ]),
) {}

export class DeleteProductDetailParamsDto extends PickType(ProductDetailDto, [
  'productDetailId',
]) {}
