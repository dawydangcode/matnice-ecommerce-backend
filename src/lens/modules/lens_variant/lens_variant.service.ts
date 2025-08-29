import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { LensVariantEntity } from './entities/lens_variant.entity';
import { LensVariantModel } from './models/lens_variant.model';
import {} from './dtos/lens_variant.dto';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { LensMaterialsType } from './enum/lens-materials.type';
import { LensDesignType } from './enum/lens_design.type';

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

  async getLensVariants(
    lensVariantIds: number[] | undefined,
    lensId: number | undefined,
    lensThicknessId: number | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<LensVariantModel>> {
    const [variants, total] = await this.lensVariantRepository.findAndCount({
      where: {
        id: lensVariantIds ? In(lensVariantIds) : undefined,
        lensId: lensId,
        lensThicknessId: lensThicknessId,
        deletedAt: IsNull(),
      },
      relations: relations,
      ...pagination?.toQuery(),
    });

    return new PageList<LensVariantModel>(
      total,
      variants.map((variant: LensVariantEntity) => variant.toModel()),
    );
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

  async createLensVariant(
    lensId: number,
    lensThicknessId: number,
    design: LensDesignType,
    material: LensMaterialsType,
    price: number,
    stock: number,
    reqUserId: number,
  ): Promise<LensVariantModel> {
    const entity = new LensVariantEntity();
    entity.lensId = lensId;
    entity.lensThicknessId = lensThicknessId;
    entity.design = design;
    entity.material = material;
    entity.price = price;
    entity.stock = stock;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedVariant = await this.lensVariantRepository.save(entity);
    return savedVariant.toModel();
  }

  async update(
    lensVariant: LensVariantModel,
    lensId: number | undefined,
    lensThicknessId: number | undefined,
    design: LensDesignType | undefined,
    material: LensMaterialsType | undefined,
    price: number | undefined,
    stock: number | undefined,
    reqUserId: number,
  ): Promise<LensVariantModel> {
    await this.lensVariantRepository.update(
      { id: lensVariant.id, deletedAt: IsNull() },
      {
        lensId: lensId,
        lensThicknessId: lensThicknessId,
        design: design,
        material: material,
        price: price,
        stock: stock,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.findById(lensVariant.id);
  }

  async deleteLensVariant(
    lensVariant: LensVariantModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.lensVariantRepository.update(
      { id: lensVariant.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
