export class OrderItemModel {
  public readonly id: number;
  public readonly orderId: number;
  public readonly productId: number;
  public readonly quantity: number;
  public readonly framePrice: number;
  public readonly totalPrice: number;
  public readonly discount: number;
  public readonly selectedColorId?: number;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date;
  public readonly updatedBy: number;
  public readonly deletedAt?: Date;
  public readonly deletedBy?: number;

  constructor(
    id: number,
    orderId: number,
    productId: number,
    quantity: number,
    framePrice: number,
    totalPrice: number,
    discount: number,
    selectedColorId: number | undefined,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;
    this.quantity = quantity;
    this.framePrice = framePrice;
    this.totalPrice = totalPrice;
    this.discount = discount;
    this.selectedColorId = selectedColorId;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
