import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsPositive } from 'class-validator';

export class LensVariantCoatingDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensVariantCoatingId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensVariantId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensCoatingId!: number;

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

export class GetLensVariantCoatingsQueryDto extends PartialType(
  PickType(LensVariantCoatingDto, [
    'page',
    'limit',
    'q',
    'lensVariantId',
    'lensCoatingId',
  ]),
) {}

export class GetLensVariantCoatingParamsDto extends PickType(
  LensVariantCoatingDto,
  ['lensVariantCoatingId'],
) {}

export class CreateLensVariantCoatingBodyDto extends PickType(
  LensVariantCoatingDto,
  ['lensVariantId', 'lensCoatingId'],
) {}

export class UpdateLensVariantCoatingParamsDto extends PickType(
  LensVariantCoatingDto,
  ['lensVariantCoatingId'],
) {}

export class UpdateLensVariantCoatingBodyDto extends PartialType(
  PickType(LensVariantCoatingDto, ['lensVariantId', 'lensCoatingId']),
) {}

export class DeleteLensVariantCoatingParamsDto extends PickType(
  LensVariantCoatingDto,
  ['lensVariantCoatingId'],
) {}
