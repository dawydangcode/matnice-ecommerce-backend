import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';
import { ProductImageEntity } from './entities/product-image.entity';
import { ProductImageModel } from './models/product-image.model';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { AwsS3Service } from 'src/common/services/aws-s3.service';
import { ProductEntity } from '../../entities/product.entity';
import * as crypto from 'crypto';

@Injectable()
export class ProductImageService {
  private readonly isDevelopment = process.env.NODE_ENV !== 'production';

  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  private log(message: string, data?: any) {
    if (this.isDevelopment) {
      console.log(message, data || '');
    }
  }

  private logError(message: string, error?: any) {
    if (this.isDevelopment) {
      console.error(message, error || '');
    }
  }

  private async getProductInfo(productId: number): Promise<{
    folderPath: string;
    productName: string;
    sanitizedName: string;
  }> {
    try {
      const product = await this.productRepository.findOne({
        where: { id: productId },
      });

      if (!product) {
        throw new HttpException(
          `Product with ID ${productId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const sanitizedProductName = this.awsS3Service.sanitizeFolderName(
        product.productName,
      );

      // Kết hợp productName và productId
      const folderName = `${sanitizedProductName}-${productId}`;

      return {
        folderPath: `product-images/${folderName}`,
        productName: product.productName,
        sanitizedName: sanitizedProductName,
      };
    } catch (error) {
      this.logError('Error getting product info:', error);
      // Fallback to generic info if error
      return {
        folderPath: `product-images/product-${productId}`,
        productName: `Product ${productId}`,
        sanitizedName: `product-${productId}`,
      };
    }
  }

  private async getProductFolderPath(productId: number): Promise<string> {
    const productInfo = await this.getProductInfo(productId);
    return productInfo.folderPath;
  }

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

  private calculateFileHash(file: Express.Multer.File): string {
    return crypto.createHash('md5').update(file.buffer).digest('hex');
  }

  private validateImageFile(file: Express.Multer.File): void {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new HttpException(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (file.size > maxSize) {
      throw new HttpException(
        `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async checkDuplicateImage(
    productId: number,
    file: Express.Multer.File,
  ): Promise<ProductImageModel | undefined> {
    const fileHash = this.calculateFileHash(file);

    // Get all images for this product
    const existingImages = await this.productImageRepository.find({
      where: {
        productId: productId,
        deletedAt: IsNull(),
      },
    });

    // For exact duplicate detection, you would need to store file hash in database
    // For now, we'll check by filename pattern and file size
    const originalNameWithoutExt = file.originalname.split('.')[0];

    for (const image of existingImages) {
      // Check if same original filename exists
      if (image.imageUrl.includes(originalNameWithoutExt)) {
        this.log('Found potential duplicate by filename:', image.imageUrl);

        // Check if file actually exists on S3 and get metadata
        const metadata = await this.awsS3Service.getFileMetadataByUrl(
          image.imageUrl,
        );
        if (metadata && metadata.contentLength === file.size) {
          this.log('Confirmed duplicate by file size:', {
            existing: metadata.contentLength,
            new: file.size,
          });
          return await this.getProductImageById(image.id);
        }
      }
    }

    return undefined;
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
      this.log('Starting upload process...');
      this.log('ProductId:', productId);
      this.log('File info:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        bufferLength: file.buffer?.length,
      });

      // Validate file
      this.validateImageFile(file);

      // Check for duplicate image
      const existingImage = await this.checkDuplicateImage(productId, file);
      if (existingImage) {
        this.log(
          'Duplicate image found, returning existing:',
          existingImage.id,
        );
        return existingImage;
      }

      // Get product info (name, folder path)
      const productInfo = await this.getProductInfo(productId);
      this.log('Product info:', productInfo);

      // Generate unique filename using productName
      const fileName = this.awsS3Service.generateFileName(
        file.originalname,
        productInfo.sanitizedName,
      );
      this.log('Generated filename:', fileName);

      // Upload to S3 (với overwrite = false để check existing)
      this.log('Uploading to S3...');
      const imageUrl = await this.awsS3Service.uploadFile(
        file.buffer,
        fileName,
        file.mimetype,
        productInfo.folderPath, // Use product-specific folder
        false, // Don't overwrite existing files
      );
      this.log('S3 upload successful, URL:', imageUrl);

      // Save to database
      this.log('Saving to database...');
      const result = await this.createProductImage(
        productId,
        imageUrl,
        reqUserId,
      );
      this.log('Database save successful');

      return result;
    } catch (error) {
      this.logError('Upload error:', error);

      if (error instanceof Error) {
        this.logError('Error message:', error.message);
        this.logError('Error stack:', error.stack);
        throw new HttpException(
          `Failed to upload image: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

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
        this.log('Updating product image:', productImage.id);
        this.log('New file info:', {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        });

        // Check if the new file is the same as current (optional optimization)
        const existingImage = await this.checkDuplicateImage(
          productImage.productId,
          file,
        );
        if (existingImage && existingImage.id !== productImage.id) {
          throw new HttpException(
            'This image already exists for this product',
            HttpStatus.CONFLICT,
          );
        }

        // Delete old image from S3
        this.log('Deleting old image from S3...');
        const deleteResult = await this.awsS3Service.deleteFile(
          productImage.imageUrl,
        );
        this.log('Delete result:', deleteResult);

        // Get product info for update
        const productInfo = await this.getProductInfo(productImage.productId);
        this.log('Product info for update:', productInfo);

        // Upload new image with product name
        const fileName = this.awsS3Service.generateFileName(
          file.originalname,
          productInfo.sanitizedName,
        );

        this.log('Uploading new image to S3...');
        newImageUrl = await this.awsS3Service.uploadFile(
          file.buffer,
          fileName,
          file.mimetype,
          productInfo.folderPath, // Use product-specific folder
          true, // Overwrite when updating
        );
        this.log('New image uploaded, URL:', newImageUrl);
      } catch (error) {
        this.logError('Update image error:', error);

        if (error instanceof HttpException) {
          throw error;
        }

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
