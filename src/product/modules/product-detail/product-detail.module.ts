import { forwardRef, Module } from '@nestjs/common';
import { ProductDetailController } from './product-detail.controller';
import { ProductDetailService } from './product-detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetailEntity } from './entities/product-detail.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductDetailEntity]),
    forwardRef(() => ProductModule),
  ],
  controllers: [ProductDetailController],
  providers: [ProductDetailService],
  exports: [ProductDetailService],
})
export class ProductDetailModule {}
