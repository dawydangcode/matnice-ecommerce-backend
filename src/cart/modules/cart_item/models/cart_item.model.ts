export class CartItemModel {
  public readonly id: number;
  public readonly cartId: number;
  public readonly productId: number;
  public readonly lensId: number | undefined;
  public readonly quantity: number;
  public readonly addedAt: Date | undefined;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    cartId: number,
    productId: number,
    lensId: number | undefined,
    quantity: number,
    addedAt: Date | undefined,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.cartId = cartId;
    this.productId = productId;
    this.lensId = lensId;
    this.quantity = quantity;
    this.addedAt = addedAt;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
