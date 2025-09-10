import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Model3dConfigEntity } from './entities/model-3d-config.entity';
import { Model3dConfigModel } from './models/model-3d-config.model';

@Injectable()
export class Model3dConfigService {
  constructor(
    @InjectRepository(Model3dConfigEntity)
    private readonly model3dConfigRepository: Repository<Model3dConfigEntity>,
  ) {}

  async getModel3dConfigs(): Promise<Model3dConfigModel[]> {
    const configs = await this.model3dConfigRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['model'],
      order: { createdAt: 'DESC' },
    });

    return configs.map((config) => config.toModel());
  }

  async getModel3dConfigByModelId(
    modelId: number,
  ): Promise<Model3dConfigModel> {
    const config = await this.model3dConfigRepository.findOne({
      where: { id: modelId, deletedAt: IsNull() },
      relations: ['model'],
    });

    if (!config) {
      throw new NotFoundException(
        `3D model configuration for model ID ${modelId} not found`,
      );
    }

    return config.toModel();
  }

  async getModel3dConfigById(
    model3dConfigId: number,
  ): Promise<Model3dConfigModel> {
    const config = await this.model3dConfigRepository.findOne({
      where: { id: model3dConfigId, deletedAt: IsNull() },
    });

    if (!config) {
      throw new NotFoundException(
        `3D model configuration with ID ${model3dConfigId} not found`,
      );
    }

    return config.toModel();
  }

  async createModel3dConfig(
    modelId: number,
    offsetX: number,
    offsetY: number,
    positionOffsetX: number,
    positionOffsetY: number,
    positionOffsetZ: number,
    initialScale: number,
    rotationSensitivity: number,
    yawLimit: number,
    pitchLimit: number,
    userId: number,
  ): Promise<Model3dConfigModel> {
    const entity = new Model3dConfigEntity();

    entity.modelId = modelId;
    entity.offsetX = offsetX;
    entity.offsetY = offsetY;
    entity.positionOffsetX = positionOffsetX;
    entity.positionOffsetY = positionOffsetY;
    entity.positionOffsetZ = positionOffsetZ;
    entity.initialScale = initialScale;
    entity.rotationSensitivity = rotationSensitivity;
    entity.yawLimit = yawLimit;
    entity.pitchLimit = pitchLimit;
    entity.createdBy = userId;
    entity.createdAt = new Date();

    const savedEntity = await this.model3dConfigRepository.save(entity);
    return savedEntity.toModel();
  }

  async updateModel3dConfig(
    model3dConfigId: Model3dConfigModel,
    modelId: number | undefined,
    offsetX: number | undefined,
    offsetY: number | undefined,
    positionOffsetX: number | undefined,
    positionOffsetY: number | undefined,
    positionOffsetZ: number | undefined,
    initialScale: number | undefined,
    rotationSensitivity: number | undefined,
    yawLimit: number | undefined,
    pitchLimit: number | undefined,
    reqUserId: number,
  ): Promise<Model3dConfigModel> {
    await this.model3dConfigRepository.update(
      { id: model3dConfigId.id, deletedAt: IsNull() },
      {
        modelId: modelId,
        offsetX: offsetX,
        offsetY: offsetY,
        positionOffsetX: positionOffsetX,
        positionOffsetY: positionOffsetY,
        positionOffsetZ: positionOffsetZ,
        initialScale: initialScale,
        rotationSensitivity: rotationSensitivity,
        yawLimit: yawLimit,
        pitchLimit: pitchLimit,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getModel3dConfigById(model3dConfigId.id);
  }

  async deleteModel3dConfig(
    model3dConfigId: Model3dConfigModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.model3dConfigRepository.update(
      { id: model3dConfigId.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
