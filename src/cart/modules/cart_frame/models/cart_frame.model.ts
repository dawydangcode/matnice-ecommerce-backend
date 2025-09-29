export class CartFrameModel {
  public readonly id: number;
  public readonly cartId: number;
  public readonly productId: number;
  public readonly quantity: number;
  public readonly framePrice: number;
  public readonly totalPrice: number;
  public readonly discount: number;
  public readonly selectedColorId?: number;
  public readonly addedAt: Date | undefined;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date;
  public readonly updatedBy: number;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    cartId: number,
    productId: number,
    quantity: number,
    framePrice: number,
    totalPrice: number,
    discount: number,
    selectedColorId: number | undefined,
    addedAt: Date | undefined,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.cartId = cartId;
    this.productId = productId;
    this.quantity = quantity;
    this.framePrice = framePrice;
    this.totalPrice = totalPrice;
    this.discount = discount;
    this.selectedColorId = selectedColorId;
    this.addedAt = addedAt;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
