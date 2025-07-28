import { Module } from '@nestjs/common';
import { ProductDetailController } from './product-detail.controller';
import { ProductDetailService } from './product-detail.service';

@Module({
  controllers: [ProductDetailController],
  providers: [ProductDetailService]
})
export class ProductDetailModule {}
