import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserAddressDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userAddressId!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  province!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  district!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ward!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressDetail!: string;

  @ApiPropertyOptional()
  @IsBoolean()
  isDefault!: boolean;

  @ApiPropertyOptional()
  @IsString()
  notes!: string;
}
export class GetUserAddressByIdParamsDto extends PickType(UserAddressDto, [
  'userAddressId',
]) {}

export class CreateUserAddressBodyDto extends PickType(UserAddressDto, [
  'province',
  'district',
  'ward',
  'addressDetail',
  'isDefault',
  'notes',
]) {}

export class UpdateUserAddressParamsDto extends PickType(UserAddressDto, [
  'userAddressId',
]) {}

export class UpdateUserAddressBodyDto extends PartialType(
  PickType(UserAddressDto, [
    'province',
    'district',
    'ward',
    'addressDetail',
    'isDefault',
    'notes',
  ]),
) {}

export class DeleteUserAddressParamsDto extends PickType(UserAddressDto, [
  'userAddressId',
]) {}
