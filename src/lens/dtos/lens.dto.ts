import { IsString, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

export class LensDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensId!: number;

  @ApiProperty()
  @IsString()
  name!: string;

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

export class CreateLensBodyDto extends PickType(LensDto, ['name']) {}

export class UpdateLensParamsDto extends PickType(LensDto, ['lensId']) {}

export class UpdateLensBodyDto extends PartialType(
  PickType(LensDto, ['name']),
) {}

export class DeleteLensParamsDto extends PickType(LensDto, ['lensId']) {}
