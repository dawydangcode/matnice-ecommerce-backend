import { Module } from '@nestjs/common';
import { ProductDetailController } from './product-detail.controller';
import { ProductDetailService } from './product-detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetailEntity } from './entities/product-detail.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { ProductThicknessCompatibilityModule } from '../product-thickness-compatibility/product-thickness-compatibility.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductDetailEntity, ProductEntity]),
    ProductCategoryModule,
    ProductThicknessCompatibilityModule,
  ],
  controllers: [ProductDetailController],
  providers: [ProductDetailService, ProductService],
  exports: [ProductDetailService],
})
export class ProductDetailModule {}
