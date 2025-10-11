import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { WishlistItemType } from '../enum/wishlist-item-type.enum';

export class WishlistItemDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  id!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId!: number;

  @ApiProperty({ enum: WishlistItemType })
  @IsEnum(WishlistItemType)
  itemType!: WishlistItemType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  productId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lensId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  selectedColorId?: number;

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
}

export class GetWishlistQueryDto extends PartialType(
  PickType(WishlistItemDto, ['page', 'limit', 'itemType']),
) {}

export class AddToWishlistBodyDto extends PickType(WishlistItemDto, [
  'itemType',
  'productId',
  'lensId',
  'selectedColorId',
]) {}

export class RemoveFromWishlistParamsDto extends PickType(WishlistItemDto, [
  'id',
]) {}

export class CheckWishlistParamsDto {
  @ApiProperty({ enum: WishlistItemType })
  @IsEnum(WishlistItemType)
  itemType!: WishlistItemType;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  itemId!: number;
}
