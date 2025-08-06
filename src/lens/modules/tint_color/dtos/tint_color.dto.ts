import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  IsNotEmpty,
  IsUrl,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTintColorDto {
  @ApiProperty({
    description: 'ID of the lens tint this color belongs to',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  tintId!: number;

  @ApiProperty({
    description: 'Name of the tint color',
    example: 'Grey',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({
    description: 'Image URL for the tint color',
    example: 'https://example.com/images/grey-tint.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Color code (hex format)',
    example: '#808080',
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color code must be a valid hex color (e.g., #808080)',
  })
  colorCode?: string;
}

export class UpdateTintColorDto {
  @ApiPropertyOptional({
    description: 'ID of the lens tint this color belongs to',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  tintId?: number;

  @ApiPropertyOptional({
    description: 'Name of the tint color',
    example: 'Dark Grey',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Image URL for the tint color',
    example: 'https://example.com/images/dark-grey-tint.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Color code (hex format)',
    example: '#404040',
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color code must be a valid hex color (e.g., #404040)',
  })
  colorCode?: string;
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

export class TintIdParamsDto {
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
