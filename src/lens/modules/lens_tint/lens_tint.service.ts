import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { LensTintEntity } from './entities/lens_tint.entity';
import { TintColorEntity } from './entities/tint_color.entity';
import { LensTintModel } from './models/lens_tint.model';
import { TintColorModel } from './models/tint_color.model';
import {
  CreateLensTintDto,
  UpdateLensTintDto,
  CreateTintColorDto,
  UpdateTintColorDto,
} from './dtos/lens_tint.dto';

@Injectable()
export class LensTintService {
  constructor(
    @InjectRepository(LensTintEntity)
    private readonly lensTintRepository: Repository<LensTintEntity>,
    @InjectRepository(TintColorEntity)
    private readonly tintColorRepository: Repository<TintColorEntity>,
  ) {}

  async findAllLensTints(): Promise<LensTintModel[]> {
    const lensTints = await this.lensTintRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    return lensTints.map((tint) => tint.toModel());
  }

  async findLensTintById(id: number): Promise<LensTintModel> {
    const lensTint = await this.lensTintRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lensTint) {
      throw new HttpException('Lens tint not found', HttpStatus.NOT_FOUND);
    }

    return lensTint.toModel();
  }

  async createLensTint(
    createLensTintDto: CreateLensTintDto,
    reqUserId: number,
  ): Promise<LensTintModel> {
    // Check if name already exists
    const existingTint = await this.lensTintRepository
      .createQueryBuilder('lt')
      .where(
        'lt.name COLLATE utf8mb4_unicode_ci = :name COLLATE utf8mb4_unicode_ci',
        {
          name: createLensTintDto.name,
        },
      )
      .andWhere('lt.deletedAt IS NULL')
      .getOne();

    if (existingTint) {
      throw new HttpException(
        'Lens tint with this name already exists',
        HttpStatus.CONFLICT,
      );
    }

    const entity = new LensTintEntity();
    entity.name = createLensTintDto.name;
    entity.price = createLensTintDto.price;
    entity.description = createLensTintDto.description;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedLensTint = await this.lensTintRepository.save(entity);
    return savedLensTint.toModel();
  }

  async updateLensTint(
    id: number,
    updateLensTintDto: UpdateLensTintDto,
    reqUserId: number,
  ): Promise<LensTintModel> {
    const lensTint = await this.lensTintRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lensTint) {
      throw new HttpException('Lens tint not found', HttpStatus.NOT_FOUND);
    }

    // Check if name already exists (if name is being updated)
    if (updateLensTintDto.name && updateLensTintDto.name !== lensTint.name) {
      const existingTint = await this.lensTintRepository
        .createQueryBuilder('lt')
        .where(
          'lt.name COLLATE utf8mb4_unicode_ci = :name COLLATE utf8mb4_unicode_ci',
          {
            name: updateLensTintDto.name,
          },
        )
        .andWhere('lt.deletedAt IS NULL')
        .getOne();

      if (existingTint) {
        throw new HttpException(
          'Lens tint with this name already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const updateData: Partial<LensTintEntity> = {
      ...updateLensTintDto,
      updatedAt: new Date(),
      updatedBy: reqUserId,
    };

    await this.lensTintRepository.update(
      { id, deletedAt: IsNull() },
      updateData,
    );

    return this.findLensTintById(id);
  }

  async deleteLensTint(id: number, reqUserId: number): Promise<boolean> {
    const lensTint = await this.lensTintRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lensTint) {
      throw new HttpException('Lens tint not found', HttpStatus.NOT_FOUND);
    }

    // Check if tint has associated colors
    const associatedColors = await this.tintColorRepository.count({
      where: { tint_id: id, deleted_at: IsNull() },
    });

    if (associatedColors > 0) {
      throw new HttpException(
        'Cannot delete lens tint with associated colors. Please delete the colors first.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.lensTintRepository.update(
      { id },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  // Tint Color CRUD Operations
  async findTintColorsByTintId(tintId: number): Promise<TintColorModel[]> {
    // First verify the tint exists
    await this.findLensTintById(tintId);

    const tintColors = await this.tintColorRepository.find({
      where: { tint_id: tintId, deleted_at: IsNull() },
      order: { created_at: 'DESC' },
    });

    return tintColors.map((color) => color.toModel());
  }

  async findTintColorById(id: number): Promise<TintColorModel> {
    const tintColor = await this.tintColorRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!tintColor) {
      throw new HttpException('Tint color not found', HttpStatus.NOT_FOUND);
    }

    return tintColor.toModel();
  }

  async createTintColor(
    createTintColorDto: CreateTintColorDto,
    reqUserId: number,
  ): Promise<TintColorModel> {
    // Verify the tint exists
    await this.findLensTintById(createTintColorDto.tintId);

    // Check if color name already exists for this tint
    const existingColor = await this.tintColorRepository
      .createQueryBuilder('tc')
      .where('tc.tint_id = :tintId', { tintId: createTintColorDto.tintId })
      .andWhere(
        'tc.name COLLATE utf8mb4_unicode_ci = :name COLLATE utf8mb4_unicode_ci',
        {
          name: createTintColorDto.name,
        },
      )
      .andWhere('tc.deleted_at IS NULL')
      .getOne();

    if (existingColor) {
      throw new HttpException(
        'A color with this name already exists for this tint',
        HttpStatus.CONFLICT,
      );
    }

    const entity = new TintColorEntity();
    entity.tint_id = createTintColorDto.tintId;
    entity.name = createTintColorDto.name;
    entity.image_url = createTintColorDto.imageUrl;
    entity.color_code = createTintColorDto.colorCode;
    entity.created_at = new Date();
    entity.created_by = reqUserId;

    const savedTintColor = await this.tintColorRepository.save(entity);
    return savedTintColor.toModel();
  }

  async updateTintColor(
    id: number,
    updateTintColorDto: UpdateTintColorDto,
    reqUserId: number,
  ): Promise<TintColorModel> {
    const tintColor = await this.tintColorRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!tintColor) {
      throw new HttpException('Tint color not found', HttpStatus.NOT_FOUND);
    }

    // Check if name already exists for this tint (if name is being updated)
    if (updateTintColorDto.name && updateTintColorDto.name !== tintColor.name) {
      const existingColor = await this.tintColorRepository
        .createQueryBuilder('tc')
        .where('tc.tint_id = :tintId', { tintId: tintColor.tint_id })
        .andWhere(
          'tc.name COLLATE utf8mb4_unicode_ci = :name COLLATE utf8mb4_unicode_ci',
          {
            name: updateTintColorDto.name,
          },
        )
        .andWhere('tc.deleted_at IS NULL')
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
      updated_at: new Date(),
      updated_by: reqUserId,
    };

    await this.tintColorRepository.update(
      { id, deleted_at: IsNull() },
      updateData,
    );

    return this.findTintColorById(id);
  }

  async deleteTintColor(id: number, reqUserId: number): Promise<boolean> {
    const tintColor = await this.tintColorRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!tintColor) {
      throw new HttpException('Tint color not found', HttpStatus.NOT_FOUND);
    }

    await this.tintColorRepository.update(
      { id },
      {
        deleted_at: new Date(),
        deleted_by: reqUserId,
      },
    );

    return true;
  }

  // Additional utility methods
  async findAllTintColors(): Promise<TintColorModel[]> {
    const tintColors = await this.tintColorRepository.find({
      where: { deleted_at: IsNull() },
      order: { created_at: 'DESC' },
      relations: ['lensTint'],
    });

    return tintColors.map((color) => color.toModel());
  }

  async findTintColorsWithTint(): Promise<
    (TintColorModel & { tintName: string })[]
  > {
    const tintColors = await this.tintColorRepository
      .createQueryBuilder('tc')
      .leftJoinAndSelect('tc.lensTint', 'lt')
      .where('tc.deleted_at IS NULL')
      .andWhere('lt.deletedAt IS NULL')
      .orderBy('tc.created_at', 'DESC')
      .getMany();

    return tintColors.map((color) => ({
      ...color.toModel(),
      tintName: color.lensTint.name,
    }));
  }
}
