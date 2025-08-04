import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateLensUpgradeDetailDto {
  @ApiProperty()
  @IsString()
  name!: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description!: string;
}

export class UpdateLensUpgradeDetailDto extends CreateLensUpgradeDetailDto {}

export class GetLensUpgradeDetailParamsDto {
  @ApiProperty()
  @IsNumber()
  lensUpgradeDetailId!: number;
}
