import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleBodyDto, UpdateRoleParamsDto } from './dtos/role.dto';
import { RoleModel } from './models/role.model';
import { ApiTags } from '@nestjs/swagger';
import { RoleType } from './enum/role.enum';
import { Roles } from './decorators/roles.decorator';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';

@ApiTags('Role')
@Controller('api/v1')
@Roles(RoleType.Admin)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('role/list')
  async getAllRole(): Promise<RoleModel[]> {
    return await this.roleService.getRoles();
  }

  @Post('role/create')
  async createRole(@Body() body: CreateRoleBodyDto) {
    return await this.roleService.createRole(body.name);
  }

  @Put('role/:roleId/update')
  async updateRole(@Param() params: UpdateRoleParamsDto, @Body() body: any) {
    const role = await this.roleService.getRole(params.roleId);
    return await this.roleService.updateRole(role, body.name);
  }

  @Delete('role/:roleId/delete')
  async deleteRole(@Param() params: any) {
    const role = await this.roleService.getRole(params.roleId);
    return await this.roleService.deleteRole(role);
  }
}
