import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartEntity } from './entities/cart.entity';
import { CartItemModule } from './modules/cart_item/cart_item.module';
import { CartLensDetailEntity } from './modules/cart_lens_detail/entities/cart_lens_detail.entity';
import { CartLensDetailService } from './modules/cart_lens_detail/cart_lens_detail.service';
import { CartLensDetailController } from './modules/cart_lens_detail/cart_lens_detail.controller';
import { CartLensDetailModule } from './modules/cart_lens_detail/cart_lens_detail.module';
import { CartFrameEntity } from './modules/cart_frame/entities/cart_frame.entity';
import { CartFrameModule } from './modules/cart_frame/cart_frame.module';
import { CartFrameController } from './modules/cart_frame/cart_frame.controller';
import { CartCombinedController } from './modules/cart-combined.controller';
import { CartFrameService } from './modules/cart_frame/cart_frame.service';
import { CartCombinedService } from './modules/cart-combined.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      CartFrameEntity,
      CartLensDetailEntity,
    ]),
    forwardRef(() => CartItemModule),
    CartFrameModule,
    CartLensDetailModule,
  ],
  controllers: [
    CartController,
    CartFrameController,
    CartLensDetailController,
    CartCombinedController,
  ],
  providers: [
    CartService,
    CartFrameService,
    CartLensDetailService,
    CartCombinedService,
  ],
  exports: [
    CartService,
    CartFrameService,
    CartLensDetailService,
    CartCombinedService,
  ],
})
export class CartModule {}
