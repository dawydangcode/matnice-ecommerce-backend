import { forwardRef, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductColorModule } from './modules/product-color/product-color.module';
import { ProductDetailModule } from './modules/product-detail/product-detailmodule';
import { ProductImageModule } from './modules/product-image/product-image.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { ProductThicknessCompatibilityModule } from './modules/product-thickness-compatibility/product-thickness-compatibility.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ProductColorModule,
    ProductDetailModule,
    ProductCategoryModule,
    ProductThicknessCompatibilityModule,
    forwardRef(() => ProductImageModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [
    ProductService,
    ProductColorModule,
    ProductDetailModule,
    ProductImageModule,
    ProductCategoryModule,
    ProductThicknessCompatibilityModule,
  ],
})
export class ProductModule {}
