import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { LensType } from '../enum/lens.type';

export class LensPrescriptionFilterQueryDto {
  @ApiPropertyOptional({
    description: 'Lens type filter',
    enum: LensType,
    example: LensType.SINGLE_VISION,
  })
  @IsOptional()
  @IsEnum(LensType)
  lensType?: LensType;
  @ApiPropertyOptional({
    description: 'Sphere value for left eye',
    example: 0.25,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-20)
  @Max(20)
  sphereLeft?: number;

  @ApiPropertyOptional({
    description: 'Sphere value for right eye',
    example: 0.25,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-20)
  @Max(20)
  sphereRight?: number;

  @ApiPropertyOptional({
    description: 'Cylinder value for left eye',
    example: -0.5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-6)
  @Max(0)
  cylinderLeft?: number;

  @ApiPropertyOptional({
    description: 'Cylinder value for right eye',
    example: -0.5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-6)
  @Max(0)
  cylinderRight?: number;

  @ApiPropertyOptional({
    description: 'ADD value for left eye',
    example: 1.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(4)
  addLeft?: number;

  @ApiPropertyOptional({
    description: 'ADD value for right eye',
    example: 1.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(4)
  addRight?: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 12,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 12;
}

export class LensPrescriptionFilterResponseDto {
  @ApiProperty({
    description: 'Array of filtered lens products',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        lensType: { type: 'string' },
        origin: { type: 'string' },
        status: { type: 'string' },
        basePrice: { type: 'number' },
        brandLens: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
        imageUrl: { type: 'string' },
        imageOrder: { type: 'string' },
        isThumbnail: { type: 'boolean' },
      },
    },
  })
  data!: any[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: 'object',
    properties: {
      total: { type: 'number' },
      page: { type: 'number' },
      limit: { type: 'number' },
      totalPages: { type: 'number' },
    },
  })
  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
