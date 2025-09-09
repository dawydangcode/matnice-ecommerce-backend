import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CreateCartFrameDto } from '../cart_frame/dtos/cart_frame.dto';
import { CreateCartLensDetailDto } from '../cart_lens_detail/dtos/cart_lens_detail.dto';

export class CreateCartItemCompleteDto {
  @ApiProperty({ type: CreateCartFrameDto })
  @ValidateNested()
  @Type(() => CreateCartFrameDto)
  frame!: CreateCartFrameDto;

  @ApiProperty({ type: CreateCartLensDetailDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCartLensDetailDto)
  lensDetail?: Omit<CreateCartLensDetailDto, 'cartFrameId'>;
}

export interface CartItemSummary {
  cartFrameId: number;
  productId: number;
  productName?: string;
  frameColor?: string;
  quantity: number;
  framePrice: number;
  totalPrice: number;
  discount: number;
  lensDetail?: {
    id: number;
    lensId: number | undefined;
    lensType: string | undefined;
    lensQuality: string;
    lensPrice: number;
    totalUpgradesPrice: number;
    prescription: {
      rightEye: {
        sphere: number | undefined;
        cylinder: number | undefined;
        axis: number | undefined;
      };
      leftEye: {
        sphere: number | undefined;
        cylinder: number | undefined;
        axis: number | undefined;
      };
      pdLeft: number | undefined;
      pdRight: number | undefined;
    };
    upgrades: {
      hardCoating: boolean;
      antiReflection: boolean;
      uvProtection: boolean;
      blueLight: boolean;
      lotusEffect: boolean;
      smartFocus: boolean;
      transition: boolean;
      progressive: boolean;
    };
  };
}

export interface CartSummary {
  cartId: number;
  items: CartItemSummary[];
  totalItems: number;
  totalFramePrice: number;
  totalLensPrice: number;
  totalDiscount: number;
  grandTotal: number;
}
