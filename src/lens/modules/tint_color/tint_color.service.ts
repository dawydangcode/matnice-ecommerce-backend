import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { TintColorEntity } from './entities/tint_color.entity';
import { TintColorModel } from './models/tint_color.model';
import { CreateTintColorDto, UpdateTintColorDto } from './dtos/tint_color.dto';

@Injectable()
export class TintColorService {
  constructor(
    @InjectRepository(TintColorEntity)
    private readonly tintColorRepository: Repository<TintColorEntity>,
  ) {}

  async findAll(): Promise<TintColorModel[]> {
    const tintColors = await this.tintColorRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    return tintColors.map((color) => color.toModel());
  }

  async findById(id: number): Promise<TintColorModel> {
    const tintColor = await this.tintColorRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!tintColor) {
      throw new HttpException('Tint color not found', HttpStatus.NOT_FOUND);
    }

    return tintColor.toModel();
  }

  async findByTintId(tintId: number): Promise<TintColorModel[]> {
    const tintColors = await this.tintColorRepository.find({
      where: { tintId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    return tintColors.map((color) => color.toModel());
  }

  async create(
    createTintColorDto: CreateTintColorDto,
    reqUserId: number,
  ): Promise<TintColorModel> {
    // Check if color name already exists for this tint
    const existingColor = await this.tintColorRepository
      .createQueryBuilder('tc')
      .where('tc.tintId = :tintId', { tintId: createTintColorDto.tintId })
      .andWhere(
        'tc.name COLLATE utf8mb4_unicode_ci = :name COLLATE utf8mb4_unicode_ci',
        {
          name: createTintColorDto.name,
        },
      )
      .andWhere('tc.deletedAt IS NULL')
      .getOne();

    if (existingColor) {
      throw new HttpException(
        'A color with this name already exists for this tint',
        HttpStatus.CONFLICT,
      );
    }

    const entity = new TintColorEntity();
    entity.tintId = createTintColorDto.tintId;
    entity.name = createTintColorDto.name;
    entity.imageUrl = createTintColorDto.imageUrl;
    entity.colorCode = createTintColorDto.colorCode;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedTintColor = await this.tintColorRepository.save(entity);
    return savedTintColor.toModel();
  }

  async update(
    id: number,
    updateTintColorDto: UpdateTintColorDto,
    reqUserId: number,
  ): Promise<TintColorModel> {
    const tintColor = await this.tintColorRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!tintColor) {
      throw new HttpException('Tint color not found', HttpStatus.NOT_FOUND);
    }

    // Check if name already exists for this tint (if name is being updated)
    if (updateTintColorDto.name && updateTintColorDto.name !== tintColor.name) {
      const checkTintId = updateTintColorDto.tintId || tintColor.tintId;

      const existingColor = await this.tintColorRepository
        .createQueryBuilder('tc')
        .where('tc.tintId = :tintId', { tintId: checkTintId })
        .andWhere(
          'tc.name COLLATE utf8mb4_unicode_ci = :name COLLATE utf8mb4_unicode_ci',
          {
            name: updateTintColorDto.name,
          },
        )
        .andWhere('tc.deletedAt IS NULL')
        .andWhere('tc.id != :id', { id })
        .getOne();

      if (existingColor) {
        throw new HttpException(
          'A color with this name already exists for this tint',
          HttpStatus.CONFLICT,
        );
      }
    }

    const updateData: Partial<TintColorEntity> = {
      ...updateTintColorDto,
      updatedAt: new Date(),
      updatedBy: reqUserId,
    };

    await this.tintColorRepository.update(
      { id, deletedAt: IsNull() },
      updateData,
    );

    return this.findById(id);
  }

  async delete(id: number, reqUserId: number): Promise<boolean> {
    const tintColor = await this.tintColorRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!tintColor) {
      throw new HttpException('Tint color not found', HttpStatus.NOT_FOUND);
    }

    await this.tintColorRepository.update(
      { id },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async findWithPagination(
    page: number = 1,
    limit: number = 10,
    tintId?: number,
  ): Promise<{
    data: TintColorModel[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryBuilder = this.tintColorRepository
      .createQueryBuilder('tc')
      .where('tc.deletedAt IS NULL');

    if (tintId) {
      queryBuilder.andWhere('tc.tintId = :tintId', { tintId });
    }

    const total = await queryBuilder.getCount();
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    const tintColors = await queryBuilder
      .orderBy('tc.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return {
      data: tintColors.map((color) => color.toModel()),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async searchByName(searchTerm: string): Promise<TintColorModel[]> {
    const tintColors = await this.tintColorRepository
      .createQueryBuilder('tc')
      .where('tc.deletedAt IS NULL')
      .andWhere('tc.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('tc.name', 'ASC')
      .getMany();

    return tintColors.map((color) => color.toModel());
  }
}
