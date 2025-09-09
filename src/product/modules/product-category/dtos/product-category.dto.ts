import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreateProductCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  productId!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  categoryId!: number;
}

export class UpdateProductCategoriesDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds!: number[];
}

export class ProductCategoryQueryDto {
  @ApiProperty({ required: false })
  @IsNumber()
  productId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  categoryId?: number;
}
