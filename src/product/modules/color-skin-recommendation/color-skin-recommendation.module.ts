import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorSkinRecommendationEntity } from './entities/color-skin-recommendation.entity';
import { ColorSkinRecommendationService } from './color-skin-recommendation.service';
import { ColorSkinRecommendationController } from './color-skin-recommendation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ColorSkinRecommendationEntity])],
  controllers: [ColorSkinRecommendationController],
  providers: [ColorSkinRecommendationService],
  exports: [ColorSkinRecommendationService],
})
export class ColorSkinRecommendationModule {}
