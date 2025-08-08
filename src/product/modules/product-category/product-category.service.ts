import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ProductCategoryEntity } from './entities/product-category.entity';
import { ProductCategoryModel } from './models/product-category.model';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly productCategoryRepository: Repository<ProductCategoryEntity>,
  ) {}

  async getProductCategories(
    productId?: number,
    categoryId?: number,
  ): Promise<ProductCategoryModel[]> {
    const productCategories = await this.productCategoryRepository.find({
      where: {
        productId: productId,
        categoryId: categoryId,
        deletedAt: IsNull(),
      },
      relations: ['product', 'category'],
    });

    return productCategories.map((pc) => pc.toModel());
  }

  async getCategoriesByProductId(productId: number): Promise<number[]> {
    const productCategories = await this.productCategoryRepository.find({
      where: {
        productId: productId,
        deletedAt: IsNull(),
      },
    });

    return productCategories.map((pc) => pc.categoryId);
  }

  async getCategoriesWithDetailsByProductId(productId: number): Promise<any[]> {
    const productCategories = await this.productCategoryRepository.find({
      where: {
        productId: productId,
        deletedAt: IsNull(),
      },
      relations: ['category'],
    });

    return productCategories
      .filter((pc) => pc.category) // Ensure category exists
      .map((pc) => (pc.category ? pc.category.toModel() : null))
      .filter((category) => category !== null);
  }

  async getProductsByCategoryId(categoryId: number): Promise<number[]> {
    const productCategories = await this.productCategoryRepository.find({
      where: {
        categoryId: categoryId,
        deletedAt: IsNull(),
      },
    });

    return productCategories.map((pc) => pc.productId);
  }

  async createProductCategory(
    productId: number,
    categoryId: number,
    reqUserId: number,
  ): Promise<ProductCategoryModel> {
    // Check if relationship already exists
    const existing = await this.productCategoryRepository.findOne({
      where: {
        productId: productId,
        categoryId: categoryId,
        deletedAt: IsNull(),
      },
    });

    if (existing) {
      throw new HttpException(
        'Product category relationship already exists',
        HttpStatus.CONFLICT,
      );
    }

    const entity = new ProductCategoryEntity();
    entity.productId = productId;
    entity.categoryId = categoryId;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedEntity = await this.productCategoryRepository.save(entity);
    return savedEntity.toModel();
  }

  async deleteProductCategory(
    productId: number,
    categoryId: number,
    reqUserId: number,
  ): Promise<boolean> {
    const productCategory = await this.productCategoryRepository.findOne({
      where: {
        productId: productId,
        categoryId: categoryId,
        deletedAt: IsNull(),
      },
    });

    if (!productCategory) {
      throw new HttpException(
        'Product category relationship not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.productCategoryRepository.update(
      {
        id: productCategory.id,
      },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async updateProductCategories(
    productId: number,
    categoryIds: number[],
    reqUserId: number,
  ): Promise<ProductCategoryModel[]> {
    // Delete existing relationships
    await this.productCategoryRepository.update(
      {
        productId: productId,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    // Create new relationships
    const productCategories: ProductCategoryModel[] = [];
    for (const categoryId of categoryIds) {
      try {
        const pc = await this.createProductCategory(
          productId,
          categoryId,
          reqUserId,
        );
        productCategories.push(pc);
      } catch (error) {
        // Skip if relationship already exists
        if (
          error instanceof HttpException &&
          error.getStatus() === HttpStatus.CONFLICT
        ) {
          continue;
        }
        throw error;
      }
    }

    return productCategories;
  }

  async validateProductCategory(
    productId: number,
    categoryId: number,
  ): Promise<boolean> {
    const exists = await this.productCategoryRepository.findOne({
      where: {
        productId: productId,
        categoryId: categoryId,
        deletedAt: IsNull(),
      },
    });

    return !!exists;
  }
}
