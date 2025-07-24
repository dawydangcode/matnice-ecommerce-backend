import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleModel } from './models/role.model';
import { RoleEntity } from './entities/role.entity';
import { RoleType } from './enum/role.enum';
import { ADMIN_ACCOUNT_ID } from 'src/common/utils/constant';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async getRoles(): Promise<RoleModel[]> {
    const roles = await this.roleRepository.find({
      where: {
        deletedAt: IsNull(),
      },
    });
    return roles.map((role: RoleEntity) => role.toModel());
  }

  async getRole(roleId: number): Promise<RoleModel> {
    const role = await this.roleRepository.findOne({
      where: {
        id: roleId,
        deletedAt: IsNull(),
      },
    });

    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }

    return role.toModel();
  }

  async createRole(name: string): Promise<RoleModel> {
    const entity = new RoleEntity();
    entity.name = name;
    entity.createdAt = new Date();
    entity.createdBy = ADMIN_ACCOUNT_ID;
    const newRole = await this.roleRepository.save(entity);

    return await this.getRole(newRole.id);
  }

  async updateRole(
    role: RoleModel,
    name: string | undefined,
  ): Promise<RoleModel> {
    await this.roleRepository.update(
      {
        id: role.id,
        deletedAt: IsNull(),
      },
      {
        name: name,
        updatedAt: new Date(),
        updatedBy: ADMIN_ACCOUNT_ID,
      },
    );

    return await this.getRole(role.id);
  }

  async deleteRole(role: RoleModel): Promise<boolean> {
    await this.roleRepository.update(
      {
        id: role.id,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: ADMIN_ACCOUNT_ID,
      },
    );
    return true;
  }

  async getRoleByName(role: RoleType): Promise<RoleModel> {
    const defaultRole = await this.roleRepository.findOne({
      where: {
        name: role,
        deletedAt: IsNull(),
      },
    });
    if (!defaultRole) {
      throw new HttpException('Default role not found', HttpStatus.NOT_FOUND);
    }

    return defaultRole.toModel();
  }
}
