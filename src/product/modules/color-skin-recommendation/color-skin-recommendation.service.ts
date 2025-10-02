import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';
import { ColorSkinRecommendationEntity } from './entities/color-skin-recommendation.entity';
import { ColorSkinRecommendationModel } from './models/color-skin-recommendation.model';
import { SkinColorType } from './enum/skin-color.type';
import { PaginationParamsModel } from '../../../common/models/pagination-params.model';
import { PageList } from '../../../common/models/page-list.model';

@Injectable()
export class ColorSkinRecommendationService {
  constructor(
    @InjectRepository(ColorSkinRecommendationEntity)
    private readonly colorSkinRecommendationRepository: Repository<ColorSkinRecommendationEntity>,
  ) {}

  async getColorSkinRecommendations(
    pagination: PaginationParamsModel | undefined,
    skinColorType: SkinColorType | undefined,
    productColorId: number | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<ColorSkinRecommendationModel>> {
    const [recommendations, total] =
      await this.colorSkinRecommendationRepository.findAndCount({
        where: {
          skinColorType: skinColorType,
          productColorId: productColorId,
          deletedAt: IsNull(),
        },
        relations: relations,
        ...pagination?.toQuery(),
      });

    const models = recommendations.map((recommendation) =>
      recommendation.toModel(),
    );

    return new PageList<ColorSkinRecommendationModel>(total, models);
  }

  async getColorSkinRecommendationById(
    id: number,
  ): Promise<ColorSkinRecommendationModel> {
    const recommendation = await this.colorSkinRecommendationRepository.findOne(
      {
        where: {
          id: id,
          deletedAt: IsNull(),
        },
        relations: ['productColor'],
      },
    );

    if (!recommendation) {
      throw new Error(`Color skin recommendation not found`);
    }

    return recommendation.toModel();
  }

  async getRecommendationsByProductColorId(
    productColorId: number,
  ): Promise<ColorSkinRecommendationModel[]> {
    const recommendations = await this.colorSkinRecommendationRepository.find({
      where: {
        productColorId: productColorId,
        deletedAt: IsNull(),
      },
      relations: ['productColor'],
    });

    return recommendations.map((recommendation) => recommendation.toModel());
  }

  async getRecommendationsBySkinColorType(
    skinColorType: SkinColorType,
  ): Promise<ColorSkinRecommendationModel[]> {
    const recommendations = await this.colorSkinRecommendationRepository.find({
      where: {
        skinColorType: skinColorType,
        deletedAt: IsNull(),
      },
      relations: ['productColor'],
    });

    return recommendations.map((recommendation) => recommendation.toModel());
  }

  async getProductColorIdsBySkinColorType(
    skinColorType: SkinColorType,
  ): Promise<number[]> {
    const recommendations = await this.colorSkinRecommendationRepository.find({
      where: {
        skinColorType: skinColorType,
        deletedAt: IsNull(),
      },
      select: ['productColorId'],
    });

    return recommendations.map((rec) => rec.productColorId);
  }

  async createColorSkinRecommendation(
    productColorId: number,
    skinColorType: SkinColorType,
    reqUserId: number,
  ): Promise<ColorSkinRecommendationModel> {
    // Check if recommendation already exists
    const existingRecommendation =
      await this.colorSkinRecommendationRepository.findOne({
        where: {
          productColorId: productColorId,
          skinColorType: skinColorType,
          deletedAt: IsNull(),
        },
      });

    if (existingRecommendation) {
      throw new Error(
        `Recommendation for this product color and skin color type already exists`,
      );
    }

    const entity = new ColorSkinRecommendationEntity();
    entity.productColorId = productColorId;
    entity.skinColorType = skinColorType;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;
    entity.updatedAt = new Date();
    entity.updatedBy = reqUserId;

    const savedRecommendation =
      await this.colorSkinRecommendationRepository.save(entity);

    return savedRecommendation.toModel();
  }

  async updateColorSkinRecommendation(
    recommendation: ColorSkinRecommendationModel,
    productColorId: number | undefined,
    skinColorType: SkinColorType | undefined,
    reqUserId: number,
  ): Promise<ColorSkinRecommendationModel> {
    const updateData: any = {
      productColorId: productColorId,
      skinColorType: skinColorType,
      updatedAt: new Date(),
      updatedBy: reqUserId,
    };

    await this.colorSkinRecommendationRepository.update(
      { id: recommendation.id, deletedAt: IsNull() },
      updateData,
    );

    return await this.getColorSkinRecommendationById(recommendation.id);
  }

  async deleteColorSkinRecommendation(
    recommendation: ColorSkinRecommendationModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.colorSkinRecommendationRepository.update(
      { id: recommendation.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );
    return true;
  }

  async bulkCreateRecommendations(
    productColorId: number,
    skinColorTypes: SkinColorType[],
    reqUserId: number,
  ): Promise<ColorSkinRecommendationModel[]> {
    // Check for existing recommendations
    const existingRecommendations =
      await this.colorSkinRecommendationRepository.find({
        where: {
          productColorId: productColorId,
          skinColorType: In(skinColorTypes),
          deletedAt: IsNull(),
        },
      });

    const existingSkinColorTypes = existingRecommendations.map(
      (rec) => rec.skinColorType,
    );
    const newSkinColorTypes = skinColorTypes.filter(
      (type) => !existingSkinColorTypes.includes(type),
    );

    if (newSkinColorTypes.length === 0) {
      throw new Error(
        `All recommendations for this product color already exist`,
      );
    }

    const entities = newSkinColorTypes.map((skinColorType) => {
      const entity = new ColorSkinRecommendationEntity();
      entity.productColorId = productColorId;
      entity.skinColorType = skinColorType;
      entity.createdAt = new Date();
      entity.createdBy = reqUserId;
      entity.updatedAt = new Date();
      entity.updatedBy = reqUserId;
      return entity;
    });

    const savedRecommendations =
      await this.colorSkinRecommendationRepository.save(entities);

    return savedRecommendations.map((recommendation) =>
      recommendation.toModel(),
    );
  }
}
