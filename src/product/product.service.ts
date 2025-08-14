import { Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository, LessThan } from 'typeorm';
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

    // Load categories for each product
    const productsWithCategories = await Promise.all(
      products.map(async (product: ProductEntity) => {
        const model = product.toModel();

        // Load categories for this product
        const categoryIds =
          await this.productCategoryService.getCategoriesByProductId(
            product.id,
          );
        if (categoryIds.length > 0) {
          // You might want to load the actual category entities here
          (model as any).categoryIds = categoryIds;
        }

        return model;
      }),
    );

    return new PageList<ProductModel>(total, productsWithCategories);
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
    description: string,
    isSustainable: boolean,
    isNew: boolean,
    isBoutique: boolean,
    categoryIds: number[] | undefined,
    reqUserId: number,
  ): Promise<ProductModel> {
    const entity = new ProductEntity();
    entity.productType = productType;
    entity.productName = productName;
    entity.brandId = brandId;
    entity.gender = gender;
    entity.price = price;
    entity.description = description;
    entity.isSustainable = isSustainable;
    entity.isNew = isNew;
    entity.isBoutique = isBoutique;

    if (isNew) {
      const newUntilDate = new Date();
      newUntilDate.setDate(newUntilDate.getDate() + 30);
      entity.newUntil = newUntilDate;
    }

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
    description: string | undefined,
    isSustainable: boolean | undefined,
    isNew: boolean | undefined,
    isBoutique: boolean | undefined,
    reqUserId: number,
  ): Promise<ProductModel> {
    const updateData: any = {
      productType: productType,
      productName: productName,
      brandId: brandId,
      gender: gender,
      price: price,
      description: description,
      isSustainable: isSustainable,
      isNew: isNew,
      isBoutique: isBoutique,
      updatedAt: new Date(),
      updatedBy: reqUserId,
    };

    // Nếu isNew được cập nhật thành true, set newUntil là 30 ngày từ bây giờ
    if (isNew === true) {
      const newUntilDate = new Date();
      newUntilDate.setDate(newUntilDate.getDate() + 30);
      updateData.newUntil = newUntilDate;
    } else if (isNew === false) {
      // Nếu isNew = false, xóa newUntil bằng cách set thành undefined
      updateData.newUntil = undefined;
    }

    await this.productRepository.update(
      { id: product.id, deletedAt: IsNull() },
      updateData,
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

  async updateExpiredNewProducts(): Promise<number> {
    const now = new Date();

    const result = await this.productRepository.update(
      {
        isNew: true,
        newUntil: LessThan(now),
        deletedAt: IsNull(),
      },
      {
        isNew: false,
        updatedAt: now,
      },
    );

    return result.affected || 0;
  }

  /**
   * Lấy danh sách sản phẩm sắp hết hạn "new" (còn 3 ngày)
   */
  async getProductsExpiringSoon(): Promise<ProductModel[]> {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const products = await this.productRepository.find({
      where: {
        isNew: true,
        newUntil: LessThan(threeDaysFromNow),
        deletedAt: IsNull(),
      },
      relations: ['brand'],
    });

    return products.map((product) => product.toModel());
  }

  /**
   * Get all products for card display with thumbnail image, brand, product name + variant, price
   * Returns products with thumbnail image (order 'a'), brand name, product name + variant name, and price
   */
  async getProductsForCardDisplay(
    pagination: PaginationParamsModel | undefined,
    productTypeIds: number[] | undefined,
    brandIds: number[] | undefined,
    categoryIds: number[] | undefined,
    genderFilter: ProductGenderType[] | undefined,
    priceRange: { min?: number; max?: number } | undefined,
    searchQuery: string | undefined,
    sortBy: 'price' | 'name' | 'newest' | undefined,
    sortOrder: 'ASC' | 'DESC' | undefined,
    frameType?: string[],
    frameShape?: string[],
    frameMaterial?: string[],
    bridgeDesign?: string[],
    style?: string[],
    frameWidthMin?: number,
    frameWidthMax?: number,
  ): Promise<PageList<any>> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.productColors', 'productColors')
      .leftJoin('product.productDetail', 'productDetail')
      .leftJoin(
        'product_image',
        'thumbnailImage',
        'thumbnailImage.product_id = product.id AND thumbnailImage.image_order = :imageOrder AND thumbnailImage.deleted_at IS NULL',
        { imageOrder: 'a' },
      )
      .addSelect(['thumbnailImage.image_url as thumbnailUrl'])
      // Select thêm các trường productDetail
      .addSelect([
        'productDetail.id as productDetailId',
        'productDetail.product_id as productDetailProductId',
        'productDetail.bridge_width as bridgeWidth',
        'productDetail.frame_width as frameWidth',
        'productDetail.lens_height as lensHeight',
        'productDetail.lens_width as lensWidth',
        'productDetail.temple_length as templeLength',
        'productDetail.frame_material as frameMaterial',
        'productDetail.frame_shape as frameShape',
        'productDetail.frame_type as frameType',
        'productDetail.bridge_design as bridgeDesign',
        'productDetail.style as style',
        'productDetail.spring_hinges as springHinges',
        'productDetail.weight as weight',
        'productDetail.multifocal as multifocal',
        'productDetail.created_at as createdAt',
        'productDetail.created_by as createdBy',
        'productDetail.updated_at as updatedAt',
        'productDetail.updated_by as updatedBy',
        'productDetail.deleted_at as deletedAt',
        'productDetail.deleted_by as deletedBy',
      ])
      .where('product.deletedAt IS NULL');

    // Remove the productColors.deletedAt IS NULL condition as it might be filtering out products without colors

    // Add filters
    if (productTypeIds && productTypeIds.length > 0) {
      queryBuilder.andWhere('product.productType IN (:...productTypes)', {
        productTypes: productTypeIds,
      });
    }

    if (brandIds && brandIds.length > 0) {
      queryBuilder.andWhere('product.brandId IN (:...brands)', {
        brands: brandIds,
      });
    }

    if (categoryIds && categoryIds.length > 0) {
      queryBuilder
        .leftJoin('product.productDetail', 'productDetail')
        .leftJoin('productDetail.category', 'category')
        .andWhere('category.id IN (:...categories)', {
          categories: categoryIds,
        });
    }

    if (genderFilter) {
      if (Array.isArray(genderFilter) && genderFilter.length > 0) {
        queryBuilder.andWhere('product.gender IN (:...genders)', {
          genders: genderFilter,
        });
      } else if (typeof genderFilter === 'string' && genderFilter) {
        queryBuilder.andWhere('product.gender = :gender', {
          gender: genderFilter,
        });
      }
    }

    if (priceRange) {
      if (priceRange.min !== undefined) {
        queryBuilder.andWhere('product.price >= :minPrice', {
          minPrice: priceRange.min,
        });
      }
      if (priceRange.max !== undefined) {
        queryBuilder.andWhere('product.price <= :maxPrice', {
          maxPrice: priceRange.max,
        });
      }
    }

    // Filter productDetail
    if (frameType && frameType.length > 0) {
      queryBuilder.andWhere('productDetail.frame_type IN (:...frameTypes)', {
        frameTypes: frameType,
      });
    }
    if (frameShape && frameShape.length > 0) {
      queryBuilder.andWhere('productDetail.frame_shape IN (:...frameShapes)', {
        frameShapes: frameShape,
      });
    }
    if (frameMaterial && frameMaterial.length > 0) {
      queryBuilder.andWhere(
        'productDetail.frame_material IN (:...frameMaterials)',
        {
          frameMaterials: frameMaterial,
        },
      );
    }
    if (bridgeDesign && bridgeDesign.length > 0) {
      queryBuilder.andWhere(
        'productDetail.bridge_design IN (:...bridgeDesigns)',
        {
          bridgeDesigns: bridgeDesign,
        },
      );
    }
    if (style && style.length > 0) {
      queryBuilder.andWhere('productDetail.style IN (:...styles)', {
        styles: style,
      });
    }
    // Add frameWidthMin/frameWidthMax filter
    if (frameWidthMin !== undefined) {
      queryBuilder.andWhere('productDetail.frame_width >= :frameWidthMin', {
        frameWidthMin,
      });
    }
    if (frameWidthMax !== undefined) {
      queryBuilder.andWhere('productDetail.frame_width <= :frameWidthMax', {
        frameWidthMax,
      });
    }

    if (searchQuery) {
      queryBuilder.andWhere(
        '(product.productName LIKE :search OR product.description LIKE :search OR brand.name LIKE :search)',
        { search: `%${searchQuery}%` },
      );
    }

    // Add sorting
    switch (sortBy) {
      case 'price':
        queryBuilder.orderBy('product.price', sortOrder || 'ASC');
        break;
      case 'name':
        queryBuilder.orderBy('product.productName', sortOrder || 'ASC');
        break;
      case 'newest':
        queryBuilder.orderBy('product.createdAt', 'DESC');
        break;
      default:
        queryBuilder.orderBy('product.id', 'DESC');
    }

    // Add pagination
    if (pagination) {
      const query = pagination.toQuery();
      queryBuilder.skip(query.skip).take(query.take);
    }

    // Get total count first
    const totalQueryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.productColors', 'productColors')
      .leftJoin('product.productDetail', 'productDetail')
      .where('product.deletedAt IS NULL');

    // Apply same filters for count
    if (productTypeIds && productTypeIds.length > 0) {
      totalQueryBuilder.andWhere('product.productType IN (:...productTypes)', {
        productTypes: productTypeIds,
      });
    }

    if (brandIds && brandIds.length > 0) {
      totalQueryBuilder.andWhere('product.brandId IN (:...brands)', {
        brands: brandIds,
      });
    }

    if (categoryIds && categoryIds.length > 0) {
      totalQueryBuilder
        .leftJoin('productDetail.category', 'category')
        .andWhere('category.id IN (:...categories)', {
          categories: categoryIds,
        });
    }

    if (genderFilter) {
      if (Array.isArray(genderFilter) && genderFilter.length > 0) {
        totalQueryBuilder.andWhere('product.gender IN (:...genders)', {
          genders: genderFilter,
        });
      } else if (typeof genderFilter === 'string' && genderFilter) {
        totalQueryBuilder.andWhere('product.gender = :gender', {
          gender: genderFilter,
        });
      }
    }

    if (priceRange) {
      if (priceRange.min !== undefined) {
        totalQueryBuilder.andWhere('product.price >= :minPrice', {
          minPrice: priceRange.min,
        });
      }
      if (priceRange.max !== undefined) {
        totalQueryBuilder.andWhere('product.price <= :maxPrice', {
          maxPrice: priceRange.max,
        });
      }
    }
    // Add frameWidthMin/frameWidthMax filter for count
    if (frameWidthMin !== undefined) {
      totalQueryBuilder.andWhere(
        'productDetail.frame_width >= :frameWidthMin',
        {
          frameWidthMin,
        },
      );
    }
    if (frameWidthMax !== undefined) {
      totalQueryBuilder.andWhere(
        'productDetail.frame_width <= :frameWidthMax',
        {
          frameWidthMax,
        },
      );
    }

    if (searchQuery) {
      totalQueryBuilder
        .leftJoin('product.brand', 'brandForSearch')
        .andWhere(
          '(product.productName LIKE :search OR product.description LIKE :search OR brandForSearch.name LIKE :search)',
          { search: `%${searchQuery}%` },
        );
    }

    const total = await totalQueryBuilder.getCount();

    // Get the actual data with getRawMany to include addSelect fields
    const rawResults = await queryBuilder.getRawMany();

    // Log the first result to see the structure
    if (rawResults.length > 0) {
      console.log('Raw result structure:', Object.keys(rawResults[0]));
      console.log('First raw result:', rawResults[0]);
    }

    // Transform raw results to proper format
    const productCards = rawResults.map((row: any) => {
      const displayName =
        row.productColors_productVariantName ||
        row.productColors_product_variant_name
          ? `${row.product_productName || row.product_product_name} ${row.productColors_productVariantName || row.productColors_product_variant_name}`
          : row.product_productName || row.product_product_name;

      return {
        id: row.product_id,
        productName: row.product_productName || row.product_product_name,
        displayName: displayName,
        brandName: row.brand_name || 'Unknown Brand',
        price: row.product_price,
        thumbnailUrl: row.thumbnailUrl || null,
        // Additional useful info for cards
        productType: row.product_productType || row.product_product_type,
        gender: row.product_gender,
        isNew: row.product_isNew || row.product_is_new,
        isBoutique: row.product_isBoutique || row.product_is_boutique,
        isSustainable: row.product_isSustainable || row.product_is_sustainable,
        // Variant info
        variantName:
          row.productColors_productVariantName ||
          row.productColors_product_variant_name ||
          null,
        colorName:
          row.productColors_colorName || row.productColors_color_name || null,
        stock: row.productColors_stock || 0,
        totalVariants: 1, // We'll calculate this properly later
        // Thông tin productDetail
        productDetail: {
          id: row.productDetailId || null,
          productId: row.productDetailProductId || null,
          bridgeWidth: row.bridgeWidth || null,
          frameWidth: row.frameWidth || null,
          lensHeight: row.lensHeight || null,
          lensWidth: row.lensWidth || null,
          templeLength: row.templeLength || null,
          frameMaterial: row.frameMaterial || null,
          frameShape: row.frameShape || null,
          frameType: row.frameType || null,
          bridgeDesign: row.bridgeDesign || null,
          style: row.style || null,
          springHinges: row.springHinges || null,
          weight: row.weight || null,
          multifocal: row.multifocal || null,
          createdAt: row.createdAt || null,
          createdBy: row.createdBy || null,
          updatedAt: row.updatedAt || null,
          updatedBy: row.updatedBy || null,
          deletedAt: row.deletedAt || null,
          deletedBy: row.deletedBy || null,
        },
      };
    });

    return new PageList<any>(total, productCards);
  }
}
