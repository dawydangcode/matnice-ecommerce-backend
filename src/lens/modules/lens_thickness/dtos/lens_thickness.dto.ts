import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class LensThicknessDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensThicknessId!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  indexValue!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  price!: number;

  @ApiProperty()
  @IsString()
  description!: string;
}
export class GetLensThicknessByIdParamsDto extends PickType(LensThicknessDto, [
  'lensThicknessId',
]) {}

export class CreateLensThicknessBodyDto extends PickType(LensThicknessDto, [
  'name',
  'indexValue',
  'price',
  'description',
]) {}

export class UpdateLensThicknessParamsDto extends PickType(LensThicknessDto, [
  'lensThicknessId',
]) {}

export class UpdateLensThicknessBodyDto extends PartialType(
  PickType(LensThicknessDto, ['name', 'indexValue', 'price', 'description']),
) {}

export class DeleteLensThicknessParamsDto extends PickType(LensThicknessDto, [
  'lensThicknessId',
]) {}
