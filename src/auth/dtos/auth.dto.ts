import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsString()
  username!: string;

  @ApiProperty()
  @IsString()
  password!: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsOptional()
  email!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  roleId!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  userId!: number;

  @ApiProperty()
  @IsNumber()
  sessionId!: number;

  @ApiProperty()
  @IsString()
  accessToken!: string;

  @ApiProperty()
  @IsString()
  refreshToken!: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNumber()
  reqAccountId?: number;

  @ApiProperty()
  @IsString()
  payload!: string;

  @ApiProperty()
  @IsString()
  otpCode!: string;

  @ApiProperty()
  @IsString()
  newPassword!: string;

  @ApiProperty()
  @IsString()
  oldPassword!: string;

  @ApiProperty()
  @IsString()
  token!: string;
}

export class AuthSignUpBodyDto extends PickType(AuthDto, [
  'username',
  'password',
  'email',
]) {}

export class AuthSignInBodyDto extends PickType(AuthDto, [
  'username',
  'password',
]) {}

export class ValidateBodyDto extends PickType(AuthDto, [
  'userId',
  'sessionId',
  'roleId',
]) {}

export class RequestResetPasswordBodyDto extends PickType(AuthDto, ['email']) {}

export class ChangePasswordBodyDto extends PickType(AuthDto, [
  'oldPassword',
  'newPassword',
]) {}

export class ResetPasswordBodyDto extends PickType(AuthDto, [
  'token',
  'newPassword',
]) {}
