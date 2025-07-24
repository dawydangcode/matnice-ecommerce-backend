import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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
}
