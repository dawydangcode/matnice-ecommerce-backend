export class ProductImageModel {
  public readonly id: number;
  public readonly productId: number;
  public readonly productColorId?: number;
  public readonly imageUrl: string;
  public readonly imageOrder?: string;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    productId: number,
    productColorId: number | undefined,
    imageUrl: string,
    imageOrder: string | undefined,
    createdAt: Date,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.productId = productId;
    this.productColorId = productColorId;
    this.imageUrl = imageUrl;
    this.imageOrder = imageOrder;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
