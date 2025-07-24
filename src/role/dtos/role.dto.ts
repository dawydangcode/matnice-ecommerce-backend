import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RoleDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  roleId!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class CreateRoleBodyDto extends PickType(RoleDto, ['name']) {}

export class UpdateRoleBodyDto extends PartialType(
  PickType(RoleDto, ['roleId', 'name']),
) {}

export class GetRoleParamsDto extends PickType(RoleDto, ['roleId']) {}

export class UpdateRoleParamsDto extends PickType(RoleDto, [
  'roleId',
  'name',
]) {}
