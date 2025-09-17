import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class BrandLensDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  brandLensId!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

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

export class GetBrandsLensQueryDto extends PartialType(
  PickType(BrandLensDto, ['page', 'limit', 'q']),
) {}

export class GetBrandLensByIdParamsDto extends PickType(BrandLensDto, [
  'brandLensId',
]) {}

export class CreateBrandLensBodyDto extends PickType(BrandLensDto, [
  'name',
  'description',
]) {}

export class UpdateBrandLensParamsDto extends PickType(BrandLensDto, [
  'brandLensId',
]) {}

export class UpdateBrandBodyDto extends PartialType(
  PickType(BrandLensDto, ['name', 'description']),
) {}

export class DeleteBrandParamsDto extends PickType(BrandLensDto, [
  'brandLensId',
]) {}
