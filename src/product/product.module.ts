import { forwardRef, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductBestsellerEntity } from './entities/product-bestseller.entity';
import { ProductColorModule } from './modules/product-color/product-color.module';
import { ProductDetailModule } from './modules/product-detail/product-detail.module';
import { ProductImageModule } from './modules/product-image/product-image.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { ProductThicknessCompatibilityModule } from './modules/product-thickness-compatibility/product-thickness-compatibility.module';
import { Product3dModelModule } from './modules/product-3d-model/product-3d-model.module';
import { Model3dConfigModule } from './modules/model-3d-config/model-3d-config.module';
import { ColorSkinRecommendationModule } from './modules/color-skin-recommendation/color-skin-recommendation.module';
import { ProductSchedulerService } from './services/product-scheduler.service';
import { BestsellerService } from './services/bestseller.service';
import { BestsellerController } from './controllers/bestseller.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductBestsellerEntity]),
    ProductColorModule,
    ProductDetailModule,
    ProductCategoryModule,
    ProductThicknessCompatibilityModule,
    Product3dModelModule,
    Model3dConfigModule,
    ColorSkinRecommendationModule,
    forwardRef(() => ProductImageModule),
  ],
  controllers: [ProductController, BestsellerController],
  providers: [ProductService, ProductSchedulerService, BestsellerService],
  exports: [
    ProductService,
    BestsellerService,
    ProductColorModule,
    ProductDetailModule,
    ProductImageModule,
    ProductCategoryModule,
    ProductThicknessCompatibilityModule,
    Product3dModelModule,
    Model3dConfigModule,
    ColorSkinRecommendationModule,
  ],
})
export class ProductModule {}
