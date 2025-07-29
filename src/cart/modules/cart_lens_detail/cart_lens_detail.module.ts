import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartLensDetailEntity } from './entities/cart_lens_detail.entity';
import { CartLensDetailService } from './cart_lens_detail.service';
import { CartLensDetailController } from './cart_lens_detail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CartLensDetailEntity])],
  controllers: [CartLensDetailController],
  providers: [CartLensDetailService],
  exports: [CartLensDetailService],
})
export class CartLensDetailModule {}
