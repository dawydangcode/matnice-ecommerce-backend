import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserAddressDto {
  @ApiProperty({
    description: 'Tỉnh/Thành phố',
    example: 'Thành phố Hồ Chí Minh',
  })
  @IsString()
  @IsNotEmpty()
  province!: string;

  @ApiProperty({
    description: 'Quận/Huyện',
    example: 'Quận 1',
  })
  @IsString()
  @IsNotEmpty()
  district!: string;

  @ApiProperty({
    description: 'Phường/Xã',
    example: 'Phường Bến Nghé',
  })
  @IsString()
  @IsNotEmpty()
  ward!: string;

  @ApiProperty({
    description: 'Địa chỉ cụ thể',
    example: '123 Nguyễn Huệ',
  })
  @IsString()
  @IsNotEmpty()
  addressDetail!: string;

  @ApiPropertyOptional({
    description: 'Địa chỉ mặc định',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Ghi chú địa chỉ',
    example: 'Gần bến xe miền Tây',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
