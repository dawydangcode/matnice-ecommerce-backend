export class TintColorModel {
  public readonly id: number;
  public readonly tintId: number;
  public readonly name: string;
  public readonly imageUrl: string | undefined;
  public readonly colorCode: string | undefined;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date;
  public readonly updatedBy: number;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    tintId: number,
    name: string,
    imageUrl: string | undefined,
    colorCode: string | undefined,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.tintId = tintId;
    this.name = name;
    this.imageUrl = imageUrl;
    this.colorCode = colorCode;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
