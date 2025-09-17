import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LensCategoryDto {
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
  categoryLensId!: number;

  @ApiProperty()
  @IsPositive()
  page!: number;

  @ApiProperty()
  @IsPositive()
  limit!: number;

  @ApiProperty()
  @IsString()
  q!: string;
}

export class GetLensCategoriesQueryDto extends PartialType(
  PickType(LensCategoryDto, ['page', 'limit', 'q']),
) {}

export class CreateLensCategoryBodyDto extends PickType(LensCategoryDto, [
  'lensId',
  'categoryLensId',
]) {}

export class UpdateLensCategoryDto extends PartialType(
  PickType(LensCategoryDto, ['lensId', 'categoryLensId']),
) {}

export class GetLensCategoryByLensIdParamsDto extends PickType(
  LensCategoryDto,
  ['lensId'],
) {}

export class LensCategoryFilterDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ required: false, example: 'lens name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  lensId?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;
}

export const LensCategorySelectFields = [
  'id',
  'lensId',
  'categoryId',
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
] as const;

export const LensCategoryPublicFields = [
  'id',
  'lensId',
  'categoryId',
  'createdAt',
] as const;
