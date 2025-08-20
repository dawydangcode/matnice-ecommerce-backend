import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from './entities/brand.entity';
import { In, IsNull, Like, Repository } from 'typeorm';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';
import { BrandModel } from './models/brand.model';
import { BrandType } from './enum/brand.type';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) {}

  async getBrands(
    brandIds: number[] | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<BrandModel>> {
    const [brands, total] = await this.brandRepository.findAndCount({
      where: {
        id: brandIds ? In(brandIds) : undefined,
        name: search ? Like(`%${search}%`) : undefined,
        deletedAt: IsNull(),
      },
      relations: relations,
      ...pagination?.toQuery(),
    });

    return new PageList<BrandModel>(
      total,
      brands.map((brand: BrandEntity) => brand.toModel()),
    );
  }

  async getBrandsForFilter(): Promise<BrandModel[]> {
    const brands = await this.brandRepository.find({
      where: {
        deletedAt: IsNull(),
      },
      order: { name: 'ASC' },
    });

    return brands.map((brand: BrandEntity) => brand.toModel());
  }

  async getBrandById(brandId: number): Promise<BrandModel> {
    const brand = await this.brandRepository.findOne({
      where: {
        id: brandId,
        deletedAt: IsNull(),
      },
    });

    if (!brand) {
      throw new Error(`Brand with ID ${brandId} not found`);
    }

    return brand.toModel();
  }

  async createBrand(
    name: string,
    type: BrandType,
    description: string,
    reqUserId: number,
  ): Promise<BrandModel> {
    const entity = new BrandEntity();
    entity.name = name;
    entity.type = type;
    entity.description = description;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    return await this.brandRepository.save(entity);
  }

  async updateBrand(
    brand: BrandModel,
    name: string | undefined,
    type: BrandType | undefined,
    description: string | undefined,
    reqUserId: number,
  ): Promise<BrandModel> {
    await this.brandRepository.update(
      { id: brand.id },
      {
        name: name,
        type: type,
        description: description,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getBrandById(brand.id);
  }

  async deleteBrand(brand: BrandModel, reqUserId: number): Promise<boolean> {
    await this.brandRepository.update(
      { id: brand.id },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
