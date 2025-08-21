import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensEntity } from './entities/lens.entity';
import { LensService } from './lens.service';
import { LensController } from './lens.controller';
import { LensCoatingModule } from './modules/lens_coating/lens_coating.module';
import { LensVariantModule } from './modules/lens_variant/lens_variant.module';
import { LensVariantCoatingModule } from './modules/lens_variant_coating/lens_variant_coating.module';
import { LensCategoryModule } from './modules/lens_category/lens_category.module';
import { LensRefractionRangeModule } from './modules/lens_refraction_range/lens_refraction_range.module';
import { LensTintColorModule } from './modules/lens_tint_color/lens_tint_color.module';
import { LensThicknessModule } from './modules/lens_thickness/lens_thickness.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LensEntity]),
    LensTintColorModule,
    LensCoatingModule,
    LensVariantModule,
    LensVariantCoatingModule,
    LensCategoryModule,
    LensRefractionRangeModule,
    LensTintColorModule,
    LensThicknessModule,
  ],
  controllers: [LensController],
  providers: [LensService],
  exports: [
    LensService,
    LensTintColorModule,
    LensCoatingModule,
    LensVariantModule,
    LensVariantCoatingModule,
    LensCategoryModule,
    LensRefractionRangeModule,
    LensTintColorModule,
    LensThicknessModule,
  ],
})
export class LensModule {}
