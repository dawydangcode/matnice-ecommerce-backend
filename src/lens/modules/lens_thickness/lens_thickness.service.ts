import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { LensThicknessEntity } from './entities/lens_thickness.entity';
import {
  CreateLensThicknessDto,
  UpdateLensThicknessDto,
  LensThicknessFilterDto,
  LensThicknessSelectFields,
} from './dtos/lens_thickness.dto';
import { LensThicknessModel } from './models/lens_thickness.model';

@Injectable()
export class LensThicknessService {
  constructor(
    @InjectRepository(LensThicknessEntity)
    private readonly lensThicknessRepository: Repository<LensThicknessEntity>,
  ) {}

  async findAll(filters: LensThicknessFilterDto): Promise<{
    data: LensThicknessModel[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, search, isActive } = filters;

    const queryBuilder: SelectQueryBuilder<LensThicknessEntity> =
      this.lensThicknessRepository
        .createQueryBuilder('thickness')
        .select(LensThicknessSelectFields.map((field) => `thickness.${field}`))
        .where('thickness.deletedAt IS NULL');

    if (search) {
      queryBuilder.andWhere(
        '(thickness.name ILIKE :search OR thickness.description ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('thickness.isActive = :isActive', {
        isActive,
      });
    }

    queryBuilder
      .orderBy('thickness.name', 'ASC')
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

  async findOne(id: number): Promise<LensThicknessModel> {
    const whereCondition = { id } as any;
    whereCondition.deletedAt = null;

    const entity = await this.lensThicknessRepository.findOne({
      where: whereCondition,
    });

    if (!entity) {
      throw new NotFoundException(`Lens thickness with ID ${id} not found`);
    }

    return entity.toModel();
  }

  async findByIds(ids: number[]): Promise<LensThicknessModel[]> {
    const entities = await this.lensThicknessRepository
      .createQueryBuilder('thickness')
      .whereInIds(ids)
      .andWhere('thickness.deletedAt IS NULL')
      .getMany();

    return entities.map((entity) => entity.toModel());
  }

  async create(
    createDto: CreateLensThicknessDto,
    userId?: number,
  ): Promise<LensThicknessModel> {
    const entity = this.lensThicknessRepository.create({
      name: createDto.name,
      description: createDto.description,
      thickness: createDto.thickness,
      unit: createDto.unit,
      isActive: createDto.isActive ?? true,
      createdBy: userId,
    });

    const savedEntity = await this.lensThicknessRepository.save(entity);
    return savedEntity.toModel();
  }

  async update(
    id: number,
    updateDto: UpdateLensThicknessDto,
    userId?: number,
  ): Promise<LensThicknessModel> {
    const entity = await this.lensThicknessRepository.findOne({
      where: { id, deletedAt: null } as any,
    });

    if (!entity) {
      throw new NotFoundException(`Lens thickness with ID ${id} not found`);
    }

    entity.name = updateDto.name ?? entity.name;
    entity.description = updateDto.description ?? entity.description;
    entity.thickness = updateDto.thickness ?? entity.thickness;
    entity.unit = updateDto.unit ?? entity.unit;
    entity.isActive = updateDto.isActive ?? entity.isActive;
    entity.updatedBy = userId;

    const savedEntity = await this.lensThicknessRepository.save(entity);
    return savedEntity.toModel();
  }

  async remove(id: number, userId?: number): Promise<void> {
    const entity = await this.lensThicknessRepository.findOne({
      where: { id, deletedAt: null } as any,
    });

    if (!entity) {
      throw new NotFoundException(`Lens thickness with ID ${id} not found`);
    }

    entity.deletedAt = new Date();
    entity.deletedBy = userId;

    await this.lensThicknessRepository.save(entity);
  }
}
