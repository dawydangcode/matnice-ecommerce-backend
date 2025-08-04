import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLensDetailDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  lensId!: number;

  @IsOptional()
  @IsString()
  lensType?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  thicknessIndex?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  thicknessPrice?: number;

  @IsOptional()
  @IsString()
  qualityType?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  qualityPrice?: number;

  @IsOptional()
  @IsString()
  tintType?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  tintPrice?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  powerSphereLeft?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  powerSphereRight?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  powerCylinderLeft?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  powerCylinderRight?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  axisLeft?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  axisRight?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  pdLeft?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  pdRight?: number;

  @IsOptional()
  @IsDateString()
  prescriptionDate?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  coating?: string;
}

export class UpdateLensDetailDto {
  @IsOptional()
  @IsString()
  lensType?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  thicknessIndex?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  thicknessPrice?: number;

  @IsOptional()
  @IsString()
  qualityType?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  qualityPrice?: number;

  @IsOptional()
  @IsString()
  tintType?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  tintPrice?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  powerSphereLeft?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  powerSphereRight?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  powerCylinderLeft?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  powerCylinderRight?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  axisLeft?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  axisRight?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  pdLeft?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  pdRight?: number;

  @IsOptional()
  @IsDateString()
  prescriptionDate?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  coating?: string;
}
