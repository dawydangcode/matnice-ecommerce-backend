import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SessionDto {
  @ApiProperty()
  @Type(() => Number)
  userId!: number;

  @ApiProperty()
  @Type(() => Number)
  sessionId!: number;

  @ApiProperty()
  @IsString()
  accessToken!: string;

  @ApiProperty()
  @IsString()
  refreshToken!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  userAgent!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ipAddress!: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive!: boolean;
}
