import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  ValidateNested,
  IsNumber,
  IsString,
  IsArray,
  IsDecimal,
} from 'class-validator';
import { CreateCartFrameDto } from '../cart_frame/dtos/cart_frame.dto';
import { CreateCartLensDetailDto } from '../cart_lens_detail/dtos/cart_lens_detail.dto';

// Define the nested DTOs first
export class LensProductFrameDto {
  @ApiProperty({ description: 'Product ID of the frame' })
  @IsNumber()
  productId!: number;

  @ApiProperty({ description: 'Frame price' })
  @IsNumber()
  framePrice!: number;

  @ApiProperty({ description: 'Quantity', default: 1 })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ description: 'Selected color ID', required: false })
  @IsOptional()
  @IsNumber()
  selectedColorId?: number;
}

export class PrescriptionValuesDto {
  @ApiProperty({ description: 'Right eye sphere' })
  @IsNumber()
  rightEyeSphere!: number;

  @ApiProperty({ description: 'Left eye sphere' })
  @IsNumber()
  leftEyeSphere!: number;

  @ApiProperty({ description: 'Right eye cylinder', required: false })
  @IsOptional()
  @IsNumber()
  rightEyeCylinder?: number;

  @ApiProperty({ description: 'Left eye cylinder', required: false })
  @IsOptional()
  @IsNumber()
  leftEyeCylinder?: number;

  @ApiProperty({ description: 'Right eye axis', required: false })
  @IsOptional()
  @IsNumber()
  rightEyeAxis?: number;

  @ApiProperty({ description: 'Left eye axis', required: false })
  @IsOptional()
  @IsNumber()
  leftEyeAxis?: number;

  @ApiProperty({ description: 'PD left', required: false })
  @IsOptional()
  @IsNumber()
  pdLeft?: number;

  @ApiProperty({ description: 'PD right', required: false })
  @IsOptional()
  @IsNumber()
  pdRight?: number;

  @ApiProperty({ description: 'ADD left', required: false })
  @IsOptional()
  @IsNumber()
  addLeft?: number;

  @ApiProperty({ description: 'ADD right', required: false })
  @IsOptional()
  @IsNumber()
  addRight?: number;
}

export class LensProductLensDto {
  @ApiProperty({ description: 'Lens variant ID' })
  @IsNumber()
  lensVariantId!: number;

  @ApiProperty({ description: 'Lens price from variant' })
  @IsNumber()
  lensPrice!: number;

  @ApiProperty({ description: 'Prescription values' })
  @ValidateNested()
  @Type(() => PrescriptionValuesDto)
  prescriptionValues!: PrescriptionValuesDto;

  @ApiProperty({ description: 'Selected coating IDs', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  selectedCoatingIds!: number[];

  @ApiProperty({ description: 'Selected tint color ID', required: false })
  @IsOptional()
  @IsNumber()
  selectedTintColorId?: number;

  @ApiProperty({ description: 'Prescription notes', required: false })
  @IsOptional()
  @IsString()
  prescriptionNotes?: string;

  @ApiProperty({ description: 'Lens notes', required: false })
  @IsOptional()
  @IsString()
  lensNotes?: string;
}

// New DTO for lens products from LensSelectionPage
export class AddLensProductToCartDto {
  @ApiProperty({
    description:
      'Cart ID where to add the item (optional, will create if not provided)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  cartId?: number;

  @ApiProperty({ description: 'Frame/product information' })
  @ValidateNested()
  @Type(() => LensProductFrameDto)
  frameData!: LensProductFrameDto;

  @ApiProperty({ description: 'Lens and prescription information' })
  @ValidateNested()
  @Type(() => LensProductLensDto)
  lensData!: LensProductLensDto;
}

// Existing DTO
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
  productImage?: string;
  frameColor?: string;
  selectedColor?: {
    id: number;
    colorName: string;
    colorCode: string;
    productVariantName?: string;
  } | null;
  quantity: number;
  framePrice: number;
  totalPrice: number;
  discount: number;
  lensDetail?: {
    id: number;
    lensId: number | undefined;
    lensType: string | undefined;
    lensPrice: number;
    totalUpgradesPrice: number;
    selectedCoatings?: {
      id: number;
      name: string;
      price: number;
      description?: string;
    }[];
    selectedTintColor?: {
      id: number;
      name: string;
      colorCode?: string;
      price?: number;
      description?: string;
    } | null;
    lensInfo?: {
      id: number;
      name: string;
      lensType: string;
      description?: string;
      origin?: string;
      image?: string;
    };
    lensVariantInfo?: {
      id: number;
      design: string;
      material: string;
      price: number;
      lensThickness?: any;
    };
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
      addLeft: number | undefined;
      addRight: number | undefined;
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
