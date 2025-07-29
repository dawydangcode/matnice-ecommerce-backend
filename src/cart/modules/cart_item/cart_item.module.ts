import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemController } from './cart_item.controller';
import { CartItemService } from './cart_item.service';
import { CartItemEntity } from './entities/cart_item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity])],
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
