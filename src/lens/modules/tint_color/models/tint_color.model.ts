export class TintColorModel {
  public readonly id: number;
  public readonly tintId: number;
  public readonly name: string;
  public readonly imageUrl: string | null;
  public readonly colorCode: string | null;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date;
  public readonly updatedBy: number;
  public readonly deletedAt: Date | null;
  public readonly deletedBy: number | null;

  constructor(
    id: number,
    tintId: number,
    name: string,
    imageUrl: string | null,
    colorCode: string | null,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | null,
    deletedBy: number | null,
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
