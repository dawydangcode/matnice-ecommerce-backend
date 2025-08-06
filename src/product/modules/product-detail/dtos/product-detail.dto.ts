import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

export class CreateProductDetailDto {
  @IsOptional()
  @IsNumber()
  bridgeWidth?: number;

  @IsOptional()
  @IsNumber()
  frameWidth?: number;

  @IsOptional()
  @IsNumber()
  lensHeight?: number;

  @IsOptional()
  @IsNumber()
  lensWidth?: number;

  @IsOptional()
  @IsNumber()
  templeLength?: number;

  @IsOptional()
  @IsNumber()
  productNumber?: number;

  @IsOptional()
  @IsString()
  frameMaterial?: string;

  @IsOptional()
  @IsString()
  frameShape?: string;

  @IsOptional()
  @IsString()
  frameType?: string;

  @IsOptional()
  @IsString()
  bridgeDesign?: string;

  @IsOptional()
  @IsString()
  style?: string;

  @IsOptional()
  @IsBoolean()
  springHinges?: boolean;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsBoolean()
  multifocal?: boolean;
}

export class UpdateProductDetailDto extends CreateProductDetailDto {}
