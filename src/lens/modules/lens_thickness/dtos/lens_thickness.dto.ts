import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDecimal,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateLensThicknessDto {
  @ApiProperty({ example: 'Standard 1.5mm', description: 'Thickness name' })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'Standard lens thickness for regular prescriptions',
    description: 'Thickness description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 1.5,
    description: 'Thickness value in specified unit',
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  thickness?: number;

  @ApiProperty({
    example: 'mm',
    description: 'Unit of thickness measurement',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @ApiProperty({ example: true, description: 'Active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateLensThicknessDto extends PartialType(
  CreateLensThicknessDto,
) {}

export class LensThicknessFilterDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ required: false, example: 'Standard' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}

export const LensThicknessSelectFields = [
  'id',
  'name',
  'description',
  'thickness',
  'unit',
  'isActive',
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
] as const;

export const LensThicknessPublicFields = [
  'id',
  'name',
  'description',
  'thickness',
  'unit',
  'isActive',
] as const;
