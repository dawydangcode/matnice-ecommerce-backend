import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDecimal,
  IsInt,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateOrderLensDetailDto {
  @ApiProperty({
    description: 'Order item ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  orderItemId!: number;

  @ApiProperty({
    description: 'Lens variant ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  lensVariantId!: number;

  @ApiProperty({
    description: 'Right eye sphere value',
    example: -2.5,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(-20)
  @Max(20)
  rightEyeSphere!: number;

  @ApiPropertyOptional({
    description: 'Right eye cylinder value',
    example: -0.75,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(-10)
  @Max(10)
  rightEyeCylinder?: number;

  @ApiPropertyOptional({
    description: 'Right eye axis value',
    example: 90,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(180)
  rightEyeAxis?: number;

  @ApiProperty({
    description: 'Left eye sphere value',
    example: -2.75,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(-20)
  @Max(20)
  leftEyeSphere!: number;

  @ApiPropertyOptional({
    description: 'Left eye cylinder value',
    example: -0.5,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(-10)
  @Max(10)
  leftEyeCylinder?: number;

  @ApiPropertyOptional({
    description: 'Left eye axis value',
    example: 85,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(180)
  leftEyeAxis?: number;

  @ApiPropertyOptional({
    description: 'Left pupillary distance',
    example: 31.5,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Type(() => Number)
  @Min(20)
  @Max(45)
  pdLeft?: number;

  @ApiPropertyOptional({
    description: 'Right pupillary distance',
    example: 32.0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Type(() => Number)
  @Min(20)
  @Max(45)
  pdRight?: number;

  @ApiPropertyOptional({
    description: 'Left eye addition value',
    example: 2.0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  @Max(5)
  addLeft?: number;

  @ApiPropertyOptional({
    description: 'Right eye addition value',
    example: 2.0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  @Max(5)
  addRight?: number;

  @ApiProperty({
    description: 'Lens price',
    example: 150.0,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  lensPrice!: number;

  @ApiPropertyOptional({
    description: 'Selected coating IDs (JSON array)',
    example: '[1, 2, 3]',
  })
  @IsOptional()
  @IsString()
  selectedCoatingIds?: string;

  @ApiPropertyOptional({
    description: 'Selected tint color ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  selectedTintColorId?: number;

  @ApiPropertyOptional({
    description: 'Prescription notes',
    example: 'Patient has astigmatism',
  })
  @IsOptional()
  @IsString()
  prescriptionNotes?: string;

  @ApiPropertyOptional({
    description: 'Lens notes',
    example: 'Progressive lenses recommended',
  })
  @IsOptional()
  @IsString()
  lensNotes?: string;

  @ApiPropertyOptional({
    description: 'Manufacturing notes',
    example: 'Handle with care',
  })
  @IsOptional()
  @IsString()
  manufacturingNotes?: string;

  @ApiProperty({
    description: 'Created by user ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  createdBy!: number;
}

export class UpdateOrderLensDetailDto {
  @ApiPropertyOptional({
    description: 'Lens variant ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lensVariantId?: number;

  @ApiPropertyOptional({
    description: 'Right eye sphere value',
    example: -2.5,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(-20)
  @Max(20)
  rightEyeSphere?: number;

  @ApiPropertyOptional({
    description: 'Right eye cylinder value',
    example: -0.75,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(-10)
  @Max(10)
  rightEyeCylinder?: number;

  @ApiPropertyOptional({
    description: 'Right eye axis value',
    example: 90,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(180)
  rightEyeAxis?: number;

  @ApiPropertyOptional({
    description: 'Left eye sphere value',
    example: -2.75,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(-20)
  @Max(20)
  leftEyeSphere?: number;

  @ApiPropertyOptional({
    description: 'Left eye cylinder value',
    example: -0.5,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(-10)
  @Max(10)
  leftEyeCylinder?: number;

  @ApiPropertyOptional({
    description: 'Left eye axis value',
    example: 85,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(180)
  leftEyeAxis?: number;

  @ApiPropertyOptional({
    description: 'Left pupillary distance',
    example: 31.5,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Type(() => Number)
  @Min(20)
  @Max(45)
  pdLeft?: number;

  @ApiPropertyOptional({
    description: 'Right pupillary distance',
    example: 32.0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Type(() => Number)
  @Min(20)
  @Max(45)
  pdRight?: number;

  @ApiPropertyOptional({
    description: 'Left eye addition value',
    example: 2.0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  @Max(5)
  addLeft?: number;

  @ApiPropertyOptional({
    description: 'Right eye addition value',
    example: 2.0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  @Max(5)
  addRight?: number;

  @ApiPropertyOptional({
    description: 'Lens price',
    example: 150.0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  lensPrice?: number;

  @ApiPropertyOptional({
    description: 'Selected coating IDs (JSON array)',
    example: '[1, 2, 3]',
  })
  @IsOptional()
  @IsString()
  selectedCoatingIds?: string;

  @ApiPropertyOptional({
    description: 'Selected tint color ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  selectedTintColorId?: number;

  @ApiPropertyOptional({
    description: 'Prescription notes',
    example: 'Patient has astigmatism',
  })
  @IsOptional()
  @IsString()
  prescriptionNotes?: string;

  @ApiPropertyOptional({
    description: 'Lens notes',
    example: 'Progressive lenses recommended',
  })
  @IsOptional()
  @IsString()
  lensNotes?: string;

  @ApiPropertyOptional({
    description: 'Manufacturing notes',
    example: 'Handle with care',
  })
  @IsOptional()
  @IsString()
  manufacturingNotes?: string;

  @ApiProperty({
    description: 'Updated by user ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  updatedBy!: number;
}

export class OrderLensDetailResponseDto {
  @ApiProperty({
    description: 'Order lens detail ID',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Order item ID',
    example: 1,
  })
  orderItemId!: number;

  @ApiProperty({
    description: 'Lens variant ID',
    example: 1,
  })
  lensVariantId!: number;

  @ApiProperty({
    description: 'Right eye sphere value',
    example: -2.5,
  })
  rightEyeSphere!: number;

  @ApiPropertyOptional({
    description: 'Right eye cylinder value',
    example: -0.75,
  })
  rightEyeCylinder?: number;

  @ApiPropertyOptional({
    description: 'Right eye axis value',
    example: 90,
  })
  rightEyeAxis?: number;

  @ApiProperty({
    description: 'Left eye sphere value',
    example: -2.75,
  })
  leftEyeSphere!: number;

  @ApiPropertyOptional({
    description: 'Left eye cylinder value',
    example: -0.5,
  })
  leftEyeCylinder?: number;

  @ApiPropertyOptional({
    description: 'Left eye axis value',
    example: 85,
  })
  leftEyeAxis?: number;

  @ApiPropertyOptional({
    description: 'Left pupillary distance',
    example: 31.5,
  })
  pdLeft?: number;

  @ApiPropertyOptional({
    description: 'Right pupillary distance',
    example: 32.0,
  })
  pdRight?: number;

  @ApiPropertyOptional({
    description: 'Left eye addition value',
    example: 2.0,
  })
  addLeft?: number;

  @ApiPropertyOptional({
    description: 'Right eye addition value',
    example: 2.0,
  })
  addRight?: number;

  @ApiProperty({
    description: 'Lens price',
    example: 150.0,
  })
  lensPrice!: number;

  @ApiPropertyOptional({
    description: 'Selected coating IDs (JSON array)',
    example: '[1, 2, 3]',
  })
  selectedCoatingIds?: string;

  @ApiPropertyOptional({
    description: 'Selected tint color ID',
    example: 1,
  })
  selectedTintColorId?: number;

  @ApiPropertyOptional({
    description: 'Prescription notes',
    example: 'Patient has astigmatism',
  })
  prescriptionNotes?: string;

  @ApiPropertyOptional({
    description: 'Lens notes',
    example: 'Progressive lenses recommended',
  })
  lensNotes?: string;

  @ApiPropertyOptional({
    description: 'Manufacturing notes',
    example: 'Handle with care',
  })
  manufacturingNotes?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Created by user ID',
    example: 1,
  })
  createdBy!: number;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Updated by user ID',
    example: 1,
  })
  updatedBy!: number;

  @ApiPropertyOptional({
    description: 'Deletion timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  deletedAt?: Date;

  @ApiPropertyOptional({
    description: 'Deleted by user ID',
    example: 1,
  })
  deletedBy?: number;
}
