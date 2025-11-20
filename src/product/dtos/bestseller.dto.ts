import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// Get Bestsellers Query DTO
export class GetBestsellersQueryDto {
  @ApiPropertyOptional({
    description: 'Limit number of bestsellers',
    default: 8,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 8;

  @ApiPropertyOptional({
    description: 'Include only pinned bestsellers',
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  pinnedOnly?: boolean = false;
}

// Create Bestseller DTO (Admin)
export class CreateBestsellerDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  productId!: number;

  @ApiPropertyOptional({
    description: 'Pin as manual bestseller',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean = false;

  @ApiPropertyOptional({ description: 'Custom priority (1 = highest)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  customPriority?: number;

  @ApiPropertyOptional({ description: 'Display order' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Admin notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

// Update Bestseller DTO (Admin)
export class UpdateBestsellerDto {
  @ApiPropertyOptional({ description: 'Pin as manual bestseller' })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiPropertyOptional({ description: 'Custom priority (1 = highest)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  customPriority?: number;

  @ApiPropertyOptional({ description: 'Display order' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Admin notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

// Bestseller Params
export class BestsellerParamsDto {
  @ApiProperty({ description: 'Bestseller ID' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  id!: number;
}

// Sync Sales Data DTO (Cron job or manual trigger)
export class SyncSalesDataDto {
  @ApiPropertyOptional({
    description: 'Number of days to look back for sales data',
    default: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  days?: number = 30;
}
