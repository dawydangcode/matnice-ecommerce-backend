import { ApiProperty } from '@nestjs/swagger';
import {
  FrameBridgeDesignType,
  FrameMaterialType,
  FrameShapeType,
  FrameStyleType,
  FrameType,
} from '../modules/product-detail/enum/frame.type';
import { ProductType } from '../enum/product.type';

export class ProductFilterDto {
  @ApiProperty({ type: [String], required: false })
  gender?: string[];
  @ApiProperty()
  brandIds?: number[];

  @ApiProperty()
  categoryIds?: number[];

  @ApiProperty()
  productType?: ProductType[];

  @ApiProperty()
  frameShapeTypes?: FrameShapeType[];

  @ApiProperty()
  frameTypes?: FrameType[];

  @ApiProperty()
  bridgeDesignTypes?: FrameBridgeDesignType[];

  @ApiProperty()
  materialTypes?: FrameMaterialType[];

  @ApiProperty()
  styleTypes?: FrameStyleType[];

  @ApiProperty()
  priceMin?: number;

  @ApiProperty()
  priceMax?: number;
}
