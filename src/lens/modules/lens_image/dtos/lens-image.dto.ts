import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsBoolean,
  IsIn,
  IsPositive,
} from 'class-validator';

export class LensImageDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensImageId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensId!: number;

  @ApiProperty()
  @IsString()
  @IsUrl()
  imageUrl!: string;

  @ApiProperty({
    required: false,
    description: 'Image order (a=primary, b, c, d, e)',
  })
  @IsOptional()
  @IsString()
  @IsIn(['a', 'b', 'c', 'd', 'e'])
  imageOrder?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isThumbnail?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;
}

export class CreateLensImageDto extends PickType(LensImageDto, [
  'lensId',
  'imageUrl',
  'imageOrder',
  'isThumbnail',
]) {}

export class UpdateLensImageDto extends PartialType(
  PickType(LensImageDto, ['imageUrl', 'imageOrder', 'isThumbnail']),
) {}

export class LensImageListDto extends PickType(LensImageDto, [
  'page',
  'limit',
  'search',
  'lensId',
]) {}

export class LensImageResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  lensId!: number;

  @ApiProperty()
  imageUrl!: string;

  @ApiProperty({ required: false })
  imageOrder?: string;

  @ApiProperty({ required: false })
  isThumbnail?: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
