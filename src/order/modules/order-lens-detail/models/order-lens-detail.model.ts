export class OrderLensDetailModel {
  public id!: number;
  public orderItemId!: number;
  public lensVariantId!: number;
  public rightEyeSphere!: number;
  public rightEyeCylinder?: number;
  public rightEyeAxis?: number;
  public leftEyeSphere!: number;
  public leftEyeCylinder?: number;
  public leftEyeAxis?: number;
  public pdLeft?: number;
  public pdRight?: number;
  public addLeft?: number;
  public addRight?: number;
  public lensPrice!: number;
  public selectedCoatingIds?: string;
  public selectedTintColorId?: number;
  public prescriptionNotes?: string;
  public lensNotes?: string;
  public manufacturingNotes?: string;
  public createdAt!: Date;
  public createdBy!: number;
  public updatedAt!: Date;
  public updatedBy!: number;
  public deletedAt?: Date;
  public deletedBy?: number;

  constructor(
    id: number,
    orderItemId: number,
    lensVariantId: number,
    rightEyeSphere: number,
    rightEyeCylinder: number | undefined,
    rightEyeAxis: number | undefined,
    leftEyeSphere: number,
    leftEyeCylinder: number | undefined,
    leftEyeAxis: number | undefined,
    pdLeft: number | undefined,
    pdRight: number | undefined,
    addLeft: number | undefined,
    addRight: number | undefined,
    lensPrice: number,
    selectedCoatingIds: string | undefined,
    selectedTintColorId: number | undefined,
    prescriptionNotes: string | undefined,
    lensNotes: string | undefined,
    manufacturingNotes: string | undefined,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.orderItemId = orderItemId;
    this.lensVariantId = lensVariantId;
    this.rightEyeSphere = rightEyeSphere;
    this.rightEyeCylinder = rightEyeCylinder;
    this.rightEyeAxis = rightEyeAxis;
    this.leftEyeSphere = leftEyeSphere;
    this.leftEyeCylinder = leftEyeCylinder;
    this.leftEyeAxis = leftEyeAxis;
    this.pdLeft = pdLeft;
    this.pdRight = pdRight;
    this.addLeft = addLeft;
    this.addRight = addRight;
    this.lensPrice = lensPrice;
    this.selectedCoatingIds = selectedCoatingIds;
    this.selectedTintColorId = selectedTintColorId;
    this.prescriptionNotes = prescriptionNotes;
    this.lensNotes = lensNotes;
    this.manufacturingNotes = manufacturingNotes;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
