import {
  FrameBridgeDesignType,
  FrameMaterialType,
  FrameShapeType,
  FrameStyleType,
  FrameType,
} from '../enum/frame.type';

export class ProductDetailModel {
  public readonly id: number;
  public readonly productId: number;
  public readonly productNumber: number;
  public readonly bridgeWidth: number;
  public readonly frameWidth: number;
  public readonly lensHeight: number;
  public readonly lensWidth: number;
  public readonly templeLength: number;
  public readonly frameMaterial: FrameMaterialType;
  public readonly frameShape: FrameShapeType;
  public readonly frameType: FrameType;
  public readonly bridgeDesign: FrameBridgeDesignType;
  public readonly style: FrameStyleType;
  public readonly springHinges: boolean;
  public readonly weight: number;
  public readonly multifocal: boolean;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    productId: number,
    productNumber: number,
    bridgeWidth: number,
    frameWidth: number,
    lensHeight: number,
    lensWidth: number,
    templeLength: number,
    frameMaterial: FrameMaterialType,
    frameShape: FrameShapeType,
    frameType: FrameType,
    bridgeDesign: FrameBridgeDesignType,
    style: FrameStyleType,
    springHinges: boolean,
    weight: number,
    multifocal: boolean,
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
    this.frameMaterial = frameMaterial;
    this.frameShape = frameShape;
    this.frameType = frameType;
    this.bridgeDesign = bridgeDesign;
    this.style = style;
    this.springHinges = springHinges;
    this.weight = weight;
    this.multifocal = multifocal;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
