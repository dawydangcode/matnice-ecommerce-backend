import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Like } from 'typeorm';
import { LensCoatingEntity } from './entities/lens_coating.entity';
import { LensCoatingModel } from './models/lens_coating.model';
import {
  CreateLensCoatingDto,
  UpdateLensCoatingDto,
  LensCoatingFiltersDto,
} from './dtos/lens_coating.dto';

export interface LensCoatingResponse {
  data: LensCoatingModel[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class LensCoatingService {
  constructor(
    @InjectRepository(LensCoatingEntity)
    private readonly lensCoatingRepository: Repository<LensCoatingEntity>,
  ) {}

  async findAll(
    filters: LensCoatingFiltersDto = {},
  ): Promise<LensCoatingResponse> {
    const { page = 1, limit = 10, search } = filters;
    const skip = (page - 1) * limit;

    const queryBuilder = this.lensCoatingRepository
      .createQueryBuilder('coating')
      .where('coating.deleted_at IS NULL');

    if (search) {
      queryBuilder.andWhere(
        '(coating.name LIKE :search OR coating.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [coatings, total] = await queryBuilder
      .orderBy('coating.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: coatings.map((coating) => coating.toModel()),
      total,
      page,
      limit,
    };
  }

  async findById(id: number): Promise<LensCoatingModel> {
    const coating = await this.lensCoatingRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!coating) {
      throw new HttpException('Lens coating not found', HttpStatus.NOT_FOUND);
    }

    return coating.toModel();
  }

  async create(
    createDto: CreateLensCoatingDto,
    reqUserId: number,
  ): Promise<LensCoatingModel> {
    // Check for duplicate name
    const existingCoating = await this.lensCoatingRepository.findOne({
      where: { name: createDto.name, deletedAt: IsNull() },
    });

    if (existingCoating) {
      throw new HttpException(
        'Coating with this name already exists',
        HttpStatus.CONFLICT,
      );
    }

    const coating = new LensCoatingEntity();
    coating.name = createDto.name;
    coating.price = createDto.price;
    coating.description = createDto.description;
    coating.createdAt = new Date();
    coating.createdBy = reqUserId;

    const savedCoating = await this.lensCoatingRepository.save(coating);
    return savedCoating.toModel();
  }

  async update(
    id: number,
    updateDto: UpdateLensCoatingDto,
    reqUserId: number,
  ): Promise<LensCoatingModel> {
    const coating = await this.lensCoatingRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!coating) {
      throw new HttpException('Lens coating not found', HttpStatus.NOT_FOUND);
    }

    // Check for duplicate name if name is being updated
    if (updateDto.name && updateDto.name !== coating.name) {
      const existingCoating = await this.lensCoatingRepository.findOne({
        where: { name: updateDto.name, deletedAt: IsNull() },
      });

      if (existingCoating) {
        throw new HttpException(
          'Coating with this name already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (updateDto.name) coating.name = updateDto.name;
    if (updateDto.price !== undefined) coating.price = updateDto.price;
    if (updateDto.description !== undefined)
      coating.description = updateDto.description;

    coating.updatedAt = new Date();
    coating.updatedBy = reqUserId;

    const savedCoating = await this.lensCoatingRepository.save(coating);
    return savedCoating.toModel();
  }

  async delete(id: number, reqUserId: number): Promise<boolean> {
    const coating = await this.lensCoatingRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!coating) {
      throw new HttpException('Lens coating not found', HttpStatus.NOT_FOUND);
    }

    coating.deletedAt = new Date();
    coating.deletedBy = reqUserId;

    await this.lensCoatingRepository.save(coating);
    return true;
  }
}
