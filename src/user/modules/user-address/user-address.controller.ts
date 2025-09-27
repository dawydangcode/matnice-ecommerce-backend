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
  Req,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserAddressService } from './user-address.service';
import { UserAddressEntity } from './entities/user-address.entity';
import {
  CreateUserAddressBodyDto,
  GetUserAddressByIdParamsDto,
  UpdateUserAddressBodyDto,
  UpdateUserAddressParamsDto,
} from './dto/user-address.dto';
import { RequestModel } from 'src/common/models/request.model';

@ApiTags('User Addresses')
@Controller('api/v1')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post('/user-address/create')
  async createUserAddress(
    @Query('userId', ParseIntPipe) userId: number,
    @Body() body: CreateUserAddressBodyDto,
  ) {
    return await this.userAddressService.createUserAddress(
      userId,
      body.province,
      body.district,
      body.ward,
      body.addressDetail,
      body.isDefault,
    );
  }

  @Get('user-address/list')
  async getUserAddresses() {
    return await this.userAddressService.getUserAddresses();
  }

  @Get('user-address/:userId/user')
  async getUserAddressByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userAddressService.getUserAddressByUserId(userId);
  }

  @Get('user-address/:userAddressId/detail')
  async findOne(@Param() params: GetUserAddressByIdParamsDto) {
    return await this.userAddressService.getUserAddressById(
      params.userAddressId,
    );
  }

  @Put('/user-address/:userAddressId/update')
  async updateUserAddress(
    @Param() params: UpdateUserAddressParamsDto,
    @Body() body: UpdateUserAddressBodyDto,
    @Req() req: RequestModel,
  ) {
    const userAddress = await this.userAddressService.getUserAddressById(
      params.userAddressId,
    );
    return await this.userAddressService.updateUserAddress(
      userAddress,
      body.province,
      body.district,
      body.ward,
      body.addressDetail,
      body.isDefault,
      req.user.userId,
    );
  }

  @Delete('user-address/:userAddressId/delete')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.userAddressService.deleteUserAddress(id);
    return { message: 'Địa chỉ đã được xóa thành công' };
  }

  @Patch('user-address/:userAddressId/set-default')
  @ApiOperation({ summary: 'Đặt địa chỉ làm mặc định' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID của địa chỉ' })
  @ApiResponse({
    status: 200,
    description: 'Địa chỉ đã được đặt làm mặc định',
    type: UserAddressEntity,
  })
  async setDefault(@Param('id', ParseIntPipe) id: number) {
    return await this.userAddressService.setDefault(id);
  }
}
