import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';
import { GenderType } from './enums/gender.type';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { UserDetailEntity } from './entities/user-detail.entity';
import { UserDetailModel } from './models/user-detail.model';

@Injectable()
export class UserDetailService {
  constructor(
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRepository: Repository<UserDetailEntity>,
  ) {}

  async getUserDetails(
    userDetailIds: number[] | undefined,
    userIds: number[] | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<UserDetailModel>> {
    const [userDetails, total] = await this.userDetailRepository.findAndCount({
      where: {
        id: userDetailIds ? In(userDetailIds) : undefined,
        userId: userIds ? In(userIds) : undefined,
        name: search ? Like(`%${search}%`) : undefined,
        deletedAt: IsNull(),
      },
      ...pagination?.toQuery(),
      relations: relations,
    });

    return new PageList<UserDetailModel>(
      total,
      userDetails.map((userDetails: UserDetailEntity) => userDetails.toModel()),
    );
  }

  async checkUserDetailExists(userId: number): Promise<boolean> {
    const userDetail = await this.userDetailRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
    });
    return !!userDetail;
  }

  async getUserDetail(userDetailId: number): Promise<UserDetailModel> {
    const userDetail = await this.userDetailRepository.findOne({
      where: { id: userDetailId, deletedAt: IsNull() },
    });
    if (!userDetail) {
      throw new HttpException('User detail not found', HttpStatus.NOT_FOUND);
    }
    return userDetail.toModel();
  }

  async getUserDetailByUserId(userId: number): Promise<UserDetailModel> {
    const userDetail = await this.userDetailRepository.findOne({
      where: {
        userId: userId,
        deletedAt: IsNull(),
      },
    });
    if (!userDetail) {
      throw new HttpException('User detail not found', HttpStatus.NOT_FOUND);
    }
    return userDetail.toModel();
  }

  async createUserDetail(
    userId: number,
    name: string | undefined,
    dob: Date | undefined,
    gender: GenderType | undefined,
    reqAccountId: number | undefined,
  ): Promise<UserDetailModel> {
    const entity = new UserDetailEntity();
    entity.userId = userId;
    entity.name = name;
    entity.dob = dob;
    entity.gender = gender;
    entity.createdAt = new Date();
    entity.createdBy = reqAccountId || userId;
    const newUserDetail = await this.userDetailRepository.save(entity);

    return await this.getUserDetail(newUserDetail.id);
  }

  async updateUserDetail(
    userDetail: UserDetailModel,
    name: string | undefined,
    dob: Date | undefined,
    gender: GenderType | undefined,
    userId: number | undefined,
    reqAccountId: number,
  ): Promise<UserDetailModel> {
    await this.userDetailRepository.update(
      {
        id: userDetail.id,
        deletedAt: IsNull(),
      },
      {
        name: name,
        dob: dob,
        gender: gender,
        userId: userId,
        updatedAt: new Date(),
        updatedBy: reqAccountId || userDetail.userId,
      },
    );
    return this.getUserDetail(userDetail.id);
  }

  async deleteUserDetail(
    userDetail: UserDetailModel,
    userId: number,
  ): Promise<boolean> {
    await this.userDetailRepository.update(
      {
        id: userDetail.id,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    );
    return true;
  }
}
