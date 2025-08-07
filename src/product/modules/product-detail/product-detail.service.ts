import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ProductDetailEntity } from './entities/product-detail.entity';
import { ProductDetailModel } from './models/product-detail.model';
import { ProductService } from 'src/product/product.service';
import { ProductModel } from 'src/product/models/product.model';
import {
  FrameBridgeDesignType,
  FrameMaterialType,
  FrameShapeType,
  FrameStyleType,
  FrameType,
} from './enum/frame.type';

@Injectable()
export class ProductDetailService {
  constructor(
    @InjectRepository(ProductDetailEntity)
    private readonly productDetailRepository: Repository<ProductDetailEntity>,
  ) {}

  async getProductDetailById(
    productDetailId: number,
  ): Promise<ProductDetailModel> {
    const productDetail = await this.productDetailRepository.findOne({
      where: { id: productDetailId, deletedAt: IsNull() },
    });
    if (!productDetail) {
      throw new Error('Product detail not found');
    }
    return productDetail.toModel();
  }

  async getProductDetailByProductId(
    product: ProductModel,
  ): Promise<ProductDetailModel> {
    const productDetail = await this.productDetailRepository.findOne({
      where: { productId: product.id, deletedAt: IsNull() },
    });
    if (!productDetail) {
      throw new Error('Product detail not found');
    }

    return productDetail.toModel();
  }

  async createProductDetail(
    productId: number,
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
    reqUserId: number,
  ): Promise<ProductDetailModel> {
    const entity = new ProductDetailEntity();
    entity.productId = productId;
    entity.bridgeWidth = bridgeWidth;
    entity.frameWidth = frameWidth;
    entity.lensHeight = lensHeight;
    entity.lensWidth = lensWidth;
    entity.templeLength = templeLength;
    entity.frameMaterial = frameMaterial;
    entity.frameShape = frameShape;
    entity.frameType = frameType;
    entity.bridgeDesign = bridgeDesign;
    entity.style = style;
    entity.springHinges = springHinges;
    entity.weight = weight;
    entity.multifocal = multifocal;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedDetail = await this.productDetailRepository.save(entity);
    return savedDetail.toModel();
  }

  async updateProductDetail(
    productDetail: ProductDetailModel,
    productId: number | undefined,
    bridgeWidth: number | undefined,
    frameWidth: number | undefined,
    lensHeight: number | undefined,
    lensWidth: number | undefined,
    templeLength: number | undefined,
    frameMaterial: FrameMaterialType | undefined,
    frameShape: FrameShapeType | undefined,
    frameType: FrameType | undefined,
    bridgeDesign: FrameBridgeDesignType | undefined,
    style: FrameStyleType | undefined,
    springHinges: boolean | undefined,
    weight: number | undefined,
    multifocal: boolean | undefined,
    reqUserId: number,
  ): Promise<ProductDetailModel> {
    await this.productDetailRepository.update(
      { id: productDetail.id, productId: productId, deletedAt: IsNull() },
      {
        bridgeWidth: bridgeWidth,
        frameWidth: frameWidth,
        lensHeight: lensHeight,
        lensWidth: lensWidth,
        templeLength: templeLength,
        frameMaterial: frameMaterial,
        frameShape: frameShape,
        frameType: frameType,
        bridgeDesign: bridgeDesign,
        style: style,
        springHinges: springHinges,
        weight: weight,
        multifocal: multifocal,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return this.getProductDetailById(productDetail.id);
  }

  async deleteProductDetail(
    productDetail: ProductDetailModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.productDetailRepository.update(
      { id: productDetail.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
