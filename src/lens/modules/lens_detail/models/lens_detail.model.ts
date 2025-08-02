export class LensDetailModel {
  public readonly id: number;
  public readonly lensId: number;
  public readonly lensType: string | null;
  public readonly lensThicknessId: number | null;
  public readonly qualityType: string | null;
  public readonly qualityPrice: number | null;
  public readonly tintId: number | null;
  public readonly powerSphereLeft: number | null;
  public readonly powerSphereRight: number | null;
  public readonly powerCylinderLeft: number | null;
  public readonly powerCylinderRight: number | null;
  public readonly axisLeft: number | null;
  public readonly axisRight: number | null;
  public readonly pdLeft: number | null;
  public readonly pdRight: number | null;
  public readonly prescriptionDate: Date | null;
  public readonly material: string | null;
  public readonly coating: string | null;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date;
  public readonly updatedBy: number;
  public readonly deletedAt: Date | null;
  public readonly deletedBy: number | null;

  constructor(
    id: number,
    lensId: number,
    lensType: string | null,
    lensThicknessId: number | null,
    qualityType: string | null,
    qualityPrice: number | null,
    tintId: number | null,
    powerSphereLeft: number | null,
    powerSphereRight: number | null,
    powerCylinderLeft: number | null,
    powerCylinderRight: number | null,
    axisLeft: number | null,
    axisRight: number | null,
    pdLeft: number | null,
    pdRight: number | null,
    prescriptionDate: Date | null,
    material: string | null,
    coating: string | null,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | null,
    deletedBy: number | null,
  ) {
    this.id = id;
    this.lensId = lensId;
    this.lensType = lensType;
    this.lensThicknessId = lensThicknessId;
    this.qualityType = qualityType;
    this.qualityPrice = qualityPrice;
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
    this.material = material;
    this.coating = coating;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
