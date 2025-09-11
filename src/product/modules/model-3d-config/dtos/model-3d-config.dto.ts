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
  @Type(() => Number)
  modelId!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  offsetX!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  offsetY!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  positionOffsetX!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  positionOffsetY!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  positionOffsetZ!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  @Max(10)
  @Type(() => Number)
  initialScale!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.1)
  @Max(10)
  @Type(() => Number)
  rotationSensitivity!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.1)
  @Max(2)
  @Type(() => Number)
  yawLimit!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.1)
  @Max(2)
  @Type(() => Number)
  pitchLimit!: number;
}

export class GetModel3dConfigParamsDto extends PickType(Model3dConfigDto, [
  'model3dConfigId',
]) {}

export class GetModel3dConfigByIdParamsDto extends PickType(Model3dConfigDto, [
  'model3dConfigId',
]) {}

export class GetModel3dConfigByModelIdParamsDto extends PickType(
  Model3dConfigDto,
  ['modelId'],
) {}

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
