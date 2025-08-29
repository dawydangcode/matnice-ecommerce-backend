import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Like, In } from 'typeorm';
import { LensCoatingEntity } from './entities/lens_coating.entity';
import { LensCoatingModel } from './models/lens_coating.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';
import { LensCategoryModel } from '../lens_category/models/lens_category.model';
import { LensModel } from 'src/lens/models/lens.model';
import { LensVariantCoatingEntity } from '../lens_variant_coating/entities/lens_variant_coating.entity';
import { LensVariantEntity } from '../lens_variant/entities/lens_variant.entity';
import { LensService } from 'src/lens/lens.service';

@Injectable()
export class LensCoatingService {
  constructor(
    @InjectRepository(LensCoatingEntity)
    private readonly lensCoatingRepository: Repository<LensCoatingEntity>,
    @InjectRepository(LensVariantCoatingEntity)
    private readonly lensVariantCoatingRepository: Repository<LensVariantCoatingEntity>,
    @InjectRepository(LensVariantEntity)
    private readonly lensVariantRepository: Repository<LensVariantEntity>,
    private readonly lensService: LensService,
  ) {}

  async getLensCoatings(
    lensCoatingIds: number[] | undefined,
    lensIds: number[] | undefined,
    name: string | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<LensCoatingModel>> {
    const [lensCoatings, total] = await this.lensCoatingRepository.findAndCount(
      {
        where: {
          id: lensCoatingIds ? In(lensCoatingIds) : undefined,
          lensId: lensIds ? In(lensIds) : undefined,
          name: search ? Like(`%${search}%`) : name,
          deletedAt: IsNull(),
        },
        relations: relations,
        ...pagination?.toQuery(),
      },
    );

    return new PageList<LensCoatingModel>(
      total,
      lensCoatings.map((coating: LensCoatingEntity) => coating.toModel()),
    );
  }

  async getLensCoatingById(lensCoatingId: number): Promise<LensCoatingModel> {
    const lensCoating = await this.lensCoatingRepository.findOne({
      where: { id: lensCoatingId, deletedAt: IsNull() },
    });

    if (!lensCoating) {
      throw new HttpException('Lens coating not found', HttpStatus.NOT_FOUND);
    }

    return lensCoating.toModel();
  }

  async createLensCoating(
    lens: LensModel,
    name: string,
    price: number,
    description: string,
    reqUserId: number,
  ): Promise<LensCoatingModel> {
    await this.lensService.getLensById(lens.id);

    const entity = new LensCoatingEntity();
    entity.lensId = lens.id;
    entity.name = name;
    entity.price = price;
    entity.description = description;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedCoating = await this.lensCoatingRepository.save(entity);
    return savedCoating.toModel();
  }

  async updateLensCoating(
    lensCoating: LensCoatingModel,
    lensId: number | undefined,
    name: string | undefined,
    price: number | undefined,
    description: string | undefined,
    reqUserId: number,
  ): Promise<LensCoatingModel> {
    await this.lensCoatingRepository.update(
      { id: lensCoating.id, deletedAt: IsNull() },
      {
        lensId: lensId,
        name: name,
        price: price,
        description: description,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getLensCoatingById(lensCoating.id);
  }

  async deleteLensCoating(
    lensCoating: LensCoatingModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.lensCoatingRepository.update(
      { id: lensCoating.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async checkCoatingExistsForLens(
    lensCoating: LensCoatingModel,
    lens: LensModel,
  ): Promise<boolean> {
    const lensVariants = await this.lensVariantRepository.find({
      where: {
        lensId: lens.id,
        deletedAt: IsNull(),
      },
      select: ['id'],
    });

    if (lensVariants.length === 0) {
      return false;
    }

    const lensVariantIds = lensVariants.map((variant) => variant.id);

    // Check if this coating exists for any variant of this lens
    const existingCoatingRelation =
      await this.lensVariantCoatingRepository.findOne({
        where: {
          lensVariantId: In(lensVariantIds),
          lensCoatingId: lensCoating.id,
          deletedAt: IsNull(),
        },
      });

    return !!existingCoatingRelation;
  }
}
