export class LensTintColorModel {
  public readonly id: number;
  public readonly lensVariantId: number;
  public readonly name: string;
  public readonly imageUrl?: string;
  public readonly colorCode?: string;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt?: Date;
  public readonly updatedBy?: number;
  public readonly deletedAt?: Date;
  public readonly deletedBy?: number;

  constructor(
    id: number,
    lensVariantId: number,
    name: string,
    imageUrl?: string,
    colorCode?: string,
    createdAt: Date = new Date(),
    createdBy: number = 0,
    updatedAt?: Date,
    updatedBy?: number,
    deletedAt?: Date,
    deletedBy?: number,
  ) {
    this.id = id;
    this.lensVariantId = lensVariantId;
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
