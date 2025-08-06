import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ProductColorEntity } from './entities/product-color.entity';
import { ProductColorModel } from './models/product-color.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';

@Injectable()
export class ProductColorService {
  constructor(
    @InjectRepository(ProductColorEntity)
    private readonly productColorRepository: Repository<ProductColorEntity>,
  ) {}

  async getProductColors(
    productId?: number,
    pagination?: PaginationParamsModel,
  ): Promise<PageList<ProductColorModel>> {
    const [productColors, total] =
      await this.productColorRepository.findAndCount({
        where: {
          productId: productId,
          deletedAt: IsNull(),
        },
        relations: ['productDetails', 'productImages'],
        ...pagination?.toQuery(),
      });

    return new PageList<ProductColorModel>(
      total,
      productColors.map((color) => color.toModel()),
    );
  }

  async getProductColorById(id: number): Promise<ProductColorModel> {
    const productColor = await this.productColorRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['productDetails', 'productImages'],
    });

    if (!productColor) {
      throw new Error('Product color not found');
    }

    return productColor.toModel();
  }

  async createProductColor(
    productId: number,
    colorName: string,
    reqUserId: number,
  ): Promise<ProductColorModel> {
    const entity = new ProductColorEntity();
    entity.productId = productId;
    entity.colorName = colorName;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedProductColor = await this.productColorRepository.save(entity);
    return savedProductColor.toModel();
  }

  async updateProductColor(
    productColor: ProductColorModel,
    colorName: string | undefined,
    reqUserId: number,
  ): Promise<ProductColorModel> {
    await this.productColorRepository.update(
      { id: productColor.id, deletedAt: IsNull() },
      {
        colorName,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getProductColorById(productColor.id);
  }

  async deleteProductColor(id: number, reqUserId: number): Promise<boolean> {
    await this.productColorRepository.update(
      { id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
