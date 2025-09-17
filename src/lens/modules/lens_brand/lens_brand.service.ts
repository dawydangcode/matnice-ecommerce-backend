import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LensBrandEntity } from './entities/lens-brand.entity';
import { In, IsNull, Like, Repository } from 'typeorm';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { LensBrandModel } from './models/lens-brand.model';
import { PageList } from 'src/common/models/page-list.model';

@Injectable()
export class LensBrandService {
  constructor(
    @InjectRepository(LensBrandEntity)
    private readonly lensBrandRepository: Repository<LensBrandEntity>,
  ) {}

  async getLensBrands(
    lensBrandIds: number[] | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<LensBrandModel>> {
    const [brands, total] = await this.lensBrandRepository.findAndCount({
      where: {
        id: lensBrandIds ? In(lensBrandIds) : undefined,
        name: search ? Like(`%${search}%`) : undefined,
        deletedAt: IsNull(),
      },
      relations: relations,
      ...pagination?.toQuery(),
    });

    return new PageList<LensBrandModel>(
      total,
      brands.map((lensBrand: LensBrandEntity) => lensBrand.toModel()),
    );
  }

  async getLensBrandsForFilter(): Promise<LensBrandModel[]> {
    const brands = await this.lensBrandRepository.find({
      where: {
        deletedAt: IsNull(),
      },
      order: { name: 'ASC' },
    });

    return brands.map((brand: LensBrandEntity) => brand.toModel());
  }

  async getLensBrandById(lensBrandId: number): Promise<LensBrandModel> {
    const brand = await this.lensBrandRepository.findOne({
      where: {
        id: lensBrandId,
        deletedAt: IsNull(),
      },
    });

    if (!brand) {
      throw new Error(`Lens brand with ID ${lensBrandId} not found`);
    }

    return brand.toModel();
  }

  async createLensBrand(
    name: string,
    description: string,
    reqUserId: number,
  ): Promise<LensBrandModel> {
    const entity = new LensBrandEntity();
    entity.name = name;
    entity.description = description;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    return await this.lensBrandRepository.save(entity);
  }

  async updateLensBrand(
    lensBrand: LensBrandModel,
    name: string | undefined,
    description: string | undefined,
    reqUserId: number,
  ): Promise<LensBrandModel> {
    await this.lensBrandRepository.update(
      { id: lensBrand.id },
      {
        name: name,
        description: description,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getLensBrandById(lensBrand.id);
  }

  async deleteBrand(
    lensBrand: LensBrandModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.lensBrandRepository.update(
      { id: lensBrand.id },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
