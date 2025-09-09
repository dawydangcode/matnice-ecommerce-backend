import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { LensMaterialsType } from '../enum/lens-materials.type';
import { LensDesignType } from '../enum/lens_design.type';

export class LensVariantDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensVariantId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensThicknessId!: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  design!: LensDesignType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  material!: LensMaterialsType;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  stock!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  page!: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  limit!: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search!: string;
}

export class GetLensVariantsQueryDto extends PartialType(
  PickType(LensVariantDto, [
    'page',
    'limit',
    'search',
    'lensId',
    'lensThicknessId',
  ]),
) {}

export class GetLensVariantByIdParamsDto extends PickType(LensVariantDto, [
  'lensVariantId',
]) {}
// Filters for listing
export class LensVariantFiltersDto extends PartialType(
  PickType(LensVariantDto, [
    'page',
    'limit',
    'search',
    'lensId',
    'lensThicknessId',
  ]),
) {}
export class CreateLensVariantBodyDto extends PickType(LensVariantDto, [
  'lensId',
  'lensThicknessId',
  'design',
  'material',
  'price',
  'stock',
]) {}

export class UpdateLensVariantParamsDto extends PickType(LensVariantDto, [
  'lensVariantId',
]) {}
export class UpdateLensVariantBodyDto extends PartialType(
  PickType(CreateLensVariantBodyDto, ['design', 'material', 'price', 'stock']),
) {}

export class DeleteLensVariantParamsDto extends PickType(LensVariantDto, [
  'lensVariantId',
]) {}
