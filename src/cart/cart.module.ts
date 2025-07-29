import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartEntity } from './entities/cart.entity';
import { CartItemModule } from './modules/cart_item/cart_item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity]),
    forwardRef(() => CartItemModule),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
