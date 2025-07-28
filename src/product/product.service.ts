import { Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';
import { ProductModel } from './models/product.model';
import { ProductGenderType, ProductType } from './enum/product.type';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getProducts(
    productIds: number[] | undefined,
    categoryId: number | undefined,
    brandId: number | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<ProductModel>> {
    const [products, total] = await this.productRepository.findAndCount({
      where: {
        id: productIds ? In(productIds) : undefined,
        categoryId: categoryId ? categoryId : undefined,
        brandId: brandId ? brandId : undefined,
        productName: search ? Like(`%${search}%`) : undefined,
        deletedAt: IsNull(),
      },
      relations: relations,
      ...pagination?.toQuery(),
    });

    return new PageList<ProductModel>(
      total,
      products.map((product: ProductEntity) => product.toModel()),
    );
  }

  async getProductById(productId: number): Promise<ProductModel> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
        deletedAt: IsNull(),
      },
    });

    if (!product) {
      throw new Error(`Product not found`);
    }

    return product.toModel();
  }

  async createProduct(
    productName: string,
    categoryId: number,
    brandId: number,
    gender: ProductGenderType,
    price: number,
    stock: number,
    description: string,
    reqUserId: number,
  ): Promise<ProductModel> {
    const entity = new ProductEntity();
    entity.productName = productName;
    entity.categoryId = categoryId;
    entity.brandId = brandId;
    entity.gender = gender;
    entity.price = price;
    entity.stock = stock;
    entity.description = description;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    return await this.productRepository.save(entity);
  }

  async updateProduct(
    product: ProductModel,
    productType: ProductType | undefined,
    productName: string | undefined,
    categoryId: number | undefined,
    brandId: number | undefined,
    gender: ProductGenderType | undefined,
    price: number | undefined,
    stock: number | undefined,
    description: string | undefined,
    reqUserId: number,
  ): Promise<ProductModel> {
    await this.productRepository.update(
      { id: product.id, deletedAt: IsNull() },
      {
        productType: productType,
        productName: productName,
        categoryId: categoryId,
        brandId: brandId,
        gender: gender,
        price: price,
        stock: stock,
        description: description,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getProductById(product.id);
  }

  async deleteProduct(
    product: ProductModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.productRepository.update(
      { id: product.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );
    return true;
  }
}
