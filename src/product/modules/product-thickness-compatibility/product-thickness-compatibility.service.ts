import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ProductThicknessCompatibilityEntity } from './entities/product-thickness-compatibility.entity';
import { ProductThicknessCompatibilityModel } from './models/product-thickness-compatibility.model';

@Injectable()
export class ProductThicknessCompatibilityService {
  constructor(
    @InjectRepository(ProductThicknessCompatibilityEntity)
    private readonly compatibilityRepository: Repository<ProductThicknessCompatibilityEntity>,
  ) {}

  async getCompatibilities(
    productId?: number,
    lensThicknessId?: number,
  ): Promise<ProductThicknessCompatibilityModel[]> {
    const compatibilities = await this.compatibilityRepository.find({
      where: {
        productId: productId,
        lensThicknessId: lensThicknessId,
        deletedAt: IsNull(),
      },
      relations: ['product', 'lensThickness'],
    });

    return compatibilities.map((compatibility) => compatibility.toModel());
  }

  async getCompatibleThicknessIdsByProductId(
    productId: number,
  ): Promise<number[]> {
    const compatibilities = await this.compatibilityRepository.find({
      where: {
        productId: productId,
        deletedAt: IsNull(),
      },
    });

    return compatibilities.map(
      (compatibility) => compatibility.lensThicknessId,
    );
  }

  async getCompatibleProductIdsByThicknessId(
    lensThicknessId: number,
  ): Promise<number[]> {
    const compatibilities = await this.compatibilityRepository.find({
      where: {
        lensThicknessId: lensThicknessId,
        deletedAt: IsNull(),
      },
    });

    return compatibilities.map((compatibility) => compatibility.productId);
  }

  async isCompatible(
    productId: number,
    lensThicknessId: number,
  ): Promise<boolean> {
    const compatibility = await this.compatibilityRepository.findOne({
      where: {
        productId: productId,
        lensThicknessId: lensThicknessId,
        deletedAt: IsNull(),
      },
    });

    return !!compatibility;
  }

  async createCompatibility(
    productId: number,
    lensThicknessId: number,
    reqUserId: number,
  ): Promise<ProductThicknessCompatibilityModel> {
    // Check if relationship already exists
    const existing = await this.compatibilityRepository.findOne({
      where: {
        productId: productId,
        lensThicknessId: lensThicknessId,
        deletedAt: IsNull(),
      },
    });

    if (existing) {
      throw new HttpException(
        'Product thickness compatibility already exists',
        HttpStatus.CONFLICT,
      );
    }

    const entity = new ProductThicknessCompatibilityEntity();
    entity.productId = productId;
    entity.lensThicknessId = lensThicknessId;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;
    entity.updatedAt = new Date();
    entity.updatedBy = reqUserId;

    const savedEntity = await this.compatibilityRepository.save(entity);
    return savedEntity.toModel();
  }

  async updateProductCompatibilities(
    productId: number,
    lensThicknessIds: number[],
    reqUserId: number,
  ): Promise<ProductThicknessCompatibilityModel[]> {
    await this.compatibilityRepository.update(
      { productId: productId, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    // Create new compatibilities
    const newCompatibilities: ProductThicknessCompatibilityModel[] = [];
    for (const lensThicknessId of lensThicknessIds) {
      try {
        const compatibility = await this.createCompatibility(
          productId,
          lensThicknessId,
          reqUserId,
        );
        newCompatibilities.push(compatibility);
      } catch (error) {
        // Skip if already exists (edge case)
        if (
          error instanceof HttpException &&
          error.getStatus() === HttpStatus.CONFLICT
        ) {
          continue;
        }
        throw error;
      }
    }

    return newCompatibilities;
  }

  async deleteCompatibility(
    productId: number,
    lensThicknessId: number,
    reqUserId: number,
  ): Promise<boolean> {
    const compatibility = await this.compatibilityRepository.findOne({
      where: {
        productId: productId,
        lensThicknessId: lensThicknessId,
        deletedAt: IsNull(),
      },
    });

    if (!compatibility) {
      throw new HttpException(
        'Product thickness compatibility not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.compatibilityRepository.update(
      { id: compatibility.id },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async deleteCompatibilitiesByProductId(
    productId: number,
    reqUserId: number,
  ): Promise<boolean> {
    await this.compatibilityRepository.update(
      { productId: productId, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
