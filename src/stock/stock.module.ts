import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { ProductColorEntity } from '../product/modules/product-color/entities/product-color.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { LensVariantEntity } from '../lens/modules/lens_variant/entities/lens_variant.entity';
import { OrderItemEntity } from '../order/modules/order-item/entities/order-item.entity';
import { OrderLensDetailEntity } from '../order/modules/order-lens-detail/entities/order-lens-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductColorEntity,
      ProductEntity,
      LensVariantEntity,
      OrderItemEntity,
      OrderLensDetailEntity,
    ]),
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
