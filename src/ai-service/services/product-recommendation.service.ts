import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';
import { GenderType } from 'src/user/modules/user-detail/enums/gender.type';
import { FaceShapeType } from '../enum/detect-face-shape.type';
import { SkinColorType } from 'src/product/modules/color-skin-recommendation/enum/skin-color.type';
import { ProductColorEntity } from 'src/product/modules/product-color/entities/product-color.entity';
import { ColorSkinRecommendationEntity } from 'src/product/modules/color-skin-recommendation/entities/color-skin-recommendation.entity';
import { FrameShapeType } from 'src/product/modules/product-detail/enum/frame.type';

export interface AIAnalysisResult {
  gender: {
    detected: string;
    confidence: number;
  };
  SkinColor: {
    detected: string;
    confidence: number;
  };
  faceShape: {
    detected: string;
    confidence: number;
  };
}

export interface ProductRecommendationFilter {
  gender?: GenderType;
  faceShape?: FaceShapeType;
  skinColor?: SkinColorType;
  page?: number;
  limit?: number;
}

@Injectable()
export class ProductRecommendationService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductColorEntity)
    private readonly productColorRepository: Repository<ProductColorEntity>,
    @InjectRepository(ColorSkinRecommendationEntity)
    private readonly colorSkinRecommendationRepository: Repository<ColorSkinRecommendationEntity>,
  ) {}

  /**
   * Get recommended frame shapes based on face shape
   */
  private getRecommendedFrameShapes(
    faceShape: FaceShapeType,
  ): FrameShapeType[] {
    const recommendations: Record<FaceShapeType, FrameShapeType[]> = {
      [FaceShapeType.OVAL]: [
        FrameShapeType.SQUARE,
        FrameShapeType.CAT_EYE,
        FrameShapeType.ROUND,
        FrameShapeType.RECTANGLE,
        FrameShapeType.BROWLINE,
        FrameShapeType.AVIATOR,
        FrameShapeType.NARROW,
        FrameShapeType.OVAL,
      ], // Oval face is versatile, can wear most frame types

      [FaceShapeType.ROUND]: [
        FrameShapeType.SQUARE,
        FrameShapeType.RECTANGLE,
        FrameShapeType.BROWLINE,
      ], // Angular frames to elongate round face

      [FaceShapeType.SQUARE]: [
        FrameShapeType.ROUND,
        FrameShapeType.OVAL,
        FrameShapeType.AVIATOR,
      ], // Soft, curved frames to soften angular features

      [FaceShapeType.HEART]: [
        FrameShapeType.AVIATOR,
        FrameShapeType.CAT_EYE,
        FrameShapeType.NARROW,
      ], // Bottom-heavy or upswept frames to balance pointed chin

      [FaceShapeType.OBLONG]: [
        FrameShapeType.AVIATOR,
        FrameShapeType.BROWLINE,
        FrameShapeType.RECTANGLE,
      ], // Wide frames to shorten face length
    };

    return recommendations[faceShape] || [];
  }

  /**
   * Map AI detected values to enum types
   */
  private mapAIResultToEnums(analysis: AIAnalysisResult): {
    gender: GenderType;
    faceShape: FaceShapeType;
    skinColor: SkinColorType;
  } {
    // Map gender
    let gender: GenderType;
    switch (analysis.gender.detected.toLowerCase()) {
      case 'male':
        gender = GenderType.MALE;
        break;
      case 'female':
        gender = GenderType.FEMALE;
        break;
      default:
        gender = GenderType.UNISEX;
    }

    // Map face shape
    let faceShape: FaceShapeType;
    switch (analysis.faceShape.detected.toLowerCase()) {
      case 'oval':
        faceShape = FaceShapeType.OVAL;
        break;
      case 'round':
        faceShape = FaceShapeType.ROUND;
        break;
      case 'square':
        faceShape = FaceShapeType.SQUARE;
        break;
      case 'heart':
        faceShape = FaceShapeType.HEART;
        break;
      case 'oblong':
        faceShape = FaceShapeType.OBLONG;
        break;
      default:
        faceShape = FaceShapeType.OVAL; // Default fallback
    }

    // Map skin color
    let skinColor: SkinColorType;
    switch (analysis.SkinColor.detected.toLowerCase()) {
      case 'light':
        skinColor = SkinColorType.LIGHT;
        break;
      case 'medium':
        skinColor = SkinColorType.MEDIUM;
        break;
      case 'dark':
        skinColor = SkinColorType.DARK;
        break;
      default:
        skinColor = SkinColorType.MEDIUM; // Default fallback
    }

    return { gender, faceShape, skinColor };
  }

  /**
   * Get product recommendations based on AI analysis
   */
  async getProductRecommendations(
    analysis: AIAnalysisResult,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    products: ProductEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    recommendations: {
      gender: GenderType;
      faceShape: FaceShapeType;
      skinColor: SkinColorType;
      recommendedFrameShapes: FrameShapeType[];
    };
  }> {
    const { gender, faceShape, skinColor } = this.mapAIResultToEnums(analysis);
    const recommendedFrameShapes = this.getRecommendedFrameShapes(faceShape);

    // Get product color IDs that match the skin color
    const colorRecommendations =
      await this.colorSkinRecommendationRepository.find({
        where: { skinColorType: skinColor },
        relations: ['productColor'],
      });

    const recommendedProductColorIds = colorRecommendations
      .filter((rec) => rec.productColor) // Filter out undefined productColor
      .map((rec) => rec.productColor!.id);

    // Build query for products
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productColors', 'productColor')
      .leftJoinAndSelect(
        'productColor.productImage',
        'productImage',
        "productImage.imageOrder = 'a'",
      )
      .leftJoinAndSelect('product.productDetail', 'productDetail')
      .where('product.deletedAt IS NULL');

    // Filter by gender
    queryBuilder.andWhere(
      '(product.gender = :gender OR product.gender = :unisex)',
      {
        gender,
        unisex: GenderType.UNISEX,
      },
    );

    // Filter by frame shape (recommended for face shape)
    if (recommendedFrameShapes.length > 0) {
      queryBuilder.andWhere('productDetail.frameShape IN (:...frameShapes)', {
        frameShapes: recommendedFrameShapes,
      });
    }

    // Filter by skin color compatible product colors
    if (recommendedProductColorIds.length > 0) {
      queryBuilder.andWhere('productColor.id IN (:...colorIds)', {
        colorIds: recommendedProductColorIds,
      });
    }

    // Add pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Order by created date (newest first)
    queryBuilder.orderBy('product.createdAt', 'DESC');

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      recommendations: {
        gender,
        faceShape,
        skinColor,
        recommendedFrameShapes,
      },
    };
  }

  /**
   * Get products with custom filters
   */
  async getFilteredProducts(filters: ProductRecommendationFilter): Promise<{
    products: ProductEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { gender, faceShape, skinColor, page = 1, limit = 20 } = filters;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productColors', 'productColor')
      .leftJoinAndSelect(
        'productColor.productImage',
        'productImage',
        "productImage.imageOrder = 'a'",
      )
      .leftJoinAndSelect('product.productDetail', 'productDetail')
      .where('product.deletedAt IS NULL');

    // Apply filters
    if (gender) {
      queryBuilder.andWhere(
        '(product.gender = :gender OR product.gender = :unisex)',
        {
          gender,
          unisex: GenderType.UNISEX,
        },
      );
    }

    if (faceShape) {
      const recommendedFrameShapes = this.getRecommendedFrameShapes(faceShape);
      if (recommendedFrameShapes.length > 0) {
        queryBuilder.andWhere('productDetail.frameShape IN (:...frameShapes)', {
          frameShapes: recommendedFrameShapes,
        });
      }
    }

    if (skinColor) {
      // Get product color IDs that match the skin color
      const colorRecommendations =
        await this.colorSkinRecommendationRepository.find({
          where: { skinColorType: skinColor },
          relations: ['productColor'],
        });

      const recommendedProductColorIds = colorRecommendations
        .filter((rec) => rec.productColor) // Filter out undefined productColor
        .map((rec) => rec.productColor!.id);

      if (recommendedProductColorIds.length > 0) {
        queryBuilder.andWhere('productColor.id IN (:...colorIds)', {
          colorIds: recommendedProductColorIds,
        });
      }
    }

    // Add pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Order by created date (newest first)
    queryBuilder.orderBy('product.createdAt', 'DESC');

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
