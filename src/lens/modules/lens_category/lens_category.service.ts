import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { LensCategoryEntity } from './entities/lens_category.entity';
import {
  CreateLensCategoryDto,
  LensCategoryFilterDto,
} from './dtos/lens_category.dto';
import { LensCategoryModel } from './models/lens_category.model';

@Injectable()
export class LensCategoryService {
  constructor(
    @InjectRepository(LensCategoryEntity)
    private readonly lensCategoryRepository: Repository<LensCategoryEntity>,
  ) {}

  async findAll(filters: LensCategoryFilterDto): Promise<{
    data: LensCategoryModel[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, search } = filters;

    const queryBuilder: SelectQueryBuilder<LensCategoryEntity> =
      this.lensCategoryRepository
        .createQueryBuilder('lensCategory')
        .leftJoinAndSelect('lensCategory.lens', 'lens')
        .where('lensCategory.deletedAt IS NULL');

    if (search) {
      queryBuilder.andWhere('lens.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    queryBuilder
      .orderBy('lensCategory.id', 'ASC')
      .skip((page - 1) * limit)
      .limit(limit);

    const [entities, total] = await queryBuilder.getManyAndCount();
    const models = entities.map((entity) => entity.toModel());

    return {
      data: models,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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

  async create(
    createDto: CreateLensCategoryDto,
    userId?: number,
  ): Promise<LensCategoryModel> {
    const entity = this.lensCategoryRepository.create({
      lensId: createDto.lensId,
      categoryId: createDto.categoryId,
      createdBy: userId || 0,
    });

    const savedEntity = await this.lensCategoryRepository.save(entity);
    return savedEntity.toModel();
  }

  async remove(id: number, userId?: number): Promise<void> {
    const entity = await this.lensCategoryRepository.findOne({
      where: { id, deletedAt: null } as any,
    });

    if (!entity) {
      throw new NotFoundException(`Lens category with ID ${id} not found`);
    }

    entity.deletedAt = new Date();
    entity.deletedBy = userId;

    await this.lensCategoryRepository.save(entity);
  }
}
