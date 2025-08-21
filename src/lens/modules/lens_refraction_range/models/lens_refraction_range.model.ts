export class LensRefractionRangeModel {
  public readonly id: number;
  public readonly lensVariantId: number;
  public readonly refractionType: string; // Cận, Loạn, Viễn, ADD
  public readonly minValue: number;
  public readonly maxValue: number;
  public readonly stepValue: number;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt?: Date;
  public readonly updatedBy?: number;
  public readonly deletedAt?: Date;
  public readonly deletedBy?: number;

  constructor(
    id: number,
    lensVariantId: number,
    refractionType: string,
    minValue: number,
    maxValue: number,
    stepValue: number,
    createdAt: Date = new Date(),
    createdBy: number = 0,
    updatedAt?: Date,
    updatedBy?: number,
    deletedAt?: Date,
    deletedBy?: number,
  ) {
    this.id = id;
    this.lensVariantId = lensVariantId;
    this.refractionType = refractionType;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.stepValue = stepValue;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
