import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

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
