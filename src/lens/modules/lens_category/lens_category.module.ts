import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensCategoryEntity } from './entities/lens_category.entity';
import { LensCategoryService } from './lens_category.service';
import { LensCategoryController } from './lens_category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LensCategoryEntity])],
  controllers: [LensCategoryController],
  providers: [LensCategoryService],
  exports: [LensCategoryService],
})
export class LensCategoryModule {}
