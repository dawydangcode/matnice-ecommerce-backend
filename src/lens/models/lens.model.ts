import { LensStatusType } from '../enum/lens-status.type';
import { LensType } from '../enum/lens.type';

export class LensModel {
  public readonly id: number;
  public readonly name: string;
  public readonly brandId: number;
  public readonly origin: string;
  public readonly lensType: LensType;
  public readonly status: LensStatusType;
  public readonly description: string | undefined;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date;
  public readonly updatedBy: number;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    name: string,
    brandId: number,
    origin: string,
    lensType: LensType,
    status: LensStatusType,
    description: string | undefined,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.name = name;
    this.brandId = brandId;
    this.origin = origin;
    this.lensType = lensType;
    this.status = status;
    this.description = description;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
