export class ProductColorModel {
  public readonly id: number;
  public readonly productId: number;
  public readonly productVariantName: string;
  public readonly productNumber: number;
  public readonly colorName: string;
  public readonly stock: number;
  public readonly isThumbnail: boolean;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    productId: number,
    productVariantName: string,
    productNumber: number,
    colorName: string,
    stock: number,
    isThumbnail: boolean,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.productId = productId;
    this.productVariantName = productVariantName;
    this.productNumber = productNumber;
    this.colorName = colorName;
    this.stock = stock;
    this.isThumbnail = isThumbnail;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
