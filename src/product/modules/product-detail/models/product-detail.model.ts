export class ProductDetailModel {
  public readonly id: number;
  public readonly productId: number;
  public readonly productNumber: string;
  public readonly color: string;
  public readonly bridgeWidth: number;
  public readonly frameWidth: number;
  public readonly lensHeight: number;
  public readonly lensWidth: number;
  public readonly templeLength: number;
  public readonly frameColor: string;
  public readonly frameMaterial: string;
  public readonly frameShape: string;
  public readonly frameType: string;
  public readonly springHinge: boolean;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    productId: number,
    productNumber: string,
    color: string,
    bridgeWidth: number,
    frameWidth: number,
    lensHeight: number,
    lensWidth: number,
    templeLength: number,
    frameColor: string,
    frameMaterial: string,
    frameShape: string,
    frameType: string,
    springHinge: boolean,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.productId = productId;
    this.productNumber = productNumber;
    this.color = color;
    this.bridgeWidth = bridgeWidth;
    this.frameWidth = frameWidth;
    this.lensHeight = lensHeight;
    this.lensWidth = lensWidth;
    this.templeLength = templeLength;
    this.frameColor = frameColor;
    this.frameMaterial = frameMaterial;
    this.frameShape = frameShape;
    this.frameType = frameType;
    this.springHinge = springHinge;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
