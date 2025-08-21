export class LensVariantModel {
  public readonly id: number;
  public readonly lensId: number;
  public readonly lensThicknessId: number;
  public readonly design?: string;
  public readonly material?: string;
  public readonly price: number;
  public readonly stock: number;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt?: Date;
  public readonly updatedBy?: number;
  public readonly deletedAt?: Date;
  public readonly deletedBy?: number;

  constructor(
    id: number,
    lensId: number,
    lensThicknessId: number,
    design?: string,
    material?: string,
    price: number = 0,
    stock: number = 0,
    createdAt: Date = new Date(),
    createdBy: number = 0,
    updatedAt?: Date,
    updatedBy?: number,
    deletedAt?: Date,
    deletedBy?: number,
  ) {
    this.id = id;
    this.lensId = lensId;
    this.lensThicknessId = lensThicknessId;
    this.design = design;
    this.material = material;
    this.price = price;
    this.stock = stock;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
