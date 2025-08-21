import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { LensVariantEntity } from './entities/lens_variant.entity';
import { LensVariantModel } from './models/lens_variant.model';
import {
  CreateLensVariantDto,
  UpdateLensVariantDto,
  LensVariantFiltersDto,
} from './dtos/lens_variant.dto';

export interface LensVariantResponse {
  data: LensVariantModel[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class LensVariantService {
  constructor(
    @InjectRepository(LensVariantEntity)
    private readonly lensVariantRepository: Repository<LensVariantEntity>,
  ) {}

  async findAll(
    filters: LensVariantFiltersDto = {},
  ): Promise<LensVariantResponse> {
    const { page = 1, limit = 10, search, lensId, lensThicknessId } = filters;
    const skip = (page - 1) * limit;

    const queryBuilder = this.lensVariantRepository
      .createQueryBuilder('variant')
      .leftJoinAndSelect('variant.lens', 'lens')
      .leftJoinAndSelect('variant.lensThickness', 'thickness')
      .where('variant.deleted_at IS NULL');

    if (search) {
      queryBuilder.andWhere(
        '(variant.design LIKE :search OR variant.material LIKE :search OR lens.name LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (lensId) {
      queryBuilder.andWhere('variant.lens_id = :lensId', { lensId });
    }

    if (lensThicknessId) {
      queryBuilder.andWhere('variant.lens_thickness_id = :lensThicknessId', {
        lensThicknessId,
      });
    }

    const [variants, total] = await queryBuilder
      .orderBy('variant.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: variants.map((variant) => variant.toModel()),
      total,
      page,
      limit,
    };
  }

  async findById(id: number): Promise<LensVariantModel> {
    const variant = await this.lensVariantRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['lens', 'lensThickness'],
    });

    if (!variant) {
      throw new HttpException('Lens variant not found', HttpStatus.NOT_FOUND);
    }

    return variant.toModel();
  }

  async findByLensId(lensId: number): Promise<LensVariantModel[]> {
    const variants = await this.lensVariantRepository.find({
      where: { lensId, deletedAt: IsNull() },
      relations: ['lensThickness'],
      order: { price: 'ASC' },
    });

    return variants.map((variant) => variant.toModel());
  }

  async create(
    createDto: CreateLensVariantDto,
    reqUserId: number,
  ): Promise<LensVariantModel> {
    // Check if lens and thickness exist (basic validation)
    const whereCondition: any = {
      lensId: createDto.lensId,
      lensThicknessId: createDto.lensThicknessId,
      deletedAt: IsNull(),
    };

    if (createDto.design) {
      whereCondition.design = createDto.design;
    }

    if (createDto.material) {
      whereCondition.material = createDto.material;
    }

    const existingVariant = await this.lensVariantRepository.findOne({
      where: whereCondition,
    });

    if (existingVariant) {
      throw new HttpException(
        'Lens variant with this combination already exists',
        HttpStatus.CONFLICT,
      );
    }

    const variant = new LensVariantEntity();
    variant.lensId = createDto.lensId;
    variant.lensThicknessId = createDto.lensThicknessId;
    variant.design = createDto.design;
    variant.material = createDto.material;
    variant.price = createDto.price;
    variant.stock = createDto.stock || 0;
    variant.createdAt = new Date();
    variant.createdBy = reqUserId;

    const savedVariant = await this.lensVariantRepository.save(variant);
    return savedVariant.toModel();
  }

  async update(
    id: number,
    updateDto: UpdateLensVariantDto,
    reqUserId: number,
  ): Promise<LensVariantModel> {
    const variant = await this.lensVariantRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!variant) {
      throw new HttpException('Lens variant not found', HttpStatus.NOT_FOUND);
    }

    if (updateDto.design !== undefined) variant.design = updateDto.design;
    if (updateDto.material !== undefined) variant.material = updateDto.material;
    if (updateDto.price !== undefined) variant.price = updateDto.price;
    if (updateDto.stock !== undefined) variant.stock = updateDto.stock;

    variant.updatedAt = new Date();
    variant.updatedBy = reqUserId;

    const savedVariant = await this.lensVariantRepository.save(variant);
    return savedVariant.toModel();
  }

  async updateStock(
    id: number,
    newStock: number,
    reqUserId: number,
  ): Promise<LensVariantModel> {
    const variant = await this.lensVariantRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!variant) {
      throw new HttpException('Lens variant not found', HttpStatus.NOT_FOUND);
    }

    variant.stock = newStock;
    variant.updatedAt = new Date();
    variant.updatedBy = reqUserId;

    const savedVariant = await this.lensVariantRepository.save(variant);
    return savedVariant.toModel();
  }

  async delete(id: number, reqUserId: number): Promise<boolean> {
    const variant = await this.lensVariantRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!variant) {
      throw new HttpException('Lens variant not found', HttpStatus.NOT_FOUND);
    }

    variant.deletedAt = new Date();
    variant.deletedBy = reqUserId;

    await this.lensVariantRepository.save(variant);
    return true;
  }
}
