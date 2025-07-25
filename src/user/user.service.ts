import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { In, IsNull, Like, Repository, DataSource } from 'typeorm';
import { PageList } from 'src/common/models/page-list.model';
import { UserModel } from './models/user.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/common/utils/constant';
import { RoleService } from 'src/role/role.service';
import { RoleType } from 'src/role/enum/role.enum';
import { UserDetailEntity } from './modules/user-detail/entities/user-detail.entity';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly roleService: RoleService,
    private readonly dataSource: DataSource,
  ) {}

  async getUsers(
    userIds: number[] | undefined,
    roleId: number | undefined,
    username: string | undefined,
    email: string | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<UserModel>> {
    const [users, total] = await this.userRepository.findAndCount({
      where: {
        id: userIds ? In(userIds) : undefined,
        roleId: roleId,
        username: username,
        email: email,
        deletedAt: IsNull(),
      },
      relations: relations,
      ...pagination?.toQuery(),
    });

    return new PageList<UserModel>(
      total,
      users.map((user: UserEntity) => user.toModel(true)),
    );
  }

  async getUserById(
    userId: number,
    isHiddenPassword: boolean,
  ): Promise<UserModel> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        deletedAt: IsNull(),
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user.toModel(isHiddenPassword);
  }

  async createUser(
    username: string,
    password: string,
    email: string,
    roleId: number,
    reqAccountId: number,
  ): Promise<UserModel> {
    const existingUser = await this.getUsers(
      undefined,
      undefined,
      username,
      undefined,
      undefined,
      undefined,
      undefined,
    );
    if (existingUser.total > 0) {
      throw new HttpException('Username already exists', HttpStatus.FOUND);
    }

    const existingUserEmail = await this.getUsers(
      undefined,
      undefined,
      undefined,
      email,
      undefined,
      undefined,
      undefined,
    );
    if (existingUserEmail.total > 0) {
      throw new HttpException('Email already exists', HttpStatus.FOUND);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_OR_ROUNDS);
    const defaultRole = await this.roleService.getRoleByName(RoleType.User);

    const entity = new UserEntity();
    entity.username = username;
    entity.password = hashedPassword;
    entity.email = email;
    entity.roleId = roleId ?? defaultRole.id;
    entity.createdAt = new Date();
    entity.createdBy = reqAccountId;

    const newAccount = await this.userRepository.save(entity);
    if (!reqAccountId) {
      await this.userRepository.update(newAccount.id, {
        createdBy: newAccount.id,
      });
    }

    return await this.getUserById(newAccount.id, true);
  }

  async updateUser(
    user: UserModel,
    username: string | undefined,
    password: string | undefined,
    email: string | undefined,
    roleId: number | undefined,
    reqAccountId: number | undefined,
  ): Promise<UserModel> {
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_OR_ROUNDS);
    }

    await this.userRepository.update(
      {
        id: user.id,
        deletedAt: IsNull(),
      },
      {
        username: username,
        password: hashedPassword,
        email: email,
        roleId: roleId,
        updatedAt: new Date(),
        updatedBy: reqAccountId,
      },
    );

    return await this.getUserById(user.id, true);
  }

  async deleteUser(user: UserModel, reqAccountId: number): Promise<boolean> {
    await this.userRepository.update(
      {
        id: user.id,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: reqAccountId,
      },
    );
    return true;
  }

  async getUserByUsername(
    username: string,
    isHiddenPassword: boolean,
  ): Promise<UserModel> {
    const userEntity = await this.userRepository.findOne({
      where: {
        username: username,
        deletedAt: IsNull(),
      },
    });

    if (!userEntity) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return userEntity.toModel(isHiddenPassword);
  }

  async getUserByEmail(
    email: string,
    isHiddenPassword: boolean,
  ): Promise<UserModel> {
    const userEntity = await this.userRepository.findOne({
      where: {
        email: email,
        deletedAt: IsNull(),
      },
    });

    if (!userEntity) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    return userEntity.toModel(isHiddenPassword);
  }
}
