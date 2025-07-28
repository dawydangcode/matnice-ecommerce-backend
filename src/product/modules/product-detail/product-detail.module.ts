import { Module } from '@nestjs/common';
import { ProductDetailController } from './product-detail.controller';
import { ProductDetailService } from './product-detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetailEntity } from './entities/product-detail.entity';
import { ProductService } from 'src/product/product.service';
import { ProductEntity } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductDetailEntity, ProductEntity])],
  controllers: [ProductDetailController],
  providers: [ProductDetailService, ProductService],
  exports: [ProductDetailService],
})

export class ProductDetailModule {}
