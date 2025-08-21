export class LensThicknessModel {
  public readonly id: number;
  public readonly name: string;
  public readonly description: string;
  public readonly thickness: number;
  public readonly unit: string;
  public readonly isActive: boolean;
  public readonly createdAt: Date | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    name: string,
    description: string,
    thickness: number,
    unit: string,
    isActive: boolean,
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
    createdBy: number | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.thickness = thickness;
    this.unit = unit;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
