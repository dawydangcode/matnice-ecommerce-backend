import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UserPrescriptionDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  prescriptionId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(-20)
  @Max(20)
  rightEyeSph!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(-6)
  @Max(6)
  rightEyeCyl!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(180)
  rightEyeAxis!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  @Max(3.5)
  rightEyeAdd!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(-20)
  @Max(20)
  leftEyeSph!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(-6)
  @Max(6)
  leftEyeCyl!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(180)
  leftEyeAxis!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  @Max(3.5)
  leftEyeAdd!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(20)
  @Max(40)
  pdRight!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(20)
  @Max(40)
  pdLeft!: number;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isDefault!: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  notes!: string;

  @ApiProperty()
  @Type(() => Date)
  @IsOptional()
  createdAt!: Date;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  page!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  limit!: number;
}

export class GetUserPrescriptionsQueryDto extends PartialType(
  PickType(UserPrescriptionDto, ['userId', 'limit', 'page']),
) {}

export class GetUserPrescriptionParamsDto extends PickType(
  UserPrescriptionDto,
  ['prescriptionId'],
) {}

export class CreateUserPrescriptionBodyDto extends PickType(
  UserPrescriptionDto,
  [
    'rightEyeSph',
    'rightEyeCyl',
    'rightEyeAxis',
    'rightEyeAdd',
    'leftEyeSph',
    'leftEyeCyl',
    'leftEyeAxis',
    'leftEyeAdd',
    'pdRight',
    'pdLeft',
    'isDefault',
    'notes',
  ],
) {}

export class UpdateUserPrescriptionParamsDto extends PickType(
  UserPrescriptionDto,
  ['prescriptionId'],
) {}

export class UpdateUserPrescriptionBodyDto extends PartialType(
  PickType(UserPrescriptionDto, [
    'rightEyeSph',
    'rightEyeCyl',
    'rightEyeAxis',
    'rightEyeAdd',
    'leftEyeSph',
    'leftEyeCyl',
    'leftEyeAxis',
    'leftEyeAdd',
    'pdRight',
    'pdLeft',
    'isDefault',
    'notes',
  ]),
) {}

export class DeleteUserPrescriptionParamsDto extends PickType(
  UserPrescriptionDto,
  ['prescriptionId'],
) {}
