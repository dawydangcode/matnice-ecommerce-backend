export class CartLensDetailModel {
  public readonly id: number;
  public readonly cartFrameId: number;
  public readonly lensId: number | undefined;
  public readonly rightEyeSphere: number | undefined;
  public readonly rightEyeCylinder: number | undefined;
  public readonly rightEyeAxis: number | undefined;
  public readonly leftEyeSphere: number | undefined;
  public readonly leftEyeCylinder: number | undefined;
  public readonly leftEyeAxis: number | undefined;
  public readonly pdLeft: number | undefined;
  public readonly pdRight: number | undefined;
  public readonly lensType: string | undefined;
  public readonly lensQuality: string;
  public readonly lensThicknessId: number | undefined;
  public readonly lensUpgradeDetailId: number | undefined;
  public readonly totalUpgradesPrice: number;
  public readonly lensPrice: number;
  public readonly lensMaterial: string | undefined;
  public readonly tintId: number | undefined;
  public readonly prescriptionNotes: string | undefined;
  public readonly lensNotes: string | undefined;
  public readonly manufacturingNotes: string | undefined;
  public readonly fieldOfVision: string | undefined;
  public readonly addLeft: number | undefined;
  public readonly addRight: number | undefined;
  // New fields for lens products
  public readonly selectedCoatingIds: string | null;
  public readonly selectedTintColorId: number | null;
  public readonly lensVariantId: number | null;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date;
  public readonly updatedBy: number;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    cartFrameId: number,
    lensId: number | undefined,
    rightEyeSphere: number | undefined,
    rightEyeCylinder: number | undefined,
    rightEyeAxis: number | undefined,
    leftEyeSphere: number | undefined,
    leftEyeCylinder: number | undefined,
    leftEyeAxis: number | undefined,
    pdLeft: number | undefined,
    pdRight: number | undefined,
    lensType: string | undefined,
    lensQuality: string,
    lensThicknessId: number | undefined,
    lensUpgradeDetailId: number | undefined,
    totalUpgradesPrice: number,
    lensPrice: number,
    lensMaterial: string | undefined,
    tintId: number | undefined,
    prescriptionNotes: string | undefined,
    lensNotes: string | undefined,
    manufacturingNotes: string | undefined,
    fieldOfVision: string | undefined,
    addLeft: number | undefined,
    addRight: number | undefined,
    selectedCoatingIds: string | null,
    selectedTintColorId: number | null,
    lensVariantId: number | null,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
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
    this.selectedCoatingIds = selectedCoatingIds;
    this.selectedTintColorId = selectedTintColorId;
    this.lensVariantId = lensVariantId;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
