import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLensUpgradeDto {
  @IsString()
  @IsNotEmpty()
  upgradeName!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price!: number;
}

export class UpdateLensUpgradeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  upgradeName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price?: number;
}
