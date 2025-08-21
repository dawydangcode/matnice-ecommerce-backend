import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Like, In } from 'typeorm';
import { LensCoatingEntity } from './entities/lens_coating.entity';
import { LensCoatingModel } from './models/lens_coating.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';
import { LensCategoryModel } from '../lens_category/models/lens_category.model';

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

  async getLensCoatings(
    lensCoatingIds: number[] | undefined,
    name: string | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<LensCoatingModel>> {
    const [lensCoatings, total] = await this.lensCoatingRepository.findAndCount(
      {
        where: {
          id: lensCoatingIds ? In(lensCoatingIds) : undefined,
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
    name: string,
    price: number,
    description: string,
    reqUserId: number,
  ): Promise<LensCoatingModel> {
    const entity = new LensCoatingEntity();
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
    name: string | undefined,
    price: number | undefined,
    description: string | undefined,
    reqUserId: number,
  ): Promise<LensCoatingModel> {
    await this.lensCoatingRepository.update(
      { id: lensCoating.id, deletedAt: IsNull() },
      {
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
}
