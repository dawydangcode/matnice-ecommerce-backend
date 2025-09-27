import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserAddressService } from './user-address.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { UserAddressEntity } from './entities/user-address.entity';

@ApiTags('User Addresses')
@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo địa chỉ mới cho user' })
  @ApiQuery({ name: 'userId', type: 'number', description: 'ID của user' })
  @ApiResponse({
    status: 201,
    description: 'Địa chỉ đã được tạo thành công',
    type: UserAddressEntity,
  })
  async create(
    @Query('userId', ParseIntPipe) userId: number,
    @Body() createUserAddressDto: CreateUserAddressDto,
  ): Promise<UserAddressEntity> {
    return await this.userAddressService.create(userId, createUserAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả địa chỉ' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tất cả địa chỉ',
    type: [UserAddressEntity],
  })
  async findAll(): Promise<UserAddressEntity[]> {
    return await this.userAddressService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy tất cả địa chỉ của user' })
  @ApiParam({ name: 'userId', type: 'number', description: 'ID của user' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách địa chỉ của user',
    type: [UserAddressEntity],
  })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserAddressEntity[]> {
    return await this.userAddressService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin địa chỉ theo ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID của địa chỉ' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin địa chỉ',
    type: UserAddressEntity,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserAddressEntity> {
    return await this.userAddressService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật địa chỉ' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID của địa chỉ' })
  @ApiResponse({
    status: 200,
    description: 'Địa chỉ đã được cập nhật thành công',
    type: UserAddressEntity,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
  ): Promise<UserAddressEntity> {
    return await this.userAddressService.update(id, updateUserAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa địa chỉ' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID của địa chỉ' })
  @ApiResponse({
    status: 200,
    description: 'Địa chỉ đã được xóa thành công',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.userAddressService.remove(id);
    return { message: 'Địa chỉ đã được xóa thành công' };
  }

  @Patch(':id/set-default')
  @ApiOperation({ summary: 'Đặt địa chỉ làm mặc định' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID của địa chỉ' })
  @ApiResponse({
    status: 200,
    description: 'Địa chỉ đã được đặt làm mặc định',
    type: UserAddressEntity,
  })
  async setDefault(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserAddressEntity> {
    return await this.userAddressService.setDefault(id);
  }
}
