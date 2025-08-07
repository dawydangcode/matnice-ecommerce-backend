import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetailEntity } from './entities/product-detail.entity';
import { ProductDetailService } from './product-detail.service';
import { ProductDetailController } from './product-detail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductDetailEntity])],
  controllers: [ProductDetailController],
  providers: [ProductDetailService],
  exports: [ProductDetailService, TypeOrmModule],
})
export class ProductDetailModule {}
