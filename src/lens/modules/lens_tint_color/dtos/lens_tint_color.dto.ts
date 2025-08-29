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
  MaxLength,
  IsUrl,
  Matches,
} from 'class-validator';

export class LensTintColorDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensTintColorId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensVariantId!: number;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color code must be a valid hex color (e.g., #FFFFFF)',
  })
  colorCode!: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page!: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit!: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  q!: string;
}

export class GetLensTintColorsQueryDto extends PartialType(
  PickType(LensTintColorDto, ['page', 'limit', 'q', 'lensVariantId']),
) {}

export class GetLensTintColorParamsDto extends PickType(LensTintColorDto, [
  'lensTintColorId',
]) {}

export class CreateLensTintColorBodyDto extends PickType(LensTintColorDto, [
  'lensVariantId',
  'name',
  'imageUrl',
  'colorCode',
]) {}

export class UpdateLensTintColorParamsDto extends PickType(LensTintColorDto, [
  'lensTintColorId',
]) {}

export class UpdateLensTintColorBodyDto extends PartialType(
  PickType(LensTintColorDto, ['name', 'imageUrl', 'colorCode']),
) {}

export class DeleteLensTintColorParamsDto extends PickType(LensTintColorDto, [
  'lensTintColorId',
]) {}
