import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, In } from 'typeorm';
import { LensVariantCoatingEntity } from './entities/lens_variant_coating.entity';
import { LensVariantCoatingModel } from './models/lens_variant_coating.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';

export interface LensVariantCoatingResponse {
  data: LensVariantCoatingModel[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class LensVariantCoatingService {
  constructor(
    @InjectRepository(LensVariantCoatingEntity)
    private readonly lensVariantCoatingRepository: Repository<LensVariantCoatingEntity>,
  ) {}

  async getLensVariantCoatings(
    lensVariantCoatingIds: number[] | undefined,
    lensVariantIds: number[] | undefined,
    lensCoatingIds: number[] | undefined,
    pagination: PaginationParamsModel | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<LensVariantCoatingModel>> {
    const [lensVariantCoatings, total] =
      await this.lensVariantCoatingRepository.findAndCount({
        where: {
          id: lensVariantCoatingIds ? In(lensVariantCoatingIds) : undefined,
          lensVariantId: lensVariantIds ? In(lensVariantIds) : undefined,
          lensCoatingId: lensCoatingIds ? In(lensCoatingIds) : undefined,
          deletedAt: IsNull(),
        },
        relations: relations,
        ...pagination?.toQuery(),
      });

    return new PageList<LensVariantCoatingModel>(
      total,
      lensVariantCoatings.map((variantCoating: LensVariantCoatingEntity) =>
        variantCoating.toModel(),
      ),
    );
  }

  async getLensVariantCoatingById(
    lensVariantCoatingId: number,
  ): Promise<LensVariantCoatingModel> {
    const lensVariantCoating = await this.lensVariantCoatingRepository.findOne({
      where: { id: lensVariantCoatingId, deletedAt: IsNull() },
      relations: ['lensCoating'],
    });

    if (!lensVariantCoating) {
      throw new HttpException(
        'Lens variant coating not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return lensVariantCoating.toModel();
  }

  async getCoatingsByLensVariantId(
    lensVariantId: number,
  ): Promise<LensVariantCoatingModel[]> {
    const lensVariantCoatings = await this.lensVariantCoatingRepository.find({
      where: {
        lensVariantId: lensVariantId,
        deletedAt: IsNull(),
      },
      relations: ['lensCoating'],
    });

    return lensVariantCoatings.map((variantCoating) =>
      variantCoating.toModel(),
    );
  }

  async getLensVariantsByCoatingId(
    lensCoatingId: number,
  ): Promise<LensVariantCoatingModel[]> {
    const lensVariantCoatings = await this.lensVariantCoatingRepository.find({
      where: {
        lensCoatingId: lensCoatingId,
        deletedAt: IsNull(),
      },
      relations: ['lensCoating'],
    });

    return lensVariantCoatings.map((variantCoating) =>
      variantCoating.toModel(),
    );
  }

  async createLensVariantCoating(
    lensVariantId: number,
    lensCoatingId: number,
    reqUserId: number,
  ): Promise<LensVariantCoatingModel> {
    // Check if this combination already exists
    const existing = await this.lensVariantCoatingRepository.findOne({
      where: {
        lensVariantId: lensVariantId,
        lensCoatingId: lensCoatingId,
        deletedAt: IsNull(),
      },
    });

    if (existing) {
      throw new HttpException(
        'This coating is already applied to this lens variant',
        HttpStatus.CONFLICT,
      );
    }

    const entity = new LensVariantCoatingEntity();
    entity.lensVariantId = lensVariantId;
    entity.lensCoatingId = lensCoatingId;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedVariantCoating =
      await this.lensVariantCoatingRepository.save(entity);
    return savedVariantCoating.toModel();
  }

  async updateLensVariantCoating(
    lensVariantCoating: LensVariantCoatingModel,
    lensVariantId: number | undefined,
    lensCoatingId: number | undefined,
    reqUserId: number,
  ): Promise<LensVariantCoatingModel> {
    // Check if new combination already exists (if updating)
    if (lensVariantId || lensCoatingId) {
      const newLensVariantId =
        lensVariantId ?? lensVariantCoating.lensVariantId;
      const newLensCoatingId =
        lensCoatingId ?? lensVariantCoating.lensCoatingId;

      const existing = await this.lensVariantCoatingRepository.findOne({
        where: {
          lensVariantId: newLensVariantId,
          lensCoatingId: newLensCoatingId,
          deletedAt: IsNull(),
        },
      });

      if (existing && existing.id !== lensVariantCoating.id) {
        throw new HttpException(
          'This coating is already applied to this lens variant',
          HttpStatus.CONFLICT,
        );
      }
    }

    await this.lensVariantCoatingRepository.update(
      { id: lensVariantCoating.id, deletedAt: IsNull() },
      {
        lensVariantId: lensVariantId,
        lensCoatingId: lensCoatingId,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getLensVariantCoatingById(lensVariantCoating.id);
  }

  async deleteLensVariantCoating(
    lensVariantCoating: LensVariantCoatingModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.lensVariantCoatingRepository.update(
      { id: lensVariantCoating.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
