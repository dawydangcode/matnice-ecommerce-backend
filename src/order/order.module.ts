import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderEntity } from './entities/order.entity';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { OrderLensDetailModule } from './modules/order-lens-detail/order-lens-detail.module';
import { CartModule } from '../cart/cart.module';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    OrderItemModule,
    OrderLensDetailModule,
    CartModule,
    StockModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
