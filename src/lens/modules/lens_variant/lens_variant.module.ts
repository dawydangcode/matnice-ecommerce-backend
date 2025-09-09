import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensVariantEntity } from './entities/lens_variant.entity';
import { LensVariantController } from './lens_variant.controller';
import { LensVariantService } from './lens_variant.service';

@Module({
  imports: [TypeOrmModule.forFeature([LensVariantEntity])],
  controllers: [LensVariantController],
  providers: [LensVariantService],
  exports: [LensVariantService],
})
export class LensVariantModule {}
