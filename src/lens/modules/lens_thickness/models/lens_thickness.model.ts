export class LensThicknessModel {
  public readonly id: number;
  public readonly name: string;
  public readonly indexValue: number;
  public readonly price: number;
  public readonly description: string | null;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date;
  public readonly updatedBy: number;
  public readonly deletedAt: Date | null;
  public readonly deletedBy: number | null;

  constructor(
    id: number,
    name: string,
    indexValue: number,
    price: number,
    description: string | null,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | null,
    deletedBy: number | null,
  ) {
    this.id = id;
    this.name = name;
    this.indexValue = indexValue;
    this.price = price;
    this.description = description;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
