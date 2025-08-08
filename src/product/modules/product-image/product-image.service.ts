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

  /**
   * Get product color folder path for S3 storage
   * Structure: product_image/{productNumber}/
   */
  private async getProductColorFolderPath(
    productNumber: string,
  ): Promise<string> {
    return `product_image/${productNumber}`;
  }

  /**
   * Generate filename for product color image
   * Format: {productNumber}_{imageOrder}.{extension}
   */
  private generateColorImageFileName(
    productNumber: string,
    imageOrder: 'a' | 'b' | 'c' | 'd' | 'e',
    originalFileName: string,
  ): string {
    const extension = originalFileName.split('.').pop()?.toLowerCase() || 'jpg';
    return `${productNumber}_${imageOrder}.${extension}`;
  }

  /**
   * Validate image order
   */
  private validateImageOrder(imageOrder: string): 'a' | 'b' | 'c' | 'd' | 'e' {
    const validOrders: Array<'a' | 'b' | 'c' | 'd' | 'e'> = [
      'a',
      'b',
      'c',
      'd',
      'e',
    ];
    if (!validOrders.includes(imageOrder as any)) {
      throw new HttpException(
        `Invalid image order. Must be one of: ${validOrders.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return imageOrder as 'a' | 'b' | 'c' | 'd' | 'e';
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
    productColorId?: number,
    imageOrder?: string,
  ): Promise<ProductImageModel> {
    const entity = new ProductImageEntity();
    entity.productId = productId;
    entity.imageUrl = imageUrl;
    entity.productColorId = productColorId;
    entity.imageOrder = imageOrder;
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
        undefined, // no productColorId for regular images
        undefined, // no imageOrder for regular images
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

  async uploadTemporaryImage(
    file: Express.Multer.File,
    reqUserId: number,
  ): Promise<string> {
    try {
      this.log('Starting temporary upload process...');
      this.log('File info:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        bufferLength: file.buffer?.length,
      });

      // Validate file
      this.validateImageFile(file);

      // Generate unique filename for temporary upload
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension =
        file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `temp_${timestamp}_${randomString}.${extension}`;

      this.log('Generated temporary filename:', fileName);

      // Upload to S3 in temporary folder
      this.log('Uploading to S3 temporary folder...');
      const imageUrl = await this.awsS3Service.uploadFile(
        file.buffer,
        fileName,
        file.mimetype,
        'temporary-uploads', // Temporary folder
        true, // Allow overwrite for temporary files
      );
      this.log('S3 temporary upload successful, URL:', imageUrl);

      return imageUrl;
    } catch (error) {
      this.logError('Temporary upload error:', error);

      if (error instanceof Error) {
        this.logError('Error message:', error.message);
        this.logError('Error stack:', error.stack);
        throw new HttpException(
          `Failed to upload temporary image: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Failed to upload temporary image',
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

  // ========== PRODUCT COLOR IMAGE METHODS ==========

  /**
   * Upload single product color image with specific order
   */
  async uploadProductColorImage(
    productId: number,
    productColorId: number,
    productNumber: string,
    file: Express.Multer.File,
    imageOrder: 'a' | 'b' | 'c' | 'd' | 'e',
    reqUserId: number,
  ): Promise<ProductImageModel> {
    try {
      this.log('Starting product color image upload...', {
        productId,
        productColorId,
        productNumber,
        imageOrder,
        fileName: file.originalname,
      });

      // Validate file
      this.validateImageFile(file);

      // Validate image order
      const validatedOrder = this.validateImageOrder(imageOrder);

      // Check if image with this order already exists for this color
      const existingImage = await this.productImageRepository.findOne({
        where: {
          productId,
          productColorId,
          imageOrder: validatedOrder,
          deletedAt: IsNull(),
        },
      });

      // Generate filename with productNumber and order
      const fileName = this.generateColorImageFileName(
        productNumber,
        validatedOrder,
        file.originalname,
      );

      // Get folder path for this product color
      const folderPath = await this.getProductColorFolderPath(productNumber);

      this.log('Generated filename and path:', { fileName, folderPath });

      // Upload to S3 (overwrite if exists)
      const imageUrl = await this.awsS3Service.uploadFile(
        file.buffer,
        fileName,
        file.mimetype,
        folderPath,
        true, // Overwrite existing file
      );

      this.log('S3 upload successful:', imageUrl);

      if (existingImage) {
        // Update existing image
        await this.productImageRepository.update(
          { id: existingImage.id },
          {
            imageUrl,
            updatedAt: new Date(),
            updatedBy: reqUserId,
          },
        );
        return await this.getProductImageById(existingImage.id);
      } else {
        // Create new image record
        const entity = new ProductImageEntity();
        entity.productId = productId;
        entity.productColorId = productColorId;
        entity.imageOrder = validatedOrder;
        entity.imageUrl = imageUrl;
        entity.createdAt = new Date();
        entity.createdBy = reqUserId;

        const savedImage = await this.productImageRepository.save(entity);
        return await this.getProductImageById(savedImage.id);
      }
    } catch (error) {
      this.logError('Error uploading product color image:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new HttpException(
        `Failed to upload color image: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Upload multiple product color images
   */
  async uploadProductColorImages(
    productId: number,
    productColorId: number,
    productNumber: string,
    files: Array<{
      file: Express.Multer.File;
      imageOrder: 'a' | 'b' | 'c' | 'd' | 'e';
    }>,
    reqUserId: number,
  ): Promise<ProductImageModel[]> {
    const results: ProductImageModel[] = [];

    try {
      this.log('Starting bulk color images upload...', {
        productId,
        productColorId,
        productNumber,
        fileCount: files.length,
      });

      // Validate that we don't have more than 5 images
      if (files.length > 5) {
        throw new HttpException(
          'Maximum 5 images allowed per product color',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate that all image orders are unique
      const orders = files.map((f) => f.imageOrder);
      const uniqueOrders = new Set(orders);
      if (orders.length !== uniqueOrders.size) {
        throw new HttpException(
          'Each image order (a, b, c, d, e) can only be used once',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Upload each file
      for (const { file, imageOrder } of files) {
        const result = await this.uploadProductColorImage(
          productId,
          productColorId,
          productNumber,
          file,
          imageOrder,
          reqUserId,
        );
        results.push(result);
      }

      this.log(`Successfully uploaded ${results.length} color images`);
      return results;
    } catch (error) {
      this.logError('Error in bulk color images upload:', error);
      throw error;
    }
  }

  /**
   * Get product images by color ID
   */
  async getProductImagesByColorId(
    productId: number,
    productColorId: number,
  ): Promise<ProductImageModel[]> {
    const images = await this.productImageRepository.find({
      where: {
        productId,
        productColorId,
        deletedAt: IsNull(),
      },
      order: {
        imageOrder: 'ASC',
      },
    });

    return images.map((img) => img.toModel());
  }

  /**
   * Get thumbnail images for product (images with order 'a' or 'b')
   */
  async getProductThumbnailImages(
    productId: number,
  ): Promise<ProductImageModel[]> {
    const images = await this.productImageRepository.find({
      where: {
        productId,
        imageOrder: In(['a', 'b']),
        deletedAt: IsNull(),
      },
      order: {
        imageOrder: 'ASC',
      },
    });

    return images.map((img) => img.toModel());
  }

  /**
   * Get all images for a product grouped by color
   */
  async getProductImagesGroupedByColor(
    productId: number,
  ): Promise<Map<number, ProductImageModel[]>> {
    const images = await this.productImageRepository.find({
      where: {
        productId,
        deletedAt: IsNull(),
      },
      order: {
        productColorId: 'ASC',
        imageOrder: 'ASC',
      },
    });

    const groupedImages = new Map<number, ProductImageModel[]>();

    images.forEach((img) => {
      const colorId = img.productColorId || 0;
      if (!groupedImages.has(colorId)) {
        groupedImages.set(colorId, []);
      }
      groupedImages.get(colorId)!.push(img.toModel());
    });

    return groupedImages;
  }

  /**
   * Delete product color image by order
   */
  async deleteProductColorImage(
    productId: number,
    productColorId: number,
    imageOrder: 'a' | 'b' | 'c' | 'd' | 'e',
    reqUserId: number,
  ): Promise<boolean> {
    const image = await this.productImageRepository.findOne({
      where: {
        productId,
        productColorId,
        imageOrder,
        deletedAt: IsNull(),
      },
    });

    if (!image) {
      throw new HttpException(
        `Image with order ${imageOrder} not found for this product color`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Delete from S3
    try {
      await this.awsS3Service.deleteFile(image.imageUrl);
    } catch (error) {
      this.logError('Failed to delete image from S3:', error);
      // Continue with database deletion even if S3 deletion fails
    }

    // Soft delete from database
    await this.productImageRepository.update(
      { id: image.id },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  /**
   * Delete all images for a product color
   */
  async deleteProductColorImages(
    productId: number,
    productColorId: number,
    reqUserId: number,
  ): Promise<boolean> {
    const images = await this.productImageRepository.find({
      where: {
        productId,
        productColorId,
        deletedAt: IsNull(),
      },
    });

    // Delete from S3
    for (const image of images) {
      try {
        await this.awsS3Service.deleteFile(image.imageUrl);
      } catch (error) {
        this.logError('Failed to delete image from S3:', error);
      }
    }

    // Soft delete from database
    await this.productImageRepository.update(
      {
        productId,
        productColorId,
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
