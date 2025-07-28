import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';
import { ProductImageEntity } from './entities/product-image.entity';
import { ProductImageModel } from './models/product-image.model';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { ProductModel } from 'src/product/models/product.model';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
    private readonly productService: ProductService,
  ) {}

  async getProductImages(
    productImageIds: number[] | undefined,
    productIds: number[] | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<ProductImageModel>> {
    const [productImages, total] =
      await this.productImageRepository.findAndCount({
        where: {
          id: productImageIds ? In(productImageIds) : undefined,
          productId: productIds ? In(productIds) : undefined,
          imageUrl: search ? Like(`%${search}%`) : undefined,
          deletedAt: IsNull(),
        },
        ...pagination?.toQuery(),
        relations: relations,
      });

    return new PageList<ProductImageModel>(
      total,
      productImages.map((productImage: ProductImageEntity) =>
        productImage.toModel(),
      ),
    );
  }

  async getProductImagesByProductId(
    productId: number,
    pagination: PaginationParamsModel | undefined,
  ): Promise<PageList<ProductImageModel>> {
    return this.getProductImages(
      undefined,
      [productId],
      pagination,
      undefined,
      undefined,
    );
  }

  async getProductImageById(
    productImageId: number,
  ): Promise<ProductImageModel> {
    const productImage = await this.productImageRepository.findOne({
      where: { id: productImageId, deletedAt: IsNull() },
    });

    if (!productImage) {
      throw new HttpException('Product image not found', HttpStatus.NOT_FOUND);
    }

    return productImage.toModel();
  }

  async createProductImage(
    productId: number,
    imageUrl: string,
    reqUserId: number,
  ): Promise<ProductImageModel> {
    const entity = new ProductImageEntity();
    entity.productId = productId;
    entity.imageUrl = imageUrl;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const newProductImage = await this.productImageRepository.save(entity);
    return await this.getProductImageById(newProductImage.id);
  }

  async updateProductImage(
    productImage: ProductImageModel,
    imageUrl: string | undefined,
    reqUserId: number,
  ): Promise<ProductImageModel> {
    await this.productImageRepository.update(
      {
        id: productImage.id,
        deletedAt: IsNull(),
      },
      {
        imageUrl: imageUrl ?? productImage.imageUrl,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return this.getProductImageById(productImage.id);
  }

  async deleteProductImage(
    productImage: ProductImageModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.productImageRepository.update(
      {
        id: productImage.id,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async deleteProductImagesByProductId(
    product: ProductModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.productImageRepository.update(
      {
        productId: product.id,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
