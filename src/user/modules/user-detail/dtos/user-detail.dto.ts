import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { GenderType } from '../enums/gender.type';

export class UserDetailDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userDetailId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dob!: Date;

  @ApiProperty()
  @IsEnum(GenderType)
  gender!: GenderType;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  page!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  limit!: number;

  @ApiProperty()
  @IsString()
  q!: string;
}

export class CreateUserDetailBodyDto extends PartialType(
  PickType(UserDetailDto, ['userId', 'name', 'dob', 'gender']),
) {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId!: number; // userId is required for create
}

export class GetUserDetailParamsDto extends PickType(UserDetailDto, [
  'userDetailId',
]) {}

export class UpdateUserDetailBodyDto extends PartialType(
  PickType(UserDetailDto, ['userId', 'name', 'dob', 'gender']),
) {}

export class UpdateUserDetailParamsDto extends PickType(UserDetailDto, [
  'userDetailId',
]) {}

export class GetUserDetailByUserIdParamsDto extends PickType(UserDetailDto, [
  'userId',
]) {}

export class GetUserDetailsQueryDto extends PartialType(
  PickType(UserDetailDto, ['page', 'limit', 'q']),
) {}

export class DeleteUserDetailParamsDto extends PickType(UserDetailDto, [
  'userDetailId',
]) {}
