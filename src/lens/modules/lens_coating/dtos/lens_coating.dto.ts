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

export class LensCoatingDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensCoatingId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensId!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price!: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description!: string;

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

export class GetLensCoatingsQueryDto extends PartialType(
  PickType(LensCoatingDto, ['page', 'limit', 'q']),
) {}

export class GetLensCoatingParamsDto extends PickType(LensCoatingDto, [
  'lensCoatingId',
]) {}

export class CreateLensCoatingBodyDto extends PickType(LensCoatingDto, [
  'lensId',
  'name',
  'price',
  'description',
]) {}

export class UpdateLensCoatingParamsDto extends PickType(LensCoatingDto, [
  'lensCoatingId',
]) {}

export class UpdateLensCoatingBodyDto extends PartialType(
  PickType(LensCoatingDto, ['lensId', 'name', 'price', 'description']),
) {}

export class DeleteLensCoatingParamsDto extends PickType(LensCoatingDto, [
  'lensCoatingId',
]) {}
