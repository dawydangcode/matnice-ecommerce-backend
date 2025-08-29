import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Like, In } from 'typeorm';
import { LensTintColorEntity } from './entities/lens_tint_color.entity';
import { LensTintColorModel } from './models/lens_tint_color.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';
import { AwsS3Service } from 'src/common/services/aws-s3.service';

@Injectable()
export class LensTintColorService {
  constructor(
    @InjectRepository(LensTintColorEntity)
    private readonly lensTintColorRepository: Repository<LensTintColorEntity>,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async getLensTintColors(
    lensTintColorIds: number[] | undefined,
    lensVariantId: number | undefined,
    name: string | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<LensTintColorModel>> {
    const [lensTintColors, total] =
      await this.lensTintColorRepository.findAndCount({
        where: {
          id: lensTintColorIds ? In(lensTintColorIds) : undefined,
          lensVariantId: lensVariantId,
          name: search ? Like(`%${search}%`) : name,
          deletedAt: IsNull(),
        },
        relations: relations,
        ...pagination?.toQuery(),
      });

    return new PageList<LensTintColorModel>(
      total,
      lensTintColors.map((tintColor: LensTintColorEntity) =>
        tintColor.toModel(),
      ),
    );
  }

  async getLensTintColorById(
    lensTintColorId: number,
  ): Promise<LensTintColorModel> {
    const lensTintColor = await this.lensTintColorRepository.findOne({
      where: { id: lensTintColorId, deletedAt: IsNull() },
    });

    if (!lensTintColor) {
      throw new HttpException(
        'Lens tint color not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return lensTintColor.toModel();
  }

  async createLensTintColor(
    lensVariantId: number,
    name: string,
    imageFile: Express.Multer.File | undefined,
    colorCode: string | undefined,
    reqUserId: number,
  ): Promise<LensTintColorModel> {
    let imageUrl: string | undefined;

    // Upload image to S3 if provided
    if (imageFile) {
      try {
        const folderPath = `lens_tint_color/${lensVariantId}`;
        const fileName = `${Date.now()}_${imageFile.originalname}`;

        imageUrl = await this.awsS3Service.uploadFile(
          imageFile.buffer,
          fileName,
          imageFile.mimetype,
          folderPath,
          false,
        );
      } catch (error) {
        console.error('Failed to upload image to S3:', error);
        throw new HttpException(
          'Failed to upload image',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    const entity = new LensTintColorEntity();
    entity.lensVariantId = lensVariantId;
    entity.name = name;
    if (imageUrl) {
      entity.imageUrl = imageUrl;
    }
    if (colorCode) {
      entity.colorCode = colorCode;
    }
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedTintColor = await this.lensTintColorRepository.save(entity);
    return savedTintColor.toModel();
  }

  async updateLensTintColor(
    lensTintColor: LensTintColorModel,
    name: string | undefined,
    imageFile: Express.Multer.File | undefined,
    colorCode: string | undefined,
    reqUserId: number,
  ): Promise<LensTintColorModel> {
    let imageUrl: string | undefined;

    // Upload new image to S3 if provided
    if (imageFile) {
      try {
        // Delete old image if exists
        if (lensTintColor.imageUrl) {
          await this.awsS3Service.deleteFile(lensTintColor.imageUrl);
        }

        const folderPath = `lens_tint_color/${lensTintColor.lensVariantId}`;
        const fileName = `${Date.now()}_${imageFile.originalname}`;

        imageUrl = await this.awsS3Service.uploadFile(
          imageFile.buffer,
          fileName,
          imageFile.mimetype,
          folderPath,
          false,
        );
      } catch (error) {
        console.error('Failed to upload image to S3:', error);
        throw new HttpException(
          'Failed to upload image',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
      updatedBy: reqUserId,
    };

    if (name !== undefined) updateData.name = name;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (colorCode !== undefined) updateData.colorCode = colorCode;

    await this.lensTintColorRepository.update(
      { id: lensTintColor.id, deletedAt: IsNull() },
      updateData,
    );

    return await this.getLensTintColorById(lensTintColor.id);
  }

  async deleteLensTintColor(
    lensTintColor: LensTintColorModel,
    reqUserId: number,
  ): Promise<boolean> {
    // Delete image from S3 if exists
    if (lensTintColor.imageUrl) {
      try {
        await this.awsS3Service.deleteFile(lensTintColor.imageUrl);
      } catch (error) {
        console.error('Failed to delete image from S3:', error);
        // Continue with soft delete even if S3 deletion fails
      }
    }

    await this.lensTintColorRepository.update(
      { id: lensTintColor.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  /**
   * Upload image for lens tint color to S3
   * @param lensVariantId - The lens variant ID for folder structure
   * @param imageFile - The image file to upload
   * @returns The S3 URL of uploaded image
   */
  async uploadLensTintColorImage(
    lensVariantId: number,
    imageFile: Express.Multer.File,
  ): Promise<string> {
    try {
      const folderPath = `lens_tint_color/${lensVariantId}`;
      const fileName = `${Date.now()}_${imageFile.originalname}`;

      return await this.awsS3Service.uploadFile(
        imageFile.buffer,
        fileName,
        imageFile.mimetype,
        folderPath,
        false,
      );
    } catch (error) {
      console.error('Failed to upload image to S3:', error);
      throw new HttpException(
        'Failed to upload image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
