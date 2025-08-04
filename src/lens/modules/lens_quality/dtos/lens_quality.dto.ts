import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLensQualityDto {
  @ApiProperty({
    description: 'Name of the lens quality',
    example: 'SpexPro',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({
    description: 'Price of the lens quality',
    example: 149.95,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price!: number;

  @ApiPropertyOptional({
    description: 'Description of the lens quality',
    example: 'Premium lens quality with advanced features',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'UV protection feature',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  uvProtection?: boolean;

  @ApiPropertyOptional({
    description: 'Anti-reflective coating',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  antiReflective?: boolean;

  @ApiPropertyOptional({
    description: 'Hard coating for scratch resistance',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  hardCoating?: boolean;

  @ApiPropertyOptional({
    description: 'Night & Day optimization',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  nightDayOptimization?: boolean;

  @ApiPropertyOptional({
    description: 'Antistatic coating',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  antistaticCoating?: boolean;

  @ApiPropertyOptional({
    description: 'Free-form technology',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  freeFormTechnology?: boolean;

  @ApiPropertyOptional({
    description: 'Transitions option available',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  transitionsOption?: boolean;
}

export class UpdateLensQualityDto {
  @ApiPropertyOptional({
    description: 'Name of the lens quality',
    example: 'SpexPro Plus',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Price of the lens quality',
    example: 199.95,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @ApiPropertyOptional({
    description: 'Description of the lens quality',
    example: 'Premium lens quality with enhanced features',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'UV protection feature',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  uvProtection?: boolean;

  @ApiPropertyOptional({
    description: 'Anti-reflective coating',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  antiReflective?: boolean;

  @ApiPropertyOptional({
    description: 'Hard coating for scratch resistance',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  hardCoating?: boolean;

  @ApiPropertyOptional({
    description: 'Night & Day optimization',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  nightDayOptimization?: boolean;

  @ApiPropertyOptional({
    description: 'Antistatic coating',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  antistaticCoating?: boolean;

  @ApiPropertyOptional({
    description: 'Free-form technology',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  freeFormTechnology?: boolean;

  @ApiPropertyOptional({
    description: 'Transitions option available',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  transitionsOption?: boolean;
}

export class LensQualityParamsDto {
  @ApiProperty({
    description: 'Lens quality ID',
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  lensQualityId!: number;
}
