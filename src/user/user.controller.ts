import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateAccountBodyDto,
  DeleteUserParamsDto,
  GetUserParamsDto,
  GetUsersQueryDto,
  UpdateUserBodyDto,
  UpdateUserParamsDto,
} from './dtos/user.dto';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { RequestModel } from 'src/common/models/request.model';

@Controller('api/v1')
@Roles(RoleType.Admin)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user/list')
  async getUsers(@Query() query: GetUsersQueryDto) {
    return await this.userService.getUsers(
      undefined,
      undefined,
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      undefined,
      undefined,
    );
  }

  @Get('user/:userId/detail')
  async getAccountById(@Param() params: GetUserParamsDto) {
    return await this.userService.getUserById(params.userId, true);
  }

  @Post('user/create')
  async createAccount(
    @Req() req: RequestModel,
    @Body() body: CreateAccountBodyDto,
  ) {
    return await this.userService.createUser(
      body.username,
      body.password,
      body.email,
      body.roleId,
      req.user.userId,
    );
  }

  @Put('user/:userId/update')
  async updateUser(
    @Req() req: RequestModel,
    @Param() params: UpdateUserParamsDto,
    @Body() body: UpdateUserBodyDto,
  ) {
    const user = await this.userService.getUserById(params.userId, false);
    return await this.userService.updateUser(
      user,
      body.username,
      body.password,
      body.roleId,
      req.user.userId,
    );
  }

  @Delete('user/:userId/delete')
  async deleteUser(
    @Req() req: RequestModel,
    @Param() params: DeleteUserParamsDto,
  ) {
    const user = await this.userService.getUserById(params.userId, true);
    return await this.userService.deleteUser(user, req.user.userId);
  }
}
