import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  categoryId!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  reqUserId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  page!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  limit!: number;

  @ApiProperty()
  @IsString()
  q!: string;
}

export class GetCategoriesQueryDto extends PickType(CategoryDto, [
  'page',
  'limit',
  'q',
]) {}

export class GetCategoryByIdParamsDto extends PickType(CategoryDto, [
  'categoryId',
]) {}

export class CategoryCreateBodyDto extends PickType(CategoryDto, [
  'name',
  'description',
]) {}

export class CategoryUpdateParamsDto extends PickType(CategoryDto, [
  'categoryId',
]) {}

export class CategoryUpdateBodyDto extends PartialType(
  PickType(CategoryDto, ['name', 'description']),
) {}

export class CategoryDeleteParamsDto extends PickType(CategoryDto, [
  'categoryId',
]) {}
