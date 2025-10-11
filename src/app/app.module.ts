import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import database from 'src/config/database';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import app from 'src/config/app';
import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from 'src/middlewares/guards/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/guards/role.guard';
import { RoleModule } from 'src/role/role.module';
import { AuthModule } from 'src/auth/auth.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { ProductModule } from 'src/product/product.module';
import { CategoryModule } from 'src/category/category.module';
import { BrandModule } from 'src/brand/brand.module';
import { CartModule } from 'src/cart/cart.module';
import { LensModule } from 'src/lens/lens.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AIServiceModule } from 'src/ai-service/ai-service.module';
import { CategoryLensModule } from 'src/category-lens/category-lens.module';
import { BrandLensModule } from 'src/brand-lens/brand-lens.module';
import { OrderModule } from 'src/order/order.module';
import { PaymentModule } from 'src/payment/payment.module';
import { StockModule } from 'src/stock/stock.module';
import { TestModule } from 'src/test/test.module';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { WishlistModule } from 'src/wishlist/wishlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [database, app],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get<any>('database') as TypeOrmModuleAsyncOptions;
      },
    }),
    UserModule,
    RoleModule,
    AuthModule,
    MailerModule,
    ProductModule,
    CategoryModule,
    CategoryLensModule,
    BrandModule,
    BrandLensModule,
    CartModule,
    LensModule,
    AIServiceModule,
    OrderModule,
    PaymentModule,
    StockModule,
    DashboardModule,
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
