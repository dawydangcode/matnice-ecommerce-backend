import { ProductGenderType, ProductType } from '../enum/product.type';

export class ProductModel {
  public readonly id: number;
  public readonly productName: string;
  public readonly productType: ProductType;
  public readonly categoryId: number;
  public readonly brandId: number;
  public readonly gender: ProductGenderType;
  public readonly price: number;
  public readonly color: string;
  public readonly stock: number;
  public readonly description: string;
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
    categoryId: number,
    brandId: number,
    gender: ProductGenderType,
    price: number,
    color: string,
    stock: number,
    description: string,
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
    this.categoryId = categoryId;
    this.brandId = brandId;
    this.gender = gender;
    this.price = price;
    this.color = color;
    this.stock = stock;
    this.description = description;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
