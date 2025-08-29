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

export class LensVariantDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  id!: number;

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
  design!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  material!: string;

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

export class LensVariantParamsDto extends PickType(LensVariantDto, ['id']) {}

export class CreateLensVariantDto extends PickType(LensVariantDto, [
  'lensId',
  'lensThicknessId',
  'design',
  'material',
  'price',
  'stock',
]) {}

export class UpdateLensVariantDto extends PartialType(
  PickType(CreateLensVariantDto, ['design', 'material', 'price', 'stock']),
) {}
