import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CategoryLensDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  categoryLensId!: number;

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

export class GetCategoriesLensQueryDto extends PartialType(
  PickType(CategoryLensDto, ['page', 'limit', 'q']),
) {}

export class GetCategoryLensByIdParamsDto extends PickType(CategoryLensDto, [
  'categoryLensId',
]) {}

export class CreateCategoryLensBodyDto extends PickType(CategoryLensDto, [
  'name',
  'description',
]) {}

export class UpdateCategoryLensParamsDto extends PickType(CategoryLensDto, [
  'categoryLensId',
]) {}

export class UpdateCategoryLensBodyDto extends PartialType(
  PickType(CategoryLensDto, ['name', 'description']),
) {}

export class DeleteCategoryLensParamsDto extends PickType(CategoryLensDto, [
  'categoryLensId',
]) {}
