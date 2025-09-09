import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Product3dModelEntity } from './entities/product-3d-model.entity';
import { Product3dModel } from './models/product-3d-model.model';
import { ModelType } from './enum/model.type';

@Injectable()
export class Product3dModelService {
  constructor(
    @InjectRepository(Product3dModelEntity)
    private readonly product3dModelRepository: Repository<Product3dModelEntity>,
  ) {}

  async getProduct3dModels(): Promise<Product3dModel[]> {
    const models = await this.product3dModelRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['product'],
    });
    return models.map((model) => model.toModel());
  }

  async getProduct3dModelByProductId(
    productId: number,
  ): Promise<Product3dModel> {
    const product3dModel = await this.product3dModelRepository.findOne({
      where: { productId, deletedAt: IsNull() },
      relations: ['product'],
    });

    if (!product3dModel) {
      throw new NotFoundException(
        `3D Model for Product ID ${productId} not found`,
      );
    }

    return product3dModel.toModel();
  }

  async getActiveByProductId(productId: number): Promise<Product3dModel[]> {
    const product3dModels = await this.product3dModelRepository.find({
      where: { productId, isActive: true, deletedAt: IsNull() },
      relations: ['product'],
    });

    if (!product3dModels || product3dModels.length === 0) {
      throw new NotFoundException(
        `Active 3D Models for Product ID ${productId} not found`,
      );
    }

    return product3dModels.map((model) => model.toModel());
  }

  async getProduct3dModel(
    product3dModelId: number,
  ): Promise<Product3dModelEntity> {
    const product3dModel = await this.product3dModelRepository.findOne({
      where: { id: product3dModelId, deletedAt: IsNull() },
      relations: ['product'],
    });

    if (!product3dModel) {
      throw new NotFoundException(
        `3D Model with ID ${product3dModelId} not found`,
      );
    }

    return product3dModel;
  }

  async createProduct3dModel(
    productId: number,
    modelName: string,
    modelFilePath: string,
    modelType: ModelType,
    mtlFilePath: string,
    textureBasePath: string,
    configJson: string,
    isActive: boolean,
    reqUserId: number,
  ): Promise<Product3dModelEntity> {
    const entity = new Product3dModelEntity();
    entity.productId = productId;
    entity.modelName = modelName;
    entity.modelFilePath = modelFilePath;
    entity.modelType = modelType;
    entity.mtlFilePath = mtlFilePath;
    entity.textureBasePath = textureBasePath;
    entity.configJson = configJson;
    entity.isActive = isActive;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    return await this.product3dModelRepository.save(entity);
  }

  async updateProduct3dModel(
    product3dModel: Product3dModel,
    modelName: string,
    modelFilePath: string,
    modelType: ModelType,
    mtlFilePath: string,
    textureBasePath: string,
    configJson: string,
    isActive: boolean,
    reqUserId: number,
  ): Promise<Product3dModel> {
    await this.product3dModelRepository.update(
      { id: product3dModel.id, deletedAt: IsNull() },
      {
        modelName: modelName,
        modelFilePath: modelFilePath,
        modelType: modelType,
        mtlFilePath: mtlFilePath,
        textureBasePath: textureBasePath,
        configJson: configJson,
        isActive: isActive,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getProduct3dModel(product3dModel.id).then((entity) =>
      entity.toModel(),
    );
  }

  async deleteProduct3dModel(
    product3dModel: Product3dModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.product3dModelRepository.update(
      { id: product3dModel.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );
    return true;
  }

  async setActive(
    product3dModel: Product3dModel,
    isActive: boolean,
    reqUserId: number,
  ): Promise<Product3dModel> {
    await this.product3dModelRepository.update(
      { id: product3dModel.id, deletedAt: IsNull() },
      {
        isActive: isActive,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getProduct3dModel(product3dModel.id).then((entity) =>
      entity.toModel(),
    );
  }

  async findByModelType(modelType: ModelType): Promise<Product3dModel[]> {
    const models = await this.product3dModelRepository.find({
      where: { modelType },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });

    return models.map((model) => model.toModel());
  }

  async getStorageStats(): Promise<{
    totalFiles: number;
    activeFiles: number;
    byType: Record<string, number>;
  }> {
    const allModels = await this.product3dModelRepository.find();
    const activeModels = await this.product3dModelRepository.find({
      where: { isActive: true },
    });

    const stats = {
      totalFiles: allModels.length,
      activeFiles: activeModels.length,
      byType: {} as Record<string, number>,
    };

    allModels.forEach((model) => {
      stats.byType[model.modelType] = (stats.byType[model.modelType] || 0) + 1;
    });

    return stats;
  }
}
