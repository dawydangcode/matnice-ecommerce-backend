import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  IsNotEmpty,
  IsInt,
  IsUrl,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLensTintDto {
  @ApiProperty({
    description: 'Name of the lens tint',
    example: 'Photochromic',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({
    description: 'Price of the lens tint',
    example: 89.95,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price!: number;

  @ApiPropertyOptional({
    description: 'Description of the lens tint',
    example: 'Advanced photochromic lenses that adapt to light conditions',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdateLensTintDto {
  @ApiPropertyOptional({
    description: 'Name of the lens tint',
    example: 'Photochromic Pro',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Price of the lens tint',
    example: 99.95,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @ApiPropertyOptional({
    description: 'Description of the lens tint',
    example: 'Premium photochromic lenses with enhanced features',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class LensTintParamsDto {
  @ApiProperty({
    description: 'Lens tint ID',
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  lensTintId!: number;
}

export class TintColorParamsDto {
  @ApiProperty({
    description: 'Tint color ID',
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  tintColorId!: number;
}
