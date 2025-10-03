import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AIServiceController } from './ai-service.controller';
import { AIServiceService } from './ai-service.service';
import { FaceAnalysisEntity } from './entities/face-analysis.entity';
import { SessionEntity } from '../common/entities/session.entity';
import { AwsS3Service } from '../common/services/aws-s3.service';
import { SessionService } from '../common/services/session.service';
import { ProductRecommendationController } from './controllers/product-recommendation.controller';
import { ProductRecommendationService } from './services/product-recommendation.service';
import { ProductEntity } from '../product/entities/product.entity';
import { ProductColorEntity } from '../product/modules/product-color/entities/product-color.entity';
import { ColorSkinRecommendationEntity } from '../product/modules/color-skin-recommendation/entities/color-skin-recommendation.entity';
import { ProductImageEntity } from '../product/modules/product-image/entities/product-image.entity';
import { ProductDetailEntity } from '../product/modules/product-detail/entities/product-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FaceAnalysisEntity,
      SessionEntity,
      ProductEntity,
      ProductColorEntity,
      ColorSkinRecommendationEntity,
      ProductImageEntity,
      ProductDetailEntity,
    ]),
    ConfigModule,
  ],
  controllers: [AIServiceController, ProductRecommendationController],
  providers: [
    AIServiceService,
    SessionService,
    AwsS3Service,
    ProductRecommendationService,
  ],
  exports: [AIServiceService, SessionService, ProductRecommendationService],
})
export class AIServiceModule {}
