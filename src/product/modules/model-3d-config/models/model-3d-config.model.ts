export class Model3dConfigModel {
  public readonly id: number;
  public readonly modelId: number;
  public readonly offsetX: number;
  public readonly offsetY: number;
  public readonly positionOffsetX: number;
  public readonly positionOffsetY: number;
  public readonly positionOffsetZ: number;
  public readonly initialScale: number;
  public readonly rotationSensitivity: number;
  public readonly yawLimit: number;
  public readonly pitchLimit: number;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
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
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.modelId = modelId;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.positionOffsetX = positionOffsetX;
    this.positionOffsetY = positionOffsetY;
    this.positionOffsetZ = positionOffsetZ;
    this.initialScale = initialScale;
    this.rotationSensitivity = rotationSensitivity;
    this.yawLimit = yawLimit;
    this.pitchLimit = pitchLimit;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
