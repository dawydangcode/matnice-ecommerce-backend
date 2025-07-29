import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsBoolean,
  IsString,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { CreateCartFrameDto } from '../../cart_frame/dtos/cart_frame.dto';

export class CreateCartLensDetailDto {
  @ApiProperty()
  @IsNumber()
  cartFrameId!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lensId!: number;

  // Prescription fields
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  rightEyeSphere!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  rightEyeCylinder!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  rightEyeAxis!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  leftEyeSphere!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  leftEyeCylinder!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  leftEyeAxis!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(25)
  @Max(40)
  pdLeft!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(25)
  @Max(40)
  pdRight!: number;

  // Lens configuration
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lensType!: string;

  @ApiProperty({ required: false, default: 'Standard' })
  @IsOptional()
  @IsString()
  @IsIn(['Standard', 'Premium', 'Ultra'])
  lensQuality!: string;

  @ApiProperty({ required: false, default: 1.5 })
  @IsOptional()
  @IsNumber()
  @IsIn([1.5, 1.56, 1.6, 1.67, 1.74])
  refractionIndex!: number;

  // Upgrade booleans
  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  upgradeHardCoating!: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  upgradeAntiReflection!: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  upgradeUvProtection!: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  upgradeBlueLight!: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  upgradeLotusEffect!: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  upgradeSmartFocus!: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  upgradeTransition!: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  upgradeProgressive!: boolean;

  // Upgrade prices
  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  upgradeHardCoatingPrice!: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  upgradeAntiReflectionPrice!: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  upgradeUvProtectionPrice!: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  upgradeBluelightPrice!: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  upgradeLotusEffectPrice!: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  upgradeSmartFocusPrice!: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  upgradeTransitionPrice!: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  upgradeProgressivePrice!: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  totalUpgradesPrice!: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  lensPrice!: number;

  // Additional options
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lensMaterial!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lensThickness!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tintColor!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tintDensity!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  prescriptionNotes!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lensNotes!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  manufacturingNotes!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fieldOfVision!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  addLeft!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  addRight!: number;
}

export class UpdateCartLensDetailDto extends PickType(CreateCartLensDetailDto, [
  'lensId',
  'rightEyeSphere',
  'rightEyeCylinder',
  'rightEyeAxis',
  'leftEyeSphere',
  'leftEyeCylinder',
  'leftEyeAxis',
  'pdLeft',
  'pdRight',
  'lensType',
  'lensQuality',
  'refractionIndex',
  'upgradeHardCoating',
  'upgradeAntiReflection',
  'upgradeUvProtection',
  'upgradeBlueLight',
  'upgradeLotusEffect',
  'upgradeSmartFocus',
  'upgradeTransition',
  'upgradeProgressive',
  'upgradeHardCoatingPrice',
  'upgradeAntiReflectionPrice',
  'upgradeUvProtectionPrice',
  'upgradeBluelightPrice',
  'upgradeLotusEffectPrice',
  'upgradeSmartFocusPrice',
  'upgradeTransitionPrice',
  'upgradeProgressivePrice',
  'totalUpgradesPrice',
  'lensPrice',
  'lensMaterial',
  'lensThickness',
  'tintColor',
  'tintDensity',
  'prescriptionNotes',
  'lensNotes',
  'manufacturingNotes',
  'fieldOfVision',
  'addLeft',
  'addRight',
]) {}

export class GetCartLensDetailParamsDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  cartLensDetailId!: number;
}

export class CartLensDetailQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cartFrameId!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lensId!: number;
}

// Combined DTO for creating frame + lens in one request
export class CreateCartItemWithLensDto {
  @ApiProperty({ type: CreateCartFrameDto })
  frame!: CreateCartFrameDto;

  @ApiProperty({ type: CreateCartLensDetailDto, required: false })
  @IsOptional()
  lensDetail!: Omit<CreateCartLensDetailDto, 'cartFrameId'>;
}
