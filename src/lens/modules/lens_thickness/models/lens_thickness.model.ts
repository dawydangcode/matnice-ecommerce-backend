export class LensThicknessModel {
  public readonly id: number;
  public readonly name: string;
  public readonly indexValue: number;
  public readonly description: string;
  public readonly createdAt: Date | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    name: string,
    indexValue: number,
    description: string,
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
    createdBy: number | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.name = name;
    this.indexValue = indexValue;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
