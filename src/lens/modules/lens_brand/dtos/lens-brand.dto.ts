import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

export class LensBrandDto {
  @ApiProperty()
  lensBrandId!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  q!: string;
}

export class GetLensBrandsQueryDto extends PartialType(
  PickType(LensBrandDto, ['page', 'limit', 'q']),
) {}

export class GetLensBrandByIdParamsDto extends PickType(LensBrandDto, [
  'lensBrandId',
]) {}

export class CreateLensBrandBodyDto extends PickType(LensBrandDto, [
  'name',
  'description',
]) {}

export class UpdateLensBrandParamsDto extends PickType(LensBrandDto, [
  'lensBrandId',
]) {}

export class UpdateLensBrandBodyDto extends PartialType(
  PickType(CreateLensBrandBodyDto, ['name', 'description']),
) {}

export class DeleteLensBrandParamsDto extends PickType(LensBrandDto, [
  'lensBrandId',
]) {}
