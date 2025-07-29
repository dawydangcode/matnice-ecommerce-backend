export class ProductCategoryModel {
  public readonly id: number;
  public readonly productId: number;
  public readonly categoryId: number;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | null;
  public readonly updatedBy: number | null;
  public readonly deletedAt: Date | null;
  public readonly deletedBy: number | null;

  constructor(
    id: number,
    productId: number,
    categoryId: number,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | null,
    updatedBy: number | null,
    deletedAt: Date | null,
    deletedBy: number | null,
  ) {
    this.id = id;
    this.productId = productId;
    this.categoryId = categoryId;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
