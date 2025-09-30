import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';
import { LensImageEntity } from './entities/lens-image.entity';
import { LensImageModel } from './models/lens-image.model';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { AwsS3Service } from 'src/common/services/aws-s3.service';
import { LensEntity } from '../../entities/lens.entity';
import {
  CreateLensImageDto,
  UpdateLensImageDto,
  LensImageListDto,
} from './dtos/lens-image.dto';
import * as crypto from 'crypto';

@Injectable()
export class LensImageService {
  private readonly isDevelopment = process.env.NODE_ENV !== 'production';

  constructor(
    @InjectRepository(LensImageEntity)
    private readonly lensImageRepository: Repository<LensImageEntity>,
    @InjectRepository(LensEntity)
    private readonly lensRepository: Repository<LensEntity>,
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

  private async getLensInfo(lensId: number): Promise<{
    folderPath: string;
    lensName: string;
    sanitizedName: string;
  }> {
    try {
      const lens = await this.lensRepository.findOne({
        where: { id: lensId },
      });

      if (!lens) {
        throw new HttpException(
          `Lens with ID ${lensId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const sanitizedName = lens.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      return {
        folderPath: `lens/${sanitizedName}-${lensId}`,
        lensName: lens.name,
        sanitizedName,
      };
    } catch (error) {
      this.logError('Error getting lens info:', error);
      throw new HttpException(
        'Failed to get lens information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private generateFileKey(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  async createLensImage(
    createLensImageDto: CreateLensImageDto,
    userId: number,
  ): Promise<LensImageModel> {
    try {
      // Validate lens exists
      const lens = await this.lensRepository.findOne({
        where: { id: createLensImageDto.lensId },
      });

      if (!lens) {
        throw new HttpException('Lens not found', HttpStatus.NOT_FOUND);
      }

      // Check if image order is already taken
      if (createLensImageDto.imageOrder) {
        const existingImage = await this.lensImageRepository.findOne({
          where: {
            lensId: createLensImageDto.lensId,
            imageOrder: createLensImageDto.imageOrder,
          },
        });

        if (existingImage) {
          throw new HttpException(
            `Image order '${createLensImageDto.imageOrder}' is already taken for this lens`,
            HttpStatus.CONFLICT,
          );
        }
      }

      const lensImage = this.lensImageRepository.create({
        lensId: createLensImageDto.lensId,
        imageUrl: createLensImageDto.imageUrl,
        imageOrder: createLensImageDto.imageOrder,
        isThumbnail: createLensImageDto.isThumbnail || false,
        createdBy: userId,
        updatedBy: userId,
      });

      const savedImage = await this.lensImageRepository.save(lensImage);
      return savedImage.toModel();
    } catch (error) {
      this.logError('Error creating lens image:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create lens image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateLensImage(
    id: number,
    updateLensImageDto: UpdateLensImageDto,
    userId: number,
  ): Promise<LensImageModel> {
    try {
      const lensImage = await this.lensImageRepository.findOne({
        where: { id },
      });

      if (!lensImage) {
        throw new HttpException('Lens image not found', HttpStatus.NOT_FOUND);
      }

      // Check if new image order conflicts
      if (
        updateLensImageDto.imageOrder &&
        updateLensImageDto.imageOrder !== lensImage.imageOrder
      ) {
        const existingImage = await this.lensImageRepository.findOne({
          where: {
            lensId: lensImage.lensId,
            imageOrder: updateLensImageDto.imageOrder,
            id: In([id]), // Exclude current image
          },
        });

        if (existingImage) {
          throw new HttpException(
            `Image order '${updateLensImageDto.imageOrder}' is already taken for this lens`,
            HttpStatus.CONFLICT,
          );
        }
      }

      Object.assign(lensImage, {
        ...updateLensImageDto,
        updatedBy: userId,
        updatedAt: new Date(),
      });

      const savedImage = await this.lensImageRepository.save(lensImage);
      return savedImage.toModel();
    } catch (error) {
      this.logError('Error updating lens image:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update lens image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteLensImage(id: number, userId: number): Promise<boolean> {
    try {
      const lensImage = await this.lensImageRepository.findOne({
        where: { id },
      });

      if (!lensImage) {
        throw new HttpException('Lens image not found', HttpStatus.NOT_FOUND);
      }

      // Soft delete
      lensImage.deletedBy = userId;
      await this.lensImageRepository.softDelete(id);

      return true;
    } catch (error) {
      this.logError('Error deleting lens image:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete lens image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLensImageById(id: number): Promise<LensImageModel> {
    try {
      const lensImage = await this.lensImageRepository.findOne({
        where: { id },
        relations: ['lens', 'lensVariant'],
      });

      if (!lensImage) {
        throw new HttpException('Lens image not found', HttpStatus.NOT_FOUND);
      }

      return lensImage.toModel();
    } catch (error) {
      this.logError('Error getting lens image by ID:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get lens image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLensImages(
    params: LensImageListDto,
  ): Promise<PageList<LensImageModel>> {
    try {
      const page = params.page || 1;
      const limit = params.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.lensImageRepository
        .createQueryBuilder('lensImage')
        .leftJoinAndSelect('lensImage.lens', 'lens');

      // Filter by lens ID
      if (params.lensId) {
        queryBuilder.andWhere('lensImage.lensId = :lensId', {
          lensId: params.lensId,
        });
      }

      // Search functionality
      if (params.search) {
        queryBuilder.andWhere('(lens.name LIKE :search)', {
          search: `%${params.search}%`,
        });
      }

      // Order by image order (primary first), then by creation date
      queryBuilder.orderBy('lensImage.imageOrder', 'ASC');
      queryBuilder.addOrderBy('lensImage.createdAt', 'DESC');

      const [items, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      const models = items.map((item) => item.toModel());

      return new PageList<LensImageModel>(total, models);
    } catch (error) {
      this.logError('Error getting lens images:', error);
      throw new HttpException(
        'Failed to get lens images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPrimaryImageForLens(lensId: number): Promise<LensImageModel | null> {
    try {
      const queryBuilder = this.lensImageRepository
        .createQueryBuilder('lensImage')
        .where('lensImage.lensId = :lensId', { lensId })
        .andWhere('lensImage.imageOrder = :imageOrder', { imageOrder: 'a' });

      const primaryImage = await queryBuilder.getOne();
      return primaryImage ? primaryImage.toModel() : null;
    } catch (error) {
      this.logError('Error getting primary lens image:', error);
      return null;
    }
  }

  async getImagesForLens(lensId: number): Promise<LensImageModel[]> {
    try {
      const queryBuilder = this.lensImageRepository
        .createQueryBuilder('lensImage')
        .where('lensImage.lensId = :lensId', { lensId });

      queryBuilder.orderBy('lensImage.imageOrder', 'ASC');
      queryBuilder.addOrderBy('lensImage.createdAt', 'DESC');

      const images = await queryBuilder.getMany();
      return images.map((image) => image.toModel());
    } catch (error) {
      this.logError('Error getting images for lens:', error);
      return [];
    }
  }

  async uploadLensImage(
    file: Express.Multer.File,
    lensId: number,
    imageOrder?: string,
    userId?: number,
  ): Promise<{ imageUrl: string; lensImage: LensImageModel }> {
    try {
      // Validate lens exists
      const lens = await this.lensRepository.findOne({
        where: { id: lensId },
      });

      if (!lens) {
        throw new HttpException('Lens not found', HttpStatus.NOT_FOUND);
      }

      // Check if imageOrder is already taken for this lens
      if (imageOrder) {
        const existingImage = await this.lensImageRepository.findOne({
          where: {
            lensId,
            imageOrder,
            deletedAt: IsNull(),
          },
        });

        if (existingImage) {
          throw new HttpException(
            `Image order '${imageOrder}' is already taken for this lens`,
            HttpStatus.CONFLICT,
          );
        }
      }

      const lensInfo = await this.getLensInfo(lensId);
      const fileKey = this.generateFileKey();
      const fileExtension = file.originalname.split('.').pop();

      let fileName = `${fileKey}-main`;

      if (imageOrder) {
        fileName += `-${imageOrder}`;
      }

      fileName += `.${fileExtension}`;

      const uploadPath = `${lensInfo.folderPath}/${fileName}`;

      // Upload to S3
      const imageUrl = await this.awsS3Service.uploadFile(
        file.buffer,
        uploadPath,
        file.mimetype,
      );

      // Save to database
      const lensImageEntity = new LensImageEntity();
      lensImageEntity.lensId = lensId;
      lensImageEntity.imageUrl = imageUrl;
      lensImageEntity.imageOrder = imageOrder;
      lensImageEntity.isThumbnail = false;
      lensImageEntity.createdAt = new Date();
      lensImageEntity.createdBy = userId || 1; // Default to 1 if userId not provided
      lensImageEntity.updatedBy = userId || 1;

      const savedImage = await this.lensImageRepository.save(lensImageEntity);

      this.log('Lens image saved to database:', {
        id: savedImage.id,
        lensId,
        imageUrl,
        imageOrder,
      });

      return {
        imageUrl,
        lensImage: savedImage.toModel(),
      };
    } catch (error) {
      this.logError('Error uploading lens image:', error);
      throw new HttpException(
        'Failed to upload image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteImageFromS3(imageUrl: string): Promise<void> {
    try {
      await this.awsS3Service.deleteFile(imageUrl);
    } catch (error) {
      this.logError('Error deleting image from S3:', error);
      // Don't throw error for S3 deletion failures in soft delete
    }
  }
}
