import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsEnum, IsOptional } from 'class-validator';
import { SkinColorType } from '../enum/skin-color.type';

export class ColorSkinRecommendationDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  id!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productColorId!: number;

  @ApiProperty({ enum: SkinColorType })
  @IsEnum(SkinColorType)
  skinColorType!: SkinColorType;

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
}

export class GetColorSkinRecommendationsQueryDto extends PartialType(
  PickType(ColorSkinRecommendationDto, ['page', 'limit']),
) {
  @ApiProperty({ enum: SkinColorType, required: false })
  @IsOptional()
  @IsEnum(SkinColorType)
  skinColorType?: SkinColorType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  productColorId?: number;
}

export class GetColorSkinRecommendationByIdParamsDto extends PickType(
  ColorSkinRecommendationDto,
  ['id'],
) {}

export class CreateColorSkinRecommendationBodyDto extends PickType(
  ColorSkinRecommendationDto,
  ['productColorId', 'skinColorType'],
) {}

export class UpdateColorSkinRecommendationParamsDto extends PickType(
  ColorSkinRecommendationDto,
  ['id'],
) {}

export class UpdateColorSkinRecommendationBodyDto extends PartialType(
  PickType(ColorSkinRecommendationDto, ['productColorId', 'skinColorType']),
) {}

export class DeleteColorSkinRecommendationParamsDto extends PickType(
  ColorSkinRecommendationDto,
  ['id'],
) {}

export class GetRecommendationsByProductColorParamsDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productColorId!: number;
}

export class GetRecommendationsBySkinColorParamsDto {
  @ApiProperty({ enum: SkinColorType })
  @IsEnum(SkinColorType)
  skinColorType!: SkinColorType;
}
