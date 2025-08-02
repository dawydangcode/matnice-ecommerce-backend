import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { ProductImageEntity } from './entities/product-image.entity';
import { ProductEntity } from '../../entities/product.entity';
import { AwsS3Service } from 'src/common/services/aws-s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImageEntity, ProductEntity]),
    ConfigModule,
  ],
  providers: [ProductImageService, AwsS3Service],
  controllers: [ProductImageController],
  exports: [ProductImageService],
})
export class ProductImageModule {}
