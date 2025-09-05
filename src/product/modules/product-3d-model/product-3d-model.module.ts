import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product3dModelService } from './product-3d-model.service';
import { Product3dModelController } from './product-3d-model.controller';
import { Product3dModelEntity } from './entities/product-3d-model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product3dModelEntity])],
  controllers: [Product3dModelController],
  providers: [Product3dModelService],
  exports: [Product3dModelService],
})
export class Product3dModelModule {}
