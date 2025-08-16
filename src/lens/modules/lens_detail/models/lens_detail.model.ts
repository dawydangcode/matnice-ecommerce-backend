export class LensDetailModel {
  public readonly id: number;
  public readonly lensId: number;
  public readonly lensThicknessId: number | undefined;
  public readonly lensQualityId: number | undefined;
  public readonly tintId: number | undefined;
  public readonly powerSphereLeft: number | undefined;
  public readonly powerSphereRight: number | undefined;
  public readonly powerCylinderLeft: number | undefined;
  public readonly powerCylinderRight: number | undefined;
  public readonly axisLeft: number | undefined;
  public readonly axisRight: number | undefined;
  public readonly pdLeft: number | undefined;
  public readonly pdRight: number | undefined;
  public readonly prescriptionDate: Date | undefined;
  public readonly lensType: string;
  public readonly hasAxisCorrection: boolean | undefined;
  public readonly isNonPrescription: boolean;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    lensId: number,
    lensThicknessId: number | undefined,
    lensQualityId: number | undefined,
    tintId: number | undefined,
    powerSphereLeft: number | undefined,
    powerSphereRight: number | undefined,
    powerCylinderLeft: number | undefined,
    powerCylinderRight: number | undefined,
    axisLeft: number | undefined,
    axisRight: number | undefined,
    pdLeft: number | undefined,
    pdRight: number | undefined,
    prescriptionDate: Date,
    lensType: string,
    hasAxisCorrection: boolean | undefined,
    isNonPrescription: boolean,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.lensId = lensId;
    this.lensThicknessId = lensThicknessId;
    this.lensQualityId = lensQualityId;
    this.tintId = tintId;
    this.powerSphereLeft = powerSphereLeft;
    this.powerSphereRight = powerSphereRight;
    this.powerCylinderLeft = powerCylinderLeft;
    this.powerCylinderRight = powerCylinderRight;
    this.axisLeft = axisLeft;
    this.axisRight = axisRight;
    this.pdLeft = pdLeft;
    this.pdRight = pdRight;
    this.prescriptionDate = prescriptionDate;
    this.lensType = lensType;
    this.hasAxisCorrection = hasAxisCorrection;
    this.isNonPrescription = isNonPrescription;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
