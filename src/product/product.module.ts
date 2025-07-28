import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductDetailModule } from './modules/product-detail/product-detail.module';
import { ProductImageModule } from './modules/product-image/product-image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ProductDetailModule,
    ProductImageModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, ProductDetailModule, ProductImageModule],
})
export class ProductModule {}
