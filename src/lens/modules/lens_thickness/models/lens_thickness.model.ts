export class LensThicknessModel {
  public readonly id: number;
  public readonly name: string;
  public readonly description?: string;
  public readonly thickness?: number;
  public readonly unit?: string;
  public readonly isActive: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly createdBy?: number;
  public readonly updatedBy?: number;
  public readonly deletedAt?: Date;
  public readonly deletedBy?: number;

  constructor(
    id: number,
    name: string,
    description: string | undefined,
    thickness: number | undefined,
    unit: string | undefined,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
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
