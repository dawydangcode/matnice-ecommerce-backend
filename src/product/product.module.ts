import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductDetailModule } from './modules/product-detail/product-detail.module';
@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), ProductDetailModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, ProductDetailModule],
})
export class ProductModule {}
