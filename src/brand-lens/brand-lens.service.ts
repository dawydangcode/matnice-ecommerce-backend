import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';
import { BrandLensEntity } from './entities/brand-lens.entity';
import { BrandLensModel } from './models/brand-lens.model';
import { BrandModel } from 'src/brand/models/brand.model';

@Injectable()
export class BrandLensService {
  constructor(
    @InjectRepository(BrandLensEntity)
    private readonly brandLensRepository: Repository<BrandLensEntity>,
  ) {}

  async getBrandsLens(
    brandLensIds: number[] | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<BrandLensModel>> {
    const [brandsLens, total] = await this.brandLensRepository.findAndCount({
      where: {
        id: brandLensIds ? In(brandLensIds) : undefined,
        name: search ? Like(`%${search}%`) : undefined,
        deletedAt: IsNull(),
      },
      relations: relations,
      ...pagination?.toQuery(),
    });

    return new PageList<BrandLensModel>(
      total,
      brandsLens.map((brandLens: BrandLensEntity) => brandLens.toModel()),
    );
  }

  async getBrandsLensForFilter(): Promise<BrandLensModel[]> {
    const brandsLens = await this.brandLensRepository.find({
      where: {
        deletedAt: IsNull(),
      },
      order: { name: 'ASC' },
    });

    return brandsLens.map((brandLens: BrandLensEntity) => brandLens.toModel());
  }

  async getBrandLensById(brandLensId: number): Promise<BrandLensModel> {
    const brandLens = await this.brandLensRepository.findOne({
      where: {
        id: brandLensId,
        deletedAt: IsNull(),
      },
    });

    if (!brandLens) {
      throw new Error(`Brand with ID ${brandLensId} not found`);
    }

    return brandLens.toModel();
  }

  async createBrandLens(
    name: string,
    description: string,
    reqUserId: number,
  ): Promise<BrandLensModel> {
    const entity = new BrandLensEntity();
    entity.name = name;
    entity.description = description;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    return await this.brandLensRepository.save(entity);
  }

  async updateBrandLens(
    brandLens: BrandLensModel,
    name: string | undefined,
    description: string | undefined,
    reqUserId: number,
  ): Promise<BrandLensModel> {
    await this.brandLensRepository.update(
      { id: brandLens.id },
      {
        name: name,
        description: description,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getBrandLensById(brandLens.id);
  }

  async deleteBrand(
    brandLens: BrandLensModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.brandLensRepository.update(
      { id: brandLens.id },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
