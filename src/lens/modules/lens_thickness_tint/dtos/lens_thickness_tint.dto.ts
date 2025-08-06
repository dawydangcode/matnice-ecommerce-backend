import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLensThicknessTintDto {
  @ApiProperty({
    description: 'Lens thickness ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  lensThicknessId!: number;

  @ApiProperty({
    description: 'Tint ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  tintId!: number;
}

export class CreateBulkLensThicknessTintDto {
  @ApiProperty({
    description: 'Lens thickness ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  lensThicknessId!: number;

  @ApiProperty({
    description: 'Array of tint IDs to associate with the thickness',
    example: [1, 2, 3],
  })
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  tintIds!: number[];
}

export class CreateTintThicknessCompatibilityDto {
  @ApiProperty({
    description: 'Tint ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  tintId!: number;

  @ApiProperty({
    description: 'Array of lens thickness IDs compatible with this tint',
    example: [1, 2, 3],
  })
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  lensThicknessIds!: number[];
}

export class UpdateLensThicknessTintDto {
  @ApiPropertyOptional({
    description: 'Lens thickness ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  lensThicknessId?: number;

  @ApiPropertyOptional({
    description: 'Tint ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  tintId?: number;
}

export class LensThicknessTintParamsDto {
  @ApiProperty({
    description: 'Lens thickness tint relationship ID',
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  lensThicknessTintId!: number;
}

export class LensThicknessParamsDto {
  @ApiProperty({
    description: 'Lens thickness ID',
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  lensThicknessId!: number;
}

export class TintParamsDto {
  @ApiProperty({
    description: 'Tint ID',
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  tintId!: number;
}
