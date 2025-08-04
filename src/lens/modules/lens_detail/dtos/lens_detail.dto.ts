import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

export class LensDetailDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensDetailId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensThicknessId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensQualityId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  tintId!: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  powerSphereLeft!: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  powerSphereRight!: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  powerCylinderLeft!: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  powerCylinderRight!: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  axisLeft!: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  axisRight!: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  pdLeft!: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  pdRight!: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  prescriptionDate!: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  material!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  coating!: string;
}

export class CreateLensDetailBodyDto extends PickType(LensDetailDto, [
  'lensId',
  'lensThicknessId',
  'lensQualityId',
  'tintId',
  'powerSphereLeft',
  'powerSphereRight',
  'powerCylinderLeft',
  'powerCylinderRight',
  'axisLeft',
  'axisRight',
  'pdLeft',
  'pdRight',
  'prescriptionDate',
  'material',
  'coating',
]) {}

export class UpdateLensDetailParamsDto extends PickType(LensDetailDto, [
  'lensDetailId',
]) {}

export class UpdateLensDetailBodyDto extends PartialType(
  PickType(LensDetailDto, [
    'lensId',
    'lensThicknessId',
    'lensQualityId',
    'tintId',
    'powerSphereLeft',
    'powerSphereRight',
    'powerCylinderLeft',
    'powerCylinderRight',
    'axisLeft',
    'axisRight',
    'pdLeft',
    'pdRight',
    'prescriptionDate',
    'material',
    'coating',
  ]),
) {}
