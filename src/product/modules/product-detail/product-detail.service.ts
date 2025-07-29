import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDetailEntity } from './entities/product-detail.entity';
import { In, IsNull, Like, Repository } from 'typeorm';
import { PageList } from 'src/common/models/page-list.model';
import { ProductDetailModel } from './models/product-detail.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { ProductModel } from 'src/product/models/product.model';
import { FrameShapeType, FrameType } from './enum/frame.type';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ProductDetailService {
  constructor(
    @InjectRepository(ProductDetailEntity)
    private readonly productDetailRepository: Repository<ProductDetailEntity>,
    private readonly productService: ProductService,
  ) {}

  async getProductDetails(
    productDetailIds: number[] | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<ProductDetailModel>> {
    const [productDetail, total] =
      await this.productDetailRepository.findAndCount({
        where: {
          id: productDetailIds ? In(productDetailIds) : undefined,
          deletedAt: IsNull(),
          ...(search ? { productNumber: Like(`%${search}%`) } : {}),
        },
        relations: relations,
        ...pagination?.toQuery(),
      });

    return new PageList<ProductDetailModel>(
      total,
      productDetail.map((entity) => entity.toModel()),
    );
  }

  async getProductDetailById(
    productDetailId: number,
  ): Promise<ProductDetailModel> {
    const productDetail = await this.productDetailRepository.findOne({
      where: { id: productDetailId, deletedAt: IsNull() },
    });

    if (!productDetail) {
      throw new HttpException(
        `Product detail with ID ${productDetailId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return productDetail.toModel();
  }

  async createProductDetail(
    product: ProductModel,
    productNumber: string,
    color: string,
    bridgeWidth: number,
    frameWidth: number,
    lensHeight: number,
    lensWidth: number,
    templeLength: number,
    frameColor: string,
    frameMaterial: string,
    frameShape: FrameShapeType,
    frameType: FrameType,
    springHinge: boolean,
    reqUserId: number,
  ): Promise<ProductDetailModel> {
    await this.productService.getProductById(product.id);

    const entity = new ProductDetailEntity();
    entity.productId = product.id;
    entity.productNumber = productNumber;
    entity.color = color;
    entity.bridgeWidth = bridgeWidth;
    entity.frameWidth = frameWidth;
    entity.lensHeight = lensHeight;
    entity.lensWidth = lensWidth;
    entity.templeLength = templeLength;
    entity.frameColor = frameColor;
    entity.frameMaterial = frameMaterial;
    entity.frameShape = frameShape;
    entity.frameType = frameType;
    entity.springHinge = springHinge;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    return await this.productDetailRepository.save(entity);
  }

  async updateProductDetail(
    productDetail: ProductDetailModel,
    productId: number | undefined,
    productNumber: string | undefined,
    color: string | undefined,
    bridgeWidth: number | undefined,
    frameWidth: number | undefined,
    lensHeight: number | undefined,
    lensWidth: number | undefined,
    templeLength: number | undefined,
    frameColor: string | undefined,
    frameMaterial: string | undefined,
    frameShape: FrameShapeType | undefined,
    frameType: FrameType | undefined,
    springHinge: boolean | undefined,
    reqUserId: number,
  ): Promise<ProductDetailModel> {
    await this.productDetailRepository.update(
      { id: productDetail.id, deletedAt: IsNull() },
      {
        productId: productId,
        productNumber: productNumber,
        color: color,
        bridgeWidth: bridgeWidth,
        frameWidth: frameWidth,
        lensHeight: lensHeight,
        lensWidth: lensWidth,
        templeLength: templeLength,
        frameColor: frameColor,
        frameMaterial: frameMaterial,
        frameShape: frameShape,
        frameType: frameType,
        springHinge: springHinge,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getProductDetailById(productDetail.id);
  }

  async deleteProductDetail(
    productDetail: ProductDetailModel,
    reqUserId: number,
  ): Promise<ProductDetailModel> {
    await this.productDetailRepository.update(
      { id: productDetail.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return await this.getProductDetailById(productDetail.id);
  }
}
