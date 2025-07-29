import { ProductGenderType, ProductType } from '../enum/product.type';

export class ProductModel {
  public readonly id: number;
  public readonly productName: string;
  public readonly productType: ProductType;
  public readonly brandId: number;
  public readonly gender: ProductGenderType;
  public readonly price: number;
  public readonly stock: number;
  public readonly description: string;
  public readonly isSustainable: boolean;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    productName: string,
    productType: ProductType,
    brandId: number,
    gender: ProductGenderType,
    price: number,
    stock: number,
    description: string,
    isSustainable: boolean,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.productName = productName;
    this.productType = productType;
    this.brandId = brandId;
    this.gender = gender;
    this.price = price;
    this.stock = stock;
    this.description = description;
    this.isSustainable = isSustainable;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
