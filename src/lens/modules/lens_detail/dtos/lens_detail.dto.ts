import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';
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
  @IsString()
  lensType!: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  hasAxisCorrection!: boolean;

  @ApiProperty()
  @IsBoolean()
  isNonPrescription!: boolean;
}

export class CreateLensDetailBodyDto extends PickType(LensDetailDto, [
  'lensId',
  'lensType',
  'hasAxisCorrection',
  'isNonPrescription',
]) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lensThicknessId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lensQualityId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  tintId?: number;
}

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
    'lensType',
    'hasAxisCorrection',
    'isNonPrescription',
  ]),
) {}
