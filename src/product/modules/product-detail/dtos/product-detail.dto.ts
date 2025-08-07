import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

export class CreateProductDetailDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  bridgeWidth!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  frameWidth!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lensHeight!: number;

  @ApiProperty()
  @IsNumber()
  lensWidth!: number;

  @ApiProperty()
  @IsNumber()
  templeLength!: number;

  @ApiProperty()
  @IsNumber()
  productNumber!: number;

  @ApiProperty()
  @IsString()
  frameMaterial!: ;

  @ApiProperty()
  @IsString()
  frameShape!: string;

  @ApiProperty()
  @IsString()
  frameType!: string;

  @ApiProperty()
  @IsString()
  bridgeDesign!: string;

  @ApiProperty()
  @IsString()
  style!: string;

  @ApiProperty()
  @IsBoolean()
  springHinges!: boolean;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  weight!: number;

  @ApiProperty()
  @IsBoolean()
  multifocal!: boolean;
}

export class UpdateProductDetailDto extends CreateProductDetailDto {}
