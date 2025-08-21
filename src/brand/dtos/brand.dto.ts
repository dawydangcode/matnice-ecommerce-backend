import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class BrandDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  brandId!: number;

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

export class GetBrandsQueryDto extends PartialType(
  PickType(BrandDto, ['page', 'limit', 'q']),
) {}

export class GetBrandByIdParamsDto extends PickType(BrandDto, ['brandId']) {}

export class CreateBrandBodyDto extends PickType(BrandDto, [
  'name',
  'description',
]) {}

export class UpdateBrandParamsDto extends PickType(BrandDto, ['brandId']) {}

export class UpdateBrandBodyDto extends PartialType(
  PickType(BrandDto, ['name', 'description']),
) {}

export class DeleteBrandParamsDto extends PickType(BrandDto, ['brandId']) {}
