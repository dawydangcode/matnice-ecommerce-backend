import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { In, IsNull, Like, Repository } from 'typeorm';
import { PageList } from 'src/common/models/page-list.model';
import { UserModel } from './models/user.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/common/utils/constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
      throw new Error('User not found');
    }

    return user.toModel(isHiddenPassword);
  }

  async createUser(
    username: string,
    password: string,
    email: string,
    roleId: number,
    reqAccountId: number | undefined,
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

    const entity = new AccountEntity();
    entity.username = username;
    entity.password = hashedPassword;
    entity.email = email;
    entity.roleId = roleId ?? defaultRole.id;
    entity.createdAt = new Date();
    entity.createdBy = reqAccountId;

    const newAccount = await this.accountRepository.save(entity);
    if (!reqAccountId) {
      await this.accountRepository.update(newAccount.id, {
        createdBy: newAccount.id,
      });
    }

    return await this.getAccount(newAccount.id, true);
  }
}
