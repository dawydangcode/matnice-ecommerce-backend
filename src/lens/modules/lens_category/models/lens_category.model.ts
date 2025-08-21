export class LensCategoryModel {
  public readonly id: number;
  public readonly lensId: number;
  public readonly categoryId: number;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt?: Date;
  public readonly updatedBy?: number;
  public readonly deletedAt?: Date;
  public readonly deletedBy?: number;

  constructor(
    id: number,
    lensId: number,
    categoryId: number,
    createdAt: Date = new Date(),
    createdBy: number = 0,
    updatedAt?: Date,
    updatedBy?: number,
    deletedAt?: Date,
    deletedBy?: number,
  ) {
    this.id = id;
    this.lensId = lensId;
    this.categoryId = categoryId;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
