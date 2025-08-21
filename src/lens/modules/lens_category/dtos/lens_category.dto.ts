import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateLensCategoryDto {
  @ApiProperty()
  @IsNumber()
  lensId!: number;

  @ApiProperty()
  @IsNumber()
  categoryId!: number;
}

export class UpdateLensCategoryDto extends PartialType(CreateLensCategoryDto) {}

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
