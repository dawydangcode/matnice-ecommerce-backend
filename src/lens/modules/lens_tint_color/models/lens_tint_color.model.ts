export class LensTintColorModel {
  public readonly id: number;
  public readonly lensVariantId: number;
  public readonly name: string;
  public readonly imageUrl: string;
  public readonly colorCode: string;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    lensVariantId: number,
    name: string,
    imageUrl: string,
    colorCode: string,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date,
    deletedBy: number,
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
