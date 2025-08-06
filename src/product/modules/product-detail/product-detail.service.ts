import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ProductDetailEntity } from './entities/product-detail.entity';
import { ProductDetailModel } from './models/product-detail.model';

@Injectable()
export class ProductDetailService {
  constructor(
    @InjectRepository(ProductDetailEntity)
    private readonly productDetailRepository: Repository<ProductDetailEntity>,
  ) {}

  async getProductDetailByColorId(
    productColorId: number,
  ): Promise<ProductDetailModel | null> {
    const productDetail = await this.productDetailRepository.findOne({
      where: { productColorId, deletedAt: IsNull() },
    });

    return productDetail ? productDetail.toModel() : null;
  }

  async createProductDetail(
    productColorId: number,
    detailData: {
      bridgeWidth?: number;
      frameWidth?: number;
      lensHeight?: number;
      lensWidth?: number;
      templeLength?: number;
      productNumber?: number;
      frameMaterial?: string;
      frameShape?: string;
      frameType?: string;
      bridgeDesign?: string;
      style?: string;
      springHinges?: boolean;
      weight?: number;
      multifocal?: boolean;
    },
    reqUserId: number,
  ): Promise<ProductDetailModel> {
    const entity = new ProductDetailEntity();
    entity.productColorId = productColorId;
    entity.bridgeWidth = detailData.bridgeWidth;
    entity.frameWidth = detailData.frameWidth;
    entity.lensHeight = detailData.lensHeight;
    entity.lensWidth = detailData.lensWidth;
    entity.templeLength = detailData.templeLength;
    entity.productNumber = detailData.productNumber;
    entity.frameMaterial = detailData.frameMaterial;
    entity.frameShape = detailData.frameShape;
    entity.frameType = detailData.frameType;
    entity.bridgeDesign = detailData.bridgeDesign;
    entity.style = detailData.style;
    entity.springHinges = detailData.springHinges || false;
    entity.weight = detailData.weight;
    entity.multifocal = detailData.multifocal || false;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;
    entity.updatedAt = new Date();
    entity.updatedBy = reqUserId;

    const savedDetail = await this.productDetailRepository.save(entity);
    return savedDetail.toModel();
  }

  async updateProductDetail(
    productColorId: number,
    detailData: {
      bridgeWidth?: number;
      frameWidth?: number;
      lensHeight?: number;
      lensWidth?: number;
      templeLength?: number;
      productNumber?: number;
      frameMaterial?: string;
      frameShape?: string;
      frameType?: string;
      bridgeDesign?: string;
      style?: string;
      springHinges?: boolean;
      weight?: number;
      multifocal?: boolean;
    },
    reqUserId: number,
  ): Promise<ProductDetailModel> {
    const existingDetail = await this.productDetailRepository.findOne({
      where: { productColorId, deletedAt: IsNull() },
    });

    if (existingDetail) {
      await this.productDetailRepository.update(
        { productColorId, deletedAt: IsNull() },
        {
          ...detailData,
          updatedAt: new Date(),
          updatedBy: reqUserId,
        },
      );

      const updatedDetail =
        await this.getProductDetailByColorId(productColorId);
      return updatedDetail!;
    } else {
      return await this.createProductDetail(
        productColorId,
        detailData,
        reqUserId,
      );
    }
  }

  async deleteProductDetail(
    productColorId: number,
    reqUserId: number,
  ): Promise<boolean> {
    await this.productDetailRepository.update(
      { productColorId, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
