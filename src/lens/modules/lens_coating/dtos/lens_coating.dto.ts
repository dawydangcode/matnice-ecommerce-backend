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

export class LensCoatingDto {
  @ApiProperty({ example: 1, description: 'Lens coating ID' })
  @IsNumber()
  @Type(() => Number)
  id!: number;

  @ApiProperty({
    example: 'Anti-Reflective Coating',
    description: 'Coating name',
  })
  @IsString()
  name!: string;

  @ApiProperty({ example: 50000, description: 'Additional price for coating' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price!: number;

  @ApiPropertyOptional({
    example: 'Reduces glare and reflections',
    description: 'Coating description',
  })
  @IsString()
  @IsOptional()
  description?: string;

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

  @ApiPropertyOptional({
    example: 'anti-reflective',
    description: 'Search term',
  })
  @IsString()
  @IsOptional()
  search?: string;
}

// Filters for listing
export class LensCoatingFiltersDto extends PartialType(
  PickType(LensCoatingDto, ['page', 'limit', 'search']),
) {}

// Params for getting by ID
export class LensCoatingParamsDto extends PickType(LensCoatingDto, ['id']) {}

// Create DTO
export class CreateLensCoatingDto extends PickType(LensCoatingDto, [
  'name',
  'price',
  'description',
]) {}

// Update DTO
export class UpdateLensCoatingDto extends PartialType(CreateLensCoatingDto) {}
