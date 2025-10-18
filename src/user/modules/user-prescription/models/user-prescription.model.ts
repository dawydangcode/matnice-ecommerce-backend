export class UserPrescriptionModel {
  public readonly id: number;
  public readonly userId: number;
  public readonly rightEyeSph: number;
  public readonly rightEyeCyl: number;
  public readonly rightEyeAxis: number;
  public readonly rightEyeAdd: number | undefined;
  public readonly leftEyeSph: number;
  public readonly leftEyeCyl: number;
  public readonly leftEyeAxis: number;
  public readonly leftEyeAdd: number | undefined;
  public readonly pdRight: number;
  public readonly pdLeft: number;
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
    rightEyeSph: number,
    rightEyeCyl: number,
    rightEyeAxis: number,
    rightEyeAdd: number | undefined,
    leftEyeSph: number,
    leftEyeCyl: number,
    leftEyeAxis: number,
    leftEyeAdd: number | undefined,
    pdRight: number,
    pdLeft: number,
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
    this.rightEyeSph = rightEyeSph;
    this.rightEyeCyl = rightEyeCyl;
    this.rightEyeAxis = rightEyeAxis;
    this.rightEyeAdd = rightEyeAdd;
    this.leftEyeSph = leftEyeSph;
    this.leftEyeCyl = leftEyeCyl;
    this.leftEyeAxis = leftEyeAxis;
    this.leftEyeAdd = leftEyeAdd;
    this.pdRight = pdRight;
    this.pdLeft = pdLeft;
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
