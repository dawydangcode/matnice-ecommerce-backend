import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsArray } from 'class-validator';

export class ProductThicknessCompatibilityDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  id!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensThicknessId!: number;
}

export class CreateProductThicknessCompatibilityDto extends PickType(
  ProductThicknessCompatibilityDto,
  ['productId', 'lensThicknessId'],
) {}

export class UpdateProductCompatibilityDto {
  @ApiProperty({
    type: [Number],
    description: 'Array of lens thickness IDs compatible with this product',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  lensThicknessIds!: number[];
}

export class ProductThicknessCompatibilityQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  productId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lensThicknessId?: number;
}
