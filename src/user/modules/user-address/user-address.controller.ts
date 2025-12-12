import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Req,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserAddressService } from './user-address.service';
import {
  CreateUserAddressBodyDto,
  DeleteUserAddressParamsDto,
  GetUserAddressByIdParamsDto,
  UpdateUserAddressBodyDto,
  UpdateUserAddressParamsDto,
} from './dto/user-address.dto';
import { RequestModel } from 'src/common/models/request.model';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';

@ApiTags('User Addresses')
@Controller('api/v1')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Get('user-address/list')
  @Roles(RoleType.Admin)
  async getUserAddresses() {
    return await this.userAddressService.getUserAddresses();
  }

  @Get('user-address/:userId/user')
  @Roles(RoleType.User, RoleType.Admin)
  async getUserAddressByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userAddressService.getUserAddressByUserId(userId);
  }

  @Get('user-address/:userAddressId/detail')
  @Roles(RoleType.User, RoleType.Admin)
  async findOne(@Param() params: GetUserAddressByIdParamsDto) {
    return await this.userAddressService.getUserAddressById(
      params.userAddressId,
    );
  }

  @Post('/user-address/create')
  @Roles(RoleType.User, RoleType.Admin)
  async createUserAddress(
    @Query('userId', ParseIntPipe) userId: number,
    @Body() body: CreateUserAddressBodyDto,
    @Req() req: RequestModel,
  ) {
    return await this.userAddressService.createUserAddress(
      userId,
      body.province,
      body.district,
      body.ward,
      body.addressDetail,
      body.isDefault,
      req.user.userId,
    );
  }

  @Put('/user-address/:userAddressId/update')
  @Roles(RoleType.User, RoleType.Admin)
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
  @Roles(RoleType.User, RoleType.Admin)
  async remove(
    @Param() params: DeleteUserAddressParamsDto,
    @Req() req: RequestModel,
  ) {
    const userAddress = await this.userAddressService.getUserAddressById(
      params.userAddressId,
    );
    await this.userAddressService.deleteUserAddress(
      userAddress,
      req.user.userId,
    );
    return true;
  }

  @Put('user-address/:userAddressId/set-default')
  @Roles(RoleType.User, RoleType.Admin)
  async setDefault(
    @Param('userAddressId', ParseIntPipe) userAddressId: number,
  ) {
    return await this.userAddressService.setDefault(userAddressId);
  }
}
