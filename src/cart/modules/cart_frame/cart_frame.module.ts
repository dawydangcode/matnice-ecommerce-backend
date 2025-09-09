import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartFrameEntity } from './entities/cart_frame.entity';
import { CartFrameService } from './cart_frame.service';
import { CartFrameController } from './cart_frame.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CartFrameEntity])],
  controllers: [CartFrameController],
  providers: [CartFrameService],
  exports: [CartFrameService],
})
export class CartFrameModule {}
