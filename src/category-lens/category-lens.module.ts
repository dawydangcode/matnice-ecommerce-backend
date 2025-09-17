import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryLensEntity } from './entities/category-lens.entity';
import { CategoryLensController } from './category-lens.controller';
import { CategoryLensService } from './category-lens.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryLensEntity])],
  controllers: [CategoryLensController],
  providers: [CategoryLensService],
  exports: [CategoryLensService],
})
export class CategoryLensModule {}
