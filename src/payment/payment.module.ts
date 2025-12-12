import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentEntity } from './entities/payment.entity';
import { PayOSController } from './controllers/payos.controller';
import { PayOSService } from './services/payos.service';
import { CartModule } from '../cart/cart.module';
import { OrderModule } from '../order/order.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    ConfigModule,
    CartModule,
    OrderModule,
    MailerModule,
  ],
  controllers: [PaymentController, PayOSController],
  providers: [PaymentService, PayOSService],
  exports: [PaymentService, PayOSService],
})
export class PaymentModule {}
