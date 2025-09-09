import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsPositive, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId!: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  roleId!: number;

  @ApiProperty()
  @IsString()
  username!: string;

  @ApiProperty()
  @IsString()
  password!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
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

export class GetUsersQueryDto extends PartialType(
  PickType(UserDto, ['limit', 'page', 'q']),
) {}

export class GetUserParamsDto extends PickType(UserDto, ['userId']) {}

export class CreateAccountBodyDto extends PickType(UserDto, [
  'username',
  'password',
  'email',
  'roleId',
]) {}

export class UpdateUserParamsDto extends PickType(UserDto, ['userId']) {}

export class UpdateUserBodyDto extends PartialType(
  PickType(UserDto, ['roleId', 'email', 'username', 'password']),
) {}

export class DeleteUserParamsDto extends PickType(UserDto, ['userId']) {}
