import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderLensDetailEntity } from './entities/order-lens-detail.entity';
import { OrderLensDetailService } from './order-lens-detail.service';
import { OrderLensDetailController } from './order-lens-detail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderLensDetailEntity])],
  controllers: [OrderLensDetailController],
  providers: [OrderLensDetailService],
  exports: [OrderLensDetailService],
})
export class OrderLensDetailModule {}
