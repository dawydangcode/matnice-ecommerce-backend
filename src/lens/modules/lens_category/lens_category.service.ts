import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { LensCategoryEntity } from './entities/lens_category.entity';
import { LensCategoryFilterDto } from './dtos/lens_category.dto';
import { LensCategoryModel } from './models/lens_category.model';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';

@Injectable()
export class LensCategoryService {
  constructor(
    @InjectRepository(LensCategoryEntity)
    private readonly lensCategoryRepository: Repository<LensCategoryEntity>,
  ) {}

  async getLensCategories(
    lensCategoryIds: number[] | undefined,
    lensIds: number[] | undefined,
    categoryIds: number[] | undefined,
    pagination: PaginationParamsModel | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<LensCategoryModel>> {
    const [lensCategories, total] =
      await this.lensCategoryRepository.findAndCount({
        where: {
          id: lensCategoryIds ? In(lensCategoryIds) : undefined,
          lensId: lensIds ? In(lensIds) : undefined,
          categoryId: categoryIds ? In(categoryIds) : undefined,
          deletedAt: IsNull(),
        },
        relations: relations,
        ...pagination?.toQuery(),
      });
    return new PageList<LensCategoryModel>(
      total,
      lensCategories.map((category: LensCategoryEntity) => category.toModel()),
    );
  }

  async findOne(id: number): Promise<LensCategoryModel> {
    const whereCondition = { id } as any;
    whereCondition.deletedAt = null;

    const entity = await this.lensCategoryRepository.findOne({
      where: whereCondition,
      relations: ['lens'],
    });

    if (!entity) {
      throw new NotFoundException(`Lens category with ID ${id} not found`);
    }

    return entity.toModel();
  }

  async findByLensId(lensId: number): Promise<LensCategoryModel[]> {
    const entities = await this.lensCategoryRepository
      .createQueryBuilder('lensCategory')
      .where('lensCategory.lensId = :lensId', { lensId })
      .andWhere('lensCategory.deletedAt IS NULL')
      .leftJoinAndSelect('lensCategory.lens', 'lens')
      .getMany();

    return entities.map((entity) => entity.toModel());
  }

  async createLensCategory(
    lensId: number,
    categoryId: number,
    reqUserId: number,
  ): Promise<LensCategoryModel> {
    const entity = this.lensCategoryRepository.create({
      lensId: lensId,
      categoryId: categoryId,
      createdAt: new Date(),
      createdBy: reqUserId,
    });

    const savedEntity = await this.lensCategoryRepository.save(entity);
    return savedEntity.toModel();
  }

  async remove(id: number, reqUserId: number): Promise<void> {
    const entity = await this.lensCategoryRepository.findOne({
      where: { id, deletedAt: null } as any,
    });

    if (!entity) {
      throw new NotFoundException(`Lens category with ID ${id} not found`);
    }

    entity.deletedAt = new Date();
    entity.deletedBy = reqUserId;

    await this.lensCategoryRepository.save(entity);
  }
}
