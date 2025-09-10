import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Product3dModelService } from './product-3d-model.service';
import { Product3dModelController } from './product-3d-model.controller';
import { Product3dModelEntity } from './entities/product-3d-model.entity';
import { Model3dConfigModule } from '../model-3d-config/model-3d-config.module';
import { AwsS3Service } from '../../../common/services/aws-s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product3dModelEntity]),
    Model3dConfigModule,
    ConfigModule,
  ],
  controllers: [Product3dModelController],
  providers: [Product3dModelService, AwsS3Service],
  exports: [Product3dModelService],
})
export class Product3dModelModule {}
