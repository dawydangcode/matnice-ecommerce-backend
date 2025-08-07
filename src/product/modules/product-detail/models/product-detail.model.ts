export class ProductDetailModel {
  public readonly id: number;
  public readonly productId: number;
  public readonly bridgeWidth: number;
  public readonly frameWidth: number;
  public readonly lensHeight: number;
  public readonly lensWidth: number;
  public readonly templeLength: number;
  public readonly productNumber: number;
  public readonly frameMaterial: string;
  public readonly frameShape: string;
  public readonly frameType: string;
  public readonly bridgeDesign: string;
  public readonly style: string;
  public readonly springHinges: boolean = false;
  public readonly weight: number;
  public readonly multifocal: boolean = false;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    productId: number,
    bridgeWidth: number,
    frameWidth: number,
    lensHeight: number,
    lensWidth: number,
    templeLength: number,
    productNumber: number,
    frameMaterial: string,
    frameShape: string,
    frameType: string,
    bridgeDesign: string,
    style: string,
    weight: number,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.productId = productId;
    this.bridgeWidth = bridgeWidth;
    this.frameWidth = frameWidth;
    this.lensHeight = lensHeight;
    this.lensWidth = lensWidth;
    this.templeLength = templeLength;
    this.productNumber = productNumber;
    this.frameMaterial = frameMaterial;
    this.frameShape = frameShape;
    this.frameType = frameType;
    this.bridgeDesign = bridgeDesign;
    this.style = style;
    this.weight = weight;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
