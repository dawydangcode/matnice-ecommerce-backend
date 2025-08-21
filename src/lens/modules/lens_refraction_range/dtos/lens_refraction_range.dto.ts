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
  IsEnum,
} from 'class-validator';
import { LensRefractionType } from '../enum/lens-refraction.type';

export class LensRefractionRangeDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensRefractionRangeId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensVariantId!: number;

  @ApiProperty({ enum: LensRefractionType })
  @IsEnum(LensRefractionType)
  refractionType!: LensRefractionType;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  minValue!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  maxValue!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0.01)
  stepValue!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  page!: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  limit!: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  q!: string;
}

export class GetLensRefractionRangesQueryDto extends PartialType(
  PickType(LensRefractionRangeDto, [
    'page',
    'limit',
    'q',
    'lensVariantId',
    'refractionType',
  ]),
) {}

export class GetLensRefractionRangeParamsDto extends PickType(
  LensRefractionRangeDto,
  ['lensRefractionRangeId'],
) {}

export class CreateLensRefractionRangeBodyDto extends PickType(
  LensRefractionRangeDto,
  ['lensVariantId', 'refractionType', 'minValue', 'maxValue', 'stepValue'],
) {}

export class UpdateLensRefractionRangeParamsDto extends PickType(
  LensRefractionRangeDto,
  ['lensRefractionRangeId'],
) {}

export class UpdateLensRefractionRangeBodyDto extends PartialType(
  PickType(LensRefractionRangeDto, [
    'lensVariantId',
    'refractionType',
    'minValue',
    'maxValue',
    'stepValue',
  ]),
) {}

export class DeleteLensRefractionRangeParamsDto extends PickType(
  LensRefractionRangeDto,
  ['lensRefractionRangeId'],
) {}
