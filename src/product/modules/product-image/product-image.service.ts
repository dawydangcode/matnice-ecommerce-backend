import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';
import { ProductImageEntity } from './entities/product-image.entity';
import { ProductImageModel } from './models/product-image.model';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { AwsS3Service } from 'src/common/services/aws-s3.service';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
    private readonly awsS3Service: AwsS3Service,
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

  async uploadProductImage(
    productId: number,
    file: Express.Multer.File,
    reqUserId: number,
  ): Promise<ProductImageModel> {
    try {
      // Generate unique filename
      const fileName = this.awsS3Service.generateFileName(
        file.originalname,
        `product_${productId}`,
      );

      // Upload to S3
      const imageUrl = await this.awsS3Service.uploadFile(
        file.buffer,
        fileName,
        file.mimetype,
        'product-images',
      );

      // Save to database
      return await this.createProductImage(productId, imageUrl, reqUserId);
    } catch (error) {
      throw new HttpException(
        'Failed to upload image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProductImage(
    productImage: ProductImageModel,
    file: Express.Multer.File | undefined,
    reqUserId: number,
  ): Promise<ProductImageModel> {
    let newImageUrl = productImage.imageUrl;

    if (file) {
      try {
        // Delete old image from S3
        await this.awsS3Service.deleteFile(productImage.imageUrl);

        // Upload new image
        const fileName = this.awsS3Service.generateFileName(
          file.originalname,
          `product_${productImage.productId}`,
        );

        newImageUrl = await this.awsS3Service.uploadFile(
          file.buffer,
          fileName,
          file.mimetype,
          'product-images',
        );
      } catch (error) {
        throw new HttpException(
          'Failed to update image',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    await this.productImageRepository.update(
      {
        id: productImage.id,
        deletedAt: IsNull(),
      },
      {
        imageUrl: newImageUrl,
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
    try {
      // Delete from S3
      await this.awsS3Service.deleteFile(productImage.imageUrl);
    } catch (error) {
      console.error('Failed to delete image from S3:', error);
      // Continue with database deletion even if S3 deletion fails
    }

    // Soft delete from database
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
    productId: number,
    reqUserId: number,
  ): Promise<boolean> {
    await this.productImageRepository.update(
      {
        productId: productId,
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
