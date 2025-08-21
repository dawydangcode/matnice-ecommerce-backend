import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Like, In } from 'typeorm';
import { LensRefractionRangeEntity } from './entities/lens_refraction_range.entity';
import { LensRefractionRangeModel } from './models/lens_refraction_range.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';
import { LensRefractionType } from './enum/lens-refraction.type';

export interface LensRefractionRangeResponse {
  data: LensRefractionRangeModel[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class LensRefractionRangeService {
  constructor(
    @InjectRepository(LensRefractionRangeEntity)
    private readonly lensRefractionRangeRepository: Repository<LensRefractionRangeEntity>,
  ) {}

  async getLensRefractionRanges(
    lensRefractionRangeIds: number[] | undefined,
    lensVariantIds: number[] | undefined,
    refractionType: LensRefractionType | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<LensRefractionRangeModel>> {
    const [lensRefractionRanges, total] =
      await this.lensRefractionRangeRepository.findAndCount({
        where: {
          id: lensRefractionRangeIds ? In(lensRefractionRangeIds) : undefined,
          lensVariantId: lensVariantIds ? In(lensVariantIds) : undefined,
          refractionType: refractionType,
          deletedAt: IsNull(),
        },
        relations: relations,
        ...pagination?.toQuery(),
      });

    return new PageList<LensRefractionRangeModel>(
      total,
      lensRefractionRanges.map((refractionRange: LensRefractionRangeEntity) =>
        refractionRange.toModel(),
      ),
    );
  }

  async getLensRefractionRangeById(
    lensRefractionRangeId: number,
  ): Promise<LensRefractionRangeModel> {
    const lensRefractionRange =
      await this.lensRefractionRangeRepository.findOne({
        where: { id: lensRefractionRangeId, deletedAt: IsNull() },
      });

    if (!lensRefractionRange) {
      throw new HttpException(
        'Lens refraction range not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return lensRefractionRange.toModel();
  }

  async createLensRefractionRange(
    lensVariantId: number,
    refractionType: LensRefractionType,
    minValue: number,
    maxValue: number,
    stepValue: number,
    reqUserId: number,
  ): Promise<LensRefractionRangeModel> {
    // Validate min/max values
    if (minValue >= maxValue) {
      throw new HttpException(
        'Minimum value must be less than maximum value',
        HttpStatus.BAD_REQUEST,
      );
    }

    const entity = new LensRefractionRangeEntity();
    entity.lensVariantId = lensVariantId;
    entity.refractionType = refractionType;
    entity.minValue = minValue;
    entity.maxValue = maxValue;
    entity.stepValue = stepValue;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedRefractionRange =
      await this.lensRefractionRangeRepository.save(entity);
    return savedRefractionRange.toModel();
  }

  async updateLensRefractionRange(
    lensRefractionRange: LensRefractionRangeModel,
    lensVariantId: number | undefined,
    refractionType: LensRefractionType | undefined,
    minValue: number | undefined,
    maxValue: number | undefined,
    stepValue: number | undefined,
    reqUserId: number,
  ): Promise<LensRefractionRangeModel> {
    // Validate min/max values if both are provided
    const newMinValue = minValue ?? lensRefractionRange.minValue;
    const newMaxValue = maxValue ?? lensRefractionRange.maxValue;

    if (newMinValue >= newMaxValue) {
      throw new HttpException(
        'Minimum value must be less than maximum value',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.lensRefractionRangeRepository.update(
      { id: lensRefractionRange.id, deletedAt: IsNull() },
      {
        lensVariantId: lensVariantId,
        refractionType: refractionType,
        minValue: minValue,
        maxValue: maxValue,
        stepValue: stepValue,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getLensRefractionRangeById(lensRefractionRange.id);
  }

  async deleteLensRefractionRange(
    lensRefractionRange: LensRefractionRangeModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.lensRefractionRangeRepository.update(
      { id: lensRefractionRange.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
