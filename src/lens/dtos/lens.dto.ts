import { IsString, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { LensType } from '../enum/lens.type';
import { LensStatusType } from '../enum/lens-status.type';

export class LensDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensId!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  origin!: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  brandId!: number;

  @ApiProperty()
  @IsString()
  lensType!: LensType;

  @ApiProperty()
  @IsString()
  status!: LensStatusType;

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
export class GetLensesQueryDto extends PartialType(
  PickType(LensDto, ['page', 'limit', 'q']),
) {}

export class GetLensByIdParamsDto extends PickType(LensDto, ['lensId']) {}

export class CreateLensBodyDto extends PickType(LensDto, [
  'name',
  'origin',
  'brandId',
  'lensType',
  'status',
  'description',
]) {}

export class UpdateLensParamsDto extends PickType(LensDto, ['lensId']) {}

export class UpdateLensBodyDto extends PartialType(
  PickType(LensDto, [
    'name',
    'origin',
    'brandId',
    'lensType',
    'status',
    'description',
  ]),
) {}

export class DeleteLensParamsDto extends PickType(LensDto, ['lensId']) {}
