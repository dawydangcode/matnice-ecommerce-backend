import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductColorEntity } from './entities/product-color.entity';
import { ProductColorService } from './product-color.service';
import { ProductColorController } from './product-color.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductColorEntity])],
  controllers: [ProductColorController],
  providers: [ProductColorService],
  exports: [ProductColorService, TypeOrmModule],
})
export class ProductColorModule {}
