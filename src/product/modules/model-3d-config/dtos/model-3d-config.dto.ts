import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateModel3dConfigDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  modelId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  offsetX?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  offsetY?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  positionOffsetX?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  positionOffsetY?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  positionOffsetZ?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(10)
  initialScale?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(10)
  rotationSensitivity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(2)
  yawLimit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(2)
  pitchLimit?: number;
}

export class UpdateModel3dConfigDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  offsetX?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  offsetY?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  positionOffsetX?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  positionOffsetY?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  positionOffsetZ?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(10)
  initialScale?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(10)
  rotationSensitivity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(2)
  yawLimit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(2)
  pitchLimit?: number;
}

export class Model3dConfigQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  modelId?: number;
}
