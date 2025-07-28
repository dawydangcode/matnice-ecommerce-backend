import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { ProductImageEntity } from './entities/product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImageEntity])],
  providers: [ProductImageService],
  controllers: [ProductImageController],
  exports: [ProductImageService],
})
export class ProductImageModule {}
