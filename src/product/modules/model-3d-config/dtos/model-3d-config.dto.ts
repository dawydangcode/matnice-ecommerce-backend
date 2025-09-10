import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min, Max } from 'class-validator';

export class Model3dConfigDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  model3dConfigId!: number;

  @ApiProperty()
  @IsNumber()
  modelId!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  offsetX!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  offsetY!: number;

  @ApiProperty()
  @IsNumber()
  positionOffsetX!: number;

  @ApiProperty()
  @IsNumber()
  positionOffsetY!: number;

  @ApiProperty()
  @IsNumber()
  positionOffsetZ!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  @Max(10)
  initialScale!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.1)
  @Max(10)
  rotationSensitivity!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.1)
  @Max(2)
  yawLimit!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.1)
  @Max(2)
  pitchLimit!: number;
}

export class GetModel3dConfigParamsDto extends PickType(Model3dConfigDto, [
  'model3dConfigId',
]) {}

export class GetModel3dConfigByIdParamsDto extends PickType(Model3dConfigDto, [
  'model3dConfigId',
]) {}

export class CreateModel3dConfigBodyDto extends PickType(Model3dConfigDto, [
  'modelId',
  'offsetX',
  'offsetY',
  'positionOffsetX',
  'positionOffsetY',
  'positionOffsetZ',
  'initialScale',
  'rotationSensitivity',
  'yawLimit',
  'pitchLimit',
]) {}

export class UpdateModel3dConfigParamsDto extends PickType(Model3dConfigDto, [
  'model3dConfigId',
]) {}

export class UpdateModel3dConfigBodyDto extends PartialType(
  PickType(Model3dConfigDto, [
    'modelId',
    'offsetX',
    'offsetY',
    'positionOffsetX',
    'positionOffsetY',
    'positionOffsetZ',
    'initialScale',
    'rotationSensitivity',
    'yawLimit',
    'pitchLimit',
  ]),
) {}

export class DeleteModel3dConfigParamsDto extends PickType(Model3dConfigDto, [
  'model3dConfigId',
]) {}
