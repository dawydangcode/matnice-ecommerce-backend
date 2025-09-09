import { ModelType } from '../enum/model.type';

export class Product3dModel {
  public readonly id: number;
  public readonly productId: number;
  public readonly modelName: string;
  public readonly modelFilePath: string;
  public readonly modelType: ModelType;
  public readonly mtlFilePath: string | undefined;
  public readonly textureBasePath: string | undefined;
  public readonly configJson: string | undefined;
  public readonly isActive: boolean;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    productId: number,
    modelName: string,
    modelFilePath: string,
    modelType: ModelType,
    mtlFilePath: string | undefined,
    textureBasePath: string | undefined,
    configJson: string | undefined,
    isActive: boolean,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.productId = productId;
    this.modelName = modelName;
    this.modelFilePath = modelFilePath;
    this.modelType = modelType;
    this.mtlFilePath = mtlFilePath;
    this.textureBasePath = textureBasePath;
    this.configJson = configJson;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
