import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensVariantCoatingEntity } from './entities/lens_variant_coating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LensVariantCoatingEntity])],
  exports: [TypeOrmModule],
})
export class LensVariantCoatingModule {}
