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
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class LensThicknessDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensThicknessId!: number;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  indexValue!: number;

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

export class GetLensThicknessesQueryDto extends PartialType(
  PickType(LensThicknessDto, ['page', 'limit', 'q']),
) {}

export class GetLensThicknessParamsDto extends PickType(LensThicknessDto, [
  'lensThicknessId',
]) {}

export class CreateLensThicknessBodyDto extends PickType(LensThicknessDto, [
  'name',
  'description',
  'indexValue',
]) {}

export class UpdateLensThicknessParamsDto extends PickType(LensThicknessDto, [
  'lensThicknessId',
]) {}

export class UpdateLensThicknessBodyDto extends PartialType(
  PickType(LensThicknessDto, ['name', 'description', 'indexValue']),
) {}

export class DeleteLensThicknessParamsDto extends PickType(LensThicknessDto, [
  'lensThicknessId',
]) {}
