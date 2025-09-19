import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class GetLensFullDetailsQueryDto {
  @ApiProperty({
    description: 'Include related data (variants, coatings, images, etc.)',
    required: false,
    type: [String],
    example: ['variants', 'coatings', 'images', 'categories'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  include?: string[];
}

export class LensFullDetailsResponseDto {
  @ApiProperty({ description: 'Lens basic information' })
  lens!: {
    id: number;
    name: string;
    origin: string;
    lensType: string;
    status: string;
    description: string;
    createdAt: Date;
    brandLens: {
      id: number;
      name: string;
      description: string;
    };
  };

  @ApiProperty({ description: 'Lens categories', required: false })
  categories?: Array<{
    id: number;
    name: string;
    description: string;
  }>;

  @ApiProperty({
    description: 'Lens variants with all details',
    required: false,
  })
  variants?: Array<{
    id: number;
    lensThicknessId: number;
    design: string;
    material: string;
    price: number;
    stock: number;
    lensThickness: {
      id: number;
      name: string;
      indexValue: number;
      price: number;
      description: string;
    };
    refractionRanges: Array<{
      id: number;
      refractionType: string;
      minValue: number;
      maximumValue: number;
      stepValue: number;
    }>;
    tintColors: Array<{
      id: number;
      name: string;
      imageUrl: string;
      colorCode: string;
    }>;
  }>;

  @ApiProperty({ description: 'Lens coatings', required: false })
  coatings?: Array<{
    id: number;
    name: string;
    price: number;
    description: string;
  }>;

  @ApiProperty({ description: 'Lens images', required: false })
  images?: Array<{
    id: number;
    imageUrl: string;
    imageOrder: string;
    isThumbnail: boolean;
  }>;

  @ApiProperty({ description: 'Summary statistics', required: false })
  summary?: {
    totalVariants: number;
    totalCoatings: number;
    totalImages: number;
    priceRange: {
      min: number;
      max: number;
    };
    availableStock: number;
  };
}
