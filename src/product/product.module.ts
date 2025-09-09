import { forwardRef, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductColorModule } from './modules/product-color/product-color.module';
import { ProductDetailModule } from './modules/product-detail/product-detail.module';
import { ProductImageModule } from './modules/product-image/product-image.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { ProductThicknessCompatibilityModule } from './modules/product-thickness-compatibility/product-thickness-compatibility.module';
import { Product3dModelModule } from './modules/product-3d-model/product-3d-model.module';
import { Model3dConfigModule } from './modules/model-3d-config/model-3d-config.module';
import { ProductSchedulerService } from './services/product-scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ProductColorModule,
    ProductDetailModule,
    ProductCategoryModule,
    ProductThicknessCompatibilityModule,
    Product3dModelModule,
    Model3dConfigModule,
    forwardRef(() => ProductImageModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductSchedulerService],
  exports: [
    ProductService,
    ProductColorModule,
    ProductDetailModule,
    ProductImageModule,
    ProductCategoryModule,
    ProductThicknessCompatibilityModule,
    Product3dModelModule,
    Model3dConfigModule,
  ],
})
export class ProductModule {}
