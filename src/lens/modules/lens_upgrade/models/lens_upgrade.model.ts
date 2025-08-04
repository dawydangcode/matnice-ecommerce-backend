export class LensUpgradeModel {
  public readonly id: number;
  public readonly upgradeName: string;
  public readonly description: string | null;
  public readonly price: number;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date;
  public readonly updatedBy: number;
  public readonly deletedAt: Date | null;
  public readonly deletedBy: number | null;

  constructor(
    id: number,
    upgradeName: string,
    description: string | null,
    price: number,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | null,
    deletedBy: number | null,
  ) {
    this.id = id;
    this.upgradeName = upgradeName;
    this.description = description;
    this.price = price;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
