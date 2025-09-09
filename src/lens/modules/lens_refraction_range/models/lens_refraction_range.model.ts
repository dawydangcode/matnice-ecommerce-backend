import { LensRefractionType } from '../enum/lens-refraction.type';

export class LensRefractionRangeModel {
  public readonly id: number;
  public readonly lensVariantId: number;
  public readonly refractionType: LensRefractionType; // Cận, Loạn, Viễn, ADD
  public readonly minValue: number;
  public readonly maxValue: number;
  public readonly stepValue: number;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    lensVariantId: number,
    refractionType: LensRefractionType,
    minValue: number,
    maxValue: number,
    stepValue: number,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
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
