import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class LensVariantDto {
  @ApiProperty({ example: 1, description: 'Lens variant ID' })
  @IsNumber()
  @Type(() => Number)
  id!: number;

  @ApiProperty({ example: 1, description: 'Lens ID' })
  @IsNumber()
  @Type(() => Number)
  lensId!: number;

  @ApiProperty({ example: 1, description: 'Lens thickness ID' })
  @IsNumber()
  @Type(() => Number)
  lensThicknessId!: number;

  @ApiPropertyOptional({
    example: 'FSV',
    description: 'Design type (FSV, AR, AS)',
  })
  @IsString()
  @IsOptional()
  design?: string;

  @ApiPropertyOptional({ example: 'Plastic', description: 'Material type' })
  @IsString()
  @IsOptional()
  material?: string;

  @ApiProperty({ example: 150000, description: 'Price of the variant' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price!: number;

  @ApiProperty({ example: 100, description: 'Stock quantity' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  stock!: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ example: 'FSV', description: 'Search term' })
  @IsString()
  @IsOptional()
  search?: string;
}

// Filters for listing
export class LensVariantFiltersDto extends PartialType(
  PickType(LensVariantDto, [
    'page',
    'limit',
    'search',
    'lensId',
    'lensThicknessId',
  ]),
) {}

// Params for getting by ID
export class LensVariantParamsDto extends PickType(LensVariantDto, ['id']) {}

// Create DTO
export class CreateLensVariantDto extends PickType(LensVariantDto, [
  'lensId',
  'lensThicknessId',
  'design',
  'material',
  'price',
  'stock',
]) {}

// Update DTO
export class UpdateLensVariantDto extends PartialType(
  PickType(CreateLensVariantDto, ['design', 'material', 'price', 'stock']),
) {}
