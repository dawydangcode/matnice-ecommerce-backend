import { Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';
import { ProductModel } from './models/product.model';
import { ProductGenderType, ProductType } from './enum/product.type';
import { ProductCategoryService } from './modules/product-category/product-category.service';
import { ProductThicknessCompatibilityService } from './modules/product-thickness-compatibility/product-thickness-compatibility.service';
import { ProductColorService } from './modules/product-color/product-color.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly productCategoryService: ProductCategoryService,
    private readonly productThicknessCompatibilityService: ProductThicknessCompatibilityService,
    private readonly productColorService: ProductColorService,
  ) {}

  async getProducts(
    productIds: number[] | undefined,
    brandId: number | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<ProductModel>> {
    const [products, total] = await this.productRepository.findAndCount({
      where: {
        id: productIds ? In(productIds) : undefined,
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

  async getProductWithCategories(productId: number): Promise<{
    product: ProductModel;
    categoryIds: number[];
  }> {
    const product = await this.getProductById(productId);
    const categoryIds =
      await this.productCategoryService.getCategoriesByProductId(productId);

    return {
      product,
      categoryIds,
    };
  }

  async createProduct(
    productName: string,
    productType: ProductType,
    brandId: number,
    gender: ProductGenderType,
    price: number,
    stock: number,
    description: string,
    isSustainable: boolean,
    categoryIds: number[] | undefined,
    reqUserId: number,
  ): Promise<ProductModel> {
    const entity = new ProductEntity();
    entity.productType = productType;
    entity.productName = productName;
    entity.brandId = brandId;
    entity.gender = gender;
    entity.price = price;
    entity.stock = stock;
    entity.description = description;
    entity.isSustainable = isSustainable;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;
    entity.updatedAt = new Date();
    entity.updatedBy = reqUserId;

    const savedProduct = await this.productRepository.save(entity);

    // Tạo product-category relationships nếu có categoryIds
    if (categoryIds && categoryIds.length > 0) {
      await Promise.all(
        categoryIds.map((categoryId) =>
          this.productCategoryService.createProductCategory(
            savedProduct.id,
            categoryId,
            reqUserId,
          ),
        ),
      );
    }

    return savedProduct.toModel();
  }

  async updateProduct(
    product: ProductModel,
    productType: ProductType | undefined,
    productName: string | undefined,
    brandId: number | undefined,
    gender: ProductGenderType | undefined,
    price: number | undefined,
    stock: number | undefined,
    description: string | undefined,
    isSustainable: boolean | undefined,
    reqUserId: number,
  ): Promise<ProductModel> {
    await this.productRepository.update(
      { id: product.id, deletedAt: IsNull() },
      {
        productType: productType,
        productName: productName,
        brandId: brandId,
        gender: gender,
        price: price,
        stock: stock,
        description: description,
        isSustainable: isSustainable,
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
