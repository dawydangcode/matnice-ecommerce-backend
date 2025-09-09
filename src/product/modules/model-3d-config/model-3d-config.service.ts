import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model3dConfigEntity } from './entities/model-3d-config.entity';
import { Model3dConfigModel } from './models/model-3d-config.model';

@Injectable()
export class Model3dConfigService {
  constructor(
    @InjectRepository(Model3dConfigEntity)
    private readonly model3dConfigRepository: Repository<Model3dConfigEntity>,
  ) {}

  async create(
    modelId: number,
    offsetX: number = 0.5,
    offsetY: number = 0.5,
    positionOffsetX: number = 0.4,
    positionOffsetY: number = 0.097,
    positionOffsetZ: number = -0.4,
    initialScale: number = 0.16,
    rotationSensitivity: number = 1.0,
    yawLimit: number = 0.5,
    pitchLimit: number = 0.3,
    userId?: number,
  ): Promise<Model3dConfigModel> {
    // Check if config already exists for this model
    const existingConfig = await this.model3dConfigRepository.findOne({
      where: { modelId },
    });

    if (existingConfig) {
      throw new ConflictException(
        'Configuration already exists for this 3D model',
      );
    }

    const config = this.model3dConfigRepository.create({
      modelId,
      offsetX,
      offsetY,
      positionOffsetX,
      positionOffsetY,
      positionOffsetZ,
      initialScale,
      rotationSensitivity,
      yawLimit,
      pitchLimit,
      createdBy: userId,
    });

    const savedConfig = await this.model3dConfigRepository.save(config);
    return this.mapEntityToModel(savedConfig);
  }

  async findAll(): Promise<Model3dConfigModel[]> {
    const configs = await this.model3dConfigRepository.find({
      relations: ['model'],
      order: { createdAt: 'DESC' },
    });

    return configs.map((config) => this.mapEntityToModel(config));
  }

  async findByModelId(modelId: number): Promise<Model3dConfigModel | null> {
    const config = await this.model3dConfigRepository.findOne({
      where: { modelId },
      relations: ['model'],
    });

    return config ? this.mapEntityToModel(config) : null;
  }

  async findById(id: number): Promise<Model3dConfigModel> {
    const config = await this.model3dConfigRepository.findOne({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException(
        `3D model configuration with ID ${id} not found`,
      );
    }

    return this.mapEntityToModel(config);
  }

  async update(
    id: number,
    offsetX?: number,
    offsetY?: number,
    positionOffsetX?: number,
    positionOffsetY?: number,
    positionOffsetZ?: number,
    initialScale?: number,
    rotationSensitivity?: number,
    yawLimit?: number,
    pitchLimit?: number,
    userId?: number,
  ): Promise<Model3dConfigModel> {
    const config = await this.model3dConfigRepository.findOne({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException(
        `3D model configuration with ID ${id} not found`,
      );
    }

    // Update only provided fields
    if (offsetX !== undefined) config.offsetX = offsetX;
    if (offsetY !== undefined) config.offsetY = offsetY;
    if (positionOffsetX !== undefined) config.positionOffsetX = positionOffsetX;
    if (positionOffsetY !== undefined) config.positionOffsetY = positionOffsetY;
    if (positionOffsetZ !== undefined) config.positionOffsetZ = positionOffsetZ;
    if (initialScale !== undefined) config.initialScale = initialScale;
    if (rotationSensitivity !== undefined)
      config.rotationSensitivity = rotationSensitivity;
    if (yawLimit !== undefined) config.yawLimit = yawLimit;
    if (pitchLimit !== undefined) config.pitchLimit = pitchLimit;
    if (userId !== undefined) config.updatedBy = userId;

    const updatedConfig = await this.model3dConfigRepository.save(config);
    return this.mapEntityToModel(updatedConfig);
  }

  async delete(id: number): Promise<void> {
    const config = await this.model3dConfigRepository.findOne({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException(
        `3D model configuration with ID ${id} not found`,
      );
    }

    await this.model3dConfigRepository.softDelete(id);
  }

  async deleteByModelId(modelId: number): Promise<void> {
    const config = await this.model3dConfigRepository.findOne({
      where: { modelId },
    });

    if (config) {
      await this.model3dConfigRepository.softDelete(config.id);
    }
  }

  private mapEntityToModel(entity: Model3dConfigEntity): Model3dConfigModel {
    return {
      id: entity.id,
      modelId: entity.modelId,
      offsetX: entity.offsetX,
      offsetY: entity.offsetY,
      positionOffsetX: entity.positionOffsetX,
      positionOffsetY: entity.positionOffsetY,
      positionOffsetZ: entity.positionOffsetZ,
      initialScale: entity.initialScale,
      rotationSensitivity: entity.rotationSensitivity,
      yawLimit: entity.yawLimit,
      pitchLimit: entity.pitchLimit,
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
      deletedAt: entity.deletedAt,
      deletedBy: entity.deletedBy,
    };
  }
}
