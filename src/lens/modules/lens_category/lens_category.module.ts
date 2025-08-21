import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensCategoryEntity } from './entities/lens_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LensCategoryEntity])],
  exports: [TypeOrmModule],
})
export class LensCategoryModule {}
