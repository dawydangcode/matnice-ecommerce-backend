import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product3dModelEntity } from './entities/product-3d-model.entity';
import {
  CreateProduct3dModelDto,
  UpdateProduct3dModelDto,
} from './dtos/product-3d-model.dto';

@Injectable()
export class Product3dModelService {
  constructor(
    @InjectRepository(Product3dModelEntity)
    private readonly product3dModelRepository: Repository<Product3dModelEntity>,
  ) {}

  async create(
    createDto: CreateProduct3dModelDto,
    userId?: number,
  ): Promise<Product3dModelEntity> {
    // If setting as primary, ensure no other model for this product is primary
    if (createDto.isPrimary) {
      await this.unsetPrimaryForProduct(createDto.productId);
    }

    const product3dModel = this.product3dModelRepository.create({
      ...createDto,
      createdBy: userId,
    });

    return await this.product3dModelRepository.save(product3dModel);
  }

  async findAll(): Promise<Product3dModelEntity[]> {
    return await this.product3dModelRepository.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProductId(productId: number): Promise<Product3dModelEntity[]> {
    return await this.product3dModelRepository.find({
      where: { productId },
      order: { isPrimary: 'DESC', createdAt: 'ASC' },
    });
  }

  async findPrimaryByProductId(
    productId: number,
  ): Promise<Product3dModelEntity | null> {
    return await this.product3dModelRepository.findOne({
      where: { productId, isPrimary: true },
    });
  }

  async findOne(id: number): Promise<Product3dModelEntity> {
    const product3dModel = await this.product3dModelRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!product3dModel) {
      throw new NotFoundException(`3D Model with ID ${id} not found`);
    }

    return product3dModel;
  }

  async update(
    id: number,
    updateDto: UpdateProduct3dModelDto,
    userId?: number,
  ): Promise<Product3dModelEntity> {
    const product3dModel = await this.findOne(id);

    // If setting as primary, ensure no other model for this product is primary
    if (updateDto.isPrimary && !product3dModel.isPrimary) {
      await this.unsetPrimaryForProduct(product3dModel.productId);
    }

    Object.assign(product3dModel, {
      ...updateDto,
      updatedBy: userId,
    });

    return await this.product3dModelRepository.save(product3dModel);
  }

  async remove(id: number, userId?: number): Promise<void> {
    const product3dModel = await this.findOne(id);

    // Soft delete
    product3dModel.deletedBy = userId;
    await this.product3dModelRepository.softRemove(product3dModel);
  }

  async setPrimary(id: number, userId?: number): Promise<Product3dModelEntity> {
    const product3dModel = await this.findOne(id);

    // Unset primary for all other models of this product
    await this.unsetPrimaryForProduct(product3dModel.productId);

    // Set this model as primary
    product3dModel.isPrimary = true;
    product3dModel.updatedBy = userId;

    return await this.product3dModelRepository.save(product3dModel);
  }

  private async unsetPrimaryForProduct(productId: number): Promise<void> {
    await this.product3dModelRepository.update(
      { productId, isPrimary: true },
      { isPrimary: false },
    );
  }

  async findByModelType(modelType: string): Promise<Product3dModelEntity[]> {
    return await this.product3dModelRepository.find({
      where: { modelType },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    byType: Record<string, number>;
  }> {
    const models = await this.product3dModelRepository.find();

    const stats = {
      totalFiles: models.length,
      totalSize: models.reduce((sum, model) => sum + (model.fileSize || 0), 0),
      byType: {} as Record<string, number>,
    };

    models.forEach((model) => {
      stats.byType[model.modelType] = (stats.byType[model.modelType] || 0) + 1;
    });

    return stats;
  }
}
