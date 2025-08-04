import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { LensQualityEntity } from './entities/lens_quality.entity';
import { LensQualityModel } from './models/lens_quality.model';
import {
  CreateLensQualityDto,
  UpdateLensQualityDto,
} from './dtos/lens_quality.dto';

@Injectable()
export class LensQualityService {
  constructor(
    @InjectRepository(LensQualityEntity)
    private readonly lensQualityRepository: Repository<LensQualityEntity>,
  ) {}

  async findAll(): Promise<LensQualityModel[]> {
    const lensQualities = await this.lensQualityRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    return lensQualities.map((quality) => quality.toModel());
  }

  async findById(id: number): Promise<LensQualityModel> {
    const lensQuality = await this.lensQualityRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lensQuality) {
      throw new HttpException('Lens quality not found', HttpStatus.NOT_FOUND);
    }

    return lensQuality.toModel();
  }

  async create(
    createLensQualityDto: CreateLensQualityDto,
    reqUserId: number,
  ): Promise<LensQualityModel> {
    // Check if name already exists
    const existingQuality = await this.lensQualityRepository.findOne({
      where: { name: createLensQualityDto.name, deletedAt: IsNull() },
    });

    if (existingQuality) {
      throw new HttpException(
        'Lens quality with this name already exists',
        HttpStatus.CONFLICT,
      );
    }

    const entity = new LensQualityEntity();
    entity.name = createLensQualityDto.name;
    entity.price = createLensQualityDto.price;
    entity.description = createLensQualityDto.description;
    entity.uvProtection = createLensQualityDto.uvProtection ?? true;
    entity.antiReflective = createLensQualityDto.antiReflective ?? true;
    entity.hardCoating = createLensQualityDto.hardCoating ?? true;
    entity.nightDayOptimization =
      createLensQualityDto.nightDayOptimization ?? false;
    entity.antistaticCoating = createLensQualityDto.antistaticCoating ?? false;
    entity.freeFormTechnology =
      createLensQualityDto.freeFormTechnology ?? false;
    entity.transitionsOption = createLensQualityDto.transitionsOption ?? false;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedLensQuality = await this.lensQualityRepository.save(entity);
    return savedLensQuality.toModel();
  }

  async update(
    id: number,
    updateLensQualityDto: UpdateLensQualityDto,
    reqUserId: number,
  ): Promise<LensQualityModel> {
    const lensQuality = await this.lensQualityRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lensQuality) {
      throw new HttpException('Lens quality not found', HttpStatus.NOT_FOUND);
    }

    // Check if name already exists (if name is being updated)
    if (
      updateLensQualityDto.name &&
      updateLensQualityDto.name !== lensQuality.name
    ) {
      const existingQuality = await this.lensQualityRepository.findOne({
        where: { name: updateLensQualityDto.name, deletedAt: IsNull() },
      });

      if (existingQuality) {
        throw new HttpException(
          'Lens quality with this name already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const updateData: Partial<LensQualityEntity> = {
      ...updateLensQualityDto,
      updatedAt: new Date(),
      updatedBy: reqUserId,
    };

    await this.lensQualityRepository.update(
      { id, deletedAt: IsNull() },
      updateData,
    );

    return this.findById(id);
  }

  async delete(id: number, reqUserId: number): Promise<boolean> {
    const lensQuality = await this.lensQualityRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lensQuality) {
      throw new HttpException('Lens quality not found', HttpStatus.NOT_FOUND);
    }

    await this.lensQualityRepository.update(
      { id },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async findByFeatures(
    uvProtection?: boolean,
    antiReflective?: boolean,
    nightDayOptimization?: boolean,
    freeFormTechnology?: boolean,
  ): Promise<LensQualityModel[]> {
    const queryBuilder = this.lensQualityRepository.createQueryBuilder('lq');

    queryBuilder.where('lq.deletedAt IS NULL');

    if (uvProtection !== undefined) {
      queryBuilder.andWhere('lq.uvProtection = :uvProtection', {
        uvProtection,
      });
    }

    if (antiReflective !== undefined) {
      queryBuilder.andWhere('lq.antiReflective = :antiReflective', {
        antiReflective,
      });
    }

    if (nightDayOptimization !== undefined) {
      queryBuilder.andWhere('lq.nightDayOptimization = :nightDayOptimization', {
        nightDayOptimization,
      });
    }

    if (freeFormTechnology !== undefined) {
      queryBuilder.andWhere('lq.freeFormTechnology = :freeFormTechnology', {
        freeFormTechnology,
      });
    }

    queryBuilder.orderBy('lq.price', 'ASC');

    const lensQualities = await queryBuilder.getMany();
    return lensQualities.map((quality) => quality.toModel());
  }
}
