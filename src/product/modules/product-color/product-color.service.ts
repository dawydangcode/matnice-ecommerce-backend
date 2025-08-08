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

  async getProductColorById(
    productColorId: number,
  ): Promise<ProductColorModel> {
    const productColor = await this.productColorRepository.findOne({
      where: { id: productColorId, deletedAt: IsNull() },
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
    productVariantName: string,
    productNumber: string,
    stock: number,
    isThumbnail: boolean,
    reqUserId: number,
  ): Promise<ProductColorModel> {
    const entity = new ProductColorEntity();
    entity.productId = productId;
    entity.colorName = colorName;
    entity.productVariantName = productVariantName;
    entity.productNumber = productNumber;
    entity.stock = stock;
    entity.isThumbnail = isThumbnail;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedProductColor = await this.productColorRepository.save(entity);
    return savedProductColor.toModel();
  }

  async updateProductColor(
    productColor: ProductColorModel,
    colorName: string | undefined,
    productVariantName: string | undefined,
    productNumber: string | undefined,
    stock: number | undefined,
    isThumbnail: boolean | undefined,
    reqUserId: number,
  ): Promise<ProductColorModel> {
    await this.productColorRepository.update(
      { id: productColor.id, deletedAt: IsNull() },
      {
        colorName: colorName,
        productVariantName: productVariantName,
        productNumber: productNumber,
        stock: stock,
        isThumbnail: isThumbnail,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getProductColorById(productColor.id);
  }

  async deleteProductColor(
    productColor: ProductColorModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.productColorRepository.update(
      { id: productColor.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async getProductColorByProductId(
    productId: number,
  ): Promise<ProductColorModel[]> {
    const productColors = await this.productColorRepository.find({
      where: { productId: productId, deletedAt: IsNull() },
      relations: ['productDetails', 'productImages'],
    });

    return productColors.map((color) => color.toModel());
  }
}
