import { FrameShapeType } from '../enum/frame.type';

export class ProductDetailModel {
  public readonly id: number;
  public readonly productId: number;
  public readonly productNumber: string;
  public readonly bridgeWidth: number;
  public readonly frameWidth: number;
  public readonly lensHeight: number;
  public readonly lensWidth: number;
  public readonly templeLength: number;
  public readonly frameColor: string;
  public readonly frameMaterial: string;
  public readonly frameShape: FrameShapeType;
  public readonly frameType: string;
  public readonly bridgeDesign: string;
  public readonly style: string;
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
    bridgeWidth: number,
    frameWidth: number,
    lensHeight: number,
    lensWidth: number,
    templeLength: number,
    frameColor: string,
    frameMaterial: string,
    frameShape: FrameShapeType,
    frameType: string,
    bridgeDesign: string,
    style: string,
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
    this.bridgeWidth = bridgeWidth;
    this.frameWidth = frameWidth;
    this.lensHeight = lensHeight;
    this.lensWidth = lensWidth;
    this.templeLength = templeLength;
    this.frameColor = frameColor;
    this.frameMaterial = frameMaterial;
    this.frameShape = frameShape;
    this.frameType = frameType;
    this.bridgeDesign = bridgeDesign;
    this.style = style;
    this.springHinge = springHinge;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
