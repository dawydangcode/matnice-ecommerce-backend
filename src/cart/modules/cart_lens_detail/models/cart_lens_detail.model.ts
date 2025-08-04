export class CartLensDetailModel {
  public readonly id: number;
  public readonly cartFrameId: number;
  public readonly lensId: number | null;
  public readonly rightEyeSphere: number | null;
  public readonly rightEyeCylinder: number | null;
  public readonly rightEyeAxis: number | null;
  public readonly leftEyeSphere: number | null;
  public readonly leftEyeCylinder: number | null;
  public readonly leftEyeAxis: number | null;
  public readonly pdLeft: number | null;
  public readonly pdRight: number | null;
  public readonly lensType: string | null;
  public readonly lensQuality: string;
  public readonly lensThicknessId: number | null;
  public readonly lensUpgradeDetailId: number | null;
  public readonly totalUpgradesPrice: number;
  public readonly lensPrice: number;
  public readonly lensMaterial: string | null;
  public readonly tintId: number | null;
  public readonly prescriptionNotes: string | null;
  public readonly lensNotes: string | null;
  public readonly manufacturingNotes: string | null;
  public readonly fieldOfVision: string | null;
  public readonly addLeft: number | null;
  public readonly addRight: number | null;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date;
  public readonly updatedBy: number;
  public readonly deletedAt: Date | null;
  public readonly deletedBy: number | null;

  constructor(
    id: number,
    cartFrameId: number,
    lensId: number | null,
    rightEyeSphere: number | null,
    rightEyeCylinder: number | null,
    rightEyeAxis: number | null,
    leftEyeSphere: number | null,
    leftEyeCylinder: number | null,
    leftEyeAxis: number | null,
    pdLeft: number | null,
    pdRight: number | null,
    lensType: string | null,
    lensQuality: string,
    lensThicknessId: number | null,
    lensUpgradeDetailId: number | null,
    totalUpgradesPrice: number,
    lensPrice: number,
    lensMaterial: string | null,
    tintId: number | null,
    prescriptionNotes: string | null,
    lensNotes: string | null,
    manufacturingNotes: string | null,
    fieldOfVision: string | null,
    addLeft: number | null,
    addRight: number | null,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | null,
    deletedBy: number | null,
  ) {
    this.id = id;
    this.cartFrameId = cartFrameId;
    this.lensId = lensId;
    this.rightEyeSphere = rightEyeSphere;
    this.rightEyeCylinder = rightEyeCylinder;
    this.rightEyeAxis = rightEyeAxis;
    this.leftEyeSphere = leftEyeSphere;
    this.leftEyeCylinder = leftEyeCylinder;
    this.leftEyeAxis = leftEyeAxis;
    this.pdLeft = pdLeft;
    this.pdRight = pdRight;
    this.lensType = lensType;
    this.lensQuality = lensQuality;
    this.lensThicknessId = lensThicknessId;
    this.lensUpgradeDetailId = lensUpgradeDetailId;
    this.totalUpgradesPrice = totalUpgradesPrice;
    this.lensPrice = lensPrice;
    this.lensMaterial = lensMaterial;
    this.tintId = tintId;
    this.prescriptionNotes = prescriptionNotes;
    this.lensNotes = lensNotes;
    this.manufacturingNotes = manufacturingNotes;
    this.fieldOfVision = fieldOfVision;
    this.addLeft = addLeft;
    this.addRight = addRight;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
