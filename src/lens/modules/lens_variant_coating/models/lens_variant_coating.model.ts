export class LensVariantCoatingModel {
  public readonly id: number;
  public readonly lensVariantId: number;
  public readonly lensCoatingId: number;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt?: Date;
  public readonly updatedBy?: number;
  public readonly deletedAt?: Date;
  public readonly deletedBy?: number;

  constructor(
    id: number,
    lensVariantId: number,
    lensCoatingId: number,
    createdAt: Date = new Date(),
    createdBy: number = 0,
    updatedAt?: Date,
    updatedBy?: number,
    deletedAt?: Date,
    deletedBy?: number,
  ) {
    this.id = id;
    this.lensVariantId = lensVariantId;
    this.lensCoatingId = lensCoatingId;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
