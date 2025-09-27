export class UserAddressModel {
  public readonly id: number;
  public readonly userId: number;
  public readonly province: string;
  public readonly district: string;
  public readonly ward: string;
  public readonly addressDetail: string;
  public readonly isDefault: boolean;
  public readonly notes: string | undefined;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    userId: number,
    province: string,
    district: string,
    ward: string,
    addressDetail: string,
    isDefault: boolean,
    notes: string | undefined,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.userId = userId;
    this.province = province;
    this.district = district;
    this.ward = ward;
    this.addressDetail = addressDetail;
    this.isDefault = isDefault;
    this.notes = notes;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
