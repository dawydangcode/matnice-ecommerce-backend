import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Post,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { UserDetailService } from './user-detail.service';
import { UserDetailModel } from './models/user-detail.model';
import { RequestModel } from 'src/common/models/request.model';
import {
  CreateUserDetailBodyDto,
  DeleteUserDetailParamsDto,
  GetUserDetailParamsDto,
  GetUserDetailsQueryDto,
  UpdateUserDetailBodyDto,
  UpdateUserDetailParamsDto,
} from './dtos/user-detail.dto';

@ApiTags('User / User Detail')
@Controller('/api/v1/')
export class UserDetailController {
  constructor(private readonly userDetailService: UserDetailService) {}

  @Get('user-detail/list')
  async getUserDetails(@Query() query: GetUserDetailsQueryDto) {
    return await this.userDetailService.getUserDetails(
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      undefined,
      undefined,
    );
  }

  @Get('user-detail/:userDetailId/detail')
  async getUserDetail(
    @Param() params: GetUserDetailParamsDto,
  ): Promise<UserDetailModel> {
    return await this.userDetailService.getUserDetail(params.userDetailId);
  }

  @Post('user-detail/create')
  async createUserDetail(
    @Req() req: RequestModel,
    @Body() body: CreateUserDetailBodyDto,
  ) {
    return await this.userDetailService.createUserDetail(
      body.userId,
      body.name,
      body.dob,
      body.gender,
      req.user.userId,
    );
  }

  @Put('user-detail/:userDetailId/update')
  async updateUserDetail(
    @Req() req: RequestModel,
    @Param() params: UpdateUserDetailParamsDto,
    @Body() body: UpdateUserDetailBodyDto,
  ): Promise<UserDetailModel> {
    const userDetail = await this.userDetailService.getUserDetail(
      params.userDetailId,
    );

    return await this.userDetailService.updateUserDetail(
      userDetail,
      body.name,
      body.dob,
      body.gender,
      body.userId,
      req.user.userId,
    );
  }

  @Delete('user-detail/:userDetailId/delete')
  async deleteUserDetail(
    @Param() params: DeleteUserDetailParamsDto,
  ): Promise<boolean> {
    const userDetail = await this.userDetailService.getUserDetail(
      params.userDetailId,
    );
    return await this.userDetailService.deleteUserDetail(
      userDetail,
      userDetail.userId,
    );
  }

  @Get('user/:userId/user-detail')
  async getUserDetailByUserId(@Param() params: any): Promise<UserDetailModel> {
    return await this.userDetailService.getUserDetailByUserId(params.userId);
  }
}
