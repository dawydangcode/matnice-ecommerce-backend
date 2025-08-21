import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensRefractionRangeEntity } from './entities/lens_refraction_range.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LensRefractionRangeEntity])],
  exports: [TypeOrmModule],
})
export class LensRefractionRangeModule {}
