import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProduct3dModelDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNotEmpty()
  @IsNumber()
  productId!: number;

  @ApiProperty({ description: 'Type of 3D model', example: 'glb' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  modelType!: string;

  @ApiProperty({ description: 'File extension', example: '.glb' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  fileType!: string;

  @ApiProperty({ description: 'URL to the 3D model file' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  fileUrl!: string;

  @ApiProperty({ description: 'Original filename' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  fileName!: string;

  @ApiPropertyOptional({ description: 'File size in bytes' })
  @IsOptional()
  @IsNumber()
  fileSize!: number;

  @ApiPropertyOptional({
    description: 'Is this the primary 3D model for the product',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary!: boolean;

  @ApiPropertyOptional({ description: 'Thumbnail URL for preview' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  thumbnailUrl!: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: '{ "textures"!: ["texture1.jpg"], "animations"!: [] }',
  })
  @IsOptional()
  metadata!: Record<string, any>;
}

export class UpdateProduct3dModelDto {
  @ApiPropertyOptional({ description: 'Type of 3D model', example: 'glb' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  modelType!: string;

  @ApiPropertyOptional({ description: 'File extension', example: '.glb' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  fileType!: string;

  @ApiPropertyOptional({ description: 'URL to the 3D model file' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  fileUrl!: string;

  @ApiPropertyOptional({ description: 'Original filename' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fileName!: string;

  @ApiPropertyOptional({ description: 'File size in bytes' })
  @IsOptional()
  @IsNumber()
  fileSize!: number;

  @ApiPropertyOptional({
    description: 'Is this the primary 3D model for the product',
  })
  @IsOptional()
  @IsBoolean()
  isPrimary!: boolean;

  @ApiPropertyOptional({ description: 'Thumbnail URL for preview' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  thumbnailUrl!: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata!: Record<string, any>;
}

export class Product3dModelResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  productId!: number;

  @ApiProperty()
  modelType!: string;

  @ApiProperty()
  fileType!: string;

  @ApiProperty()
  fileUrl!: string;

  @ApiProperty()
  fileName!: string;

  @ApiPropertyOptional()
  fileSize!: number;

  @ApiProperty()
  isPrimary!: boolean;

  @ApiPropertyOptional()
  thumbnailUrl!: string;

  @ApiPropertyOptional()
  metadata!: Record<string, any>;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
