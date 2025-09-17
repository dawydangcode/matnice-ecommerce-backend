import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandLensEntity } from './entities/brand-lens.entity';
import { BrandLensController } from './brand-lens.controller';
import { BrandLensService } from './brand-lens.service';

@Module({
  imports: [TypeOrmModule.forFeature([BrandLensEntity])],
  controllers: [BrandLensController],
  providers: [BrandLensService],
  exports: [BrandLensService],
})
export class BrandLensModule {}
