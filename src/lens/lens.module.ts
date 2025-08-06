import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensEntity } from './entities/lens.entity';
import { LensService } from './lens.service';
import { LensController } from './lens.controller';
import { LensDetailModule } from './modules/lens_detail/lens_detail.module';
import { LensUpgradeModule } from './modules/lens_upgrade/lens_upgrade.module';
import { LensUpgradeDetailModule } from './modules/lens_upgrade_detail/lens_upgrade_detail.module';
import { LensQualityModule } from './modules/lens_quality/lens_quality.module';
import { LensThicknessModule } from './modules/lens_thickness/lens_thickness.module';
import { LensTintModule } from './modules/lens_tint/lens_tint.module';
import { TintColorModule } from './modules/tint_color/tint_color.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LensEntity]),
    LensDetailModule,
    LensUpgradeModule,
    LensUpgradeDetailModule,
    LensQualityModule,
    LensThicknessModule,
    LensTintModule,
    TintColorModule,
  ],
  controllers: [LensController],
  providers: [LensService],
  exports: [
    LensService,
    LensDetailModule,
    LensUpgradeModule,
    LensUpgradeDetailModule,
    LensQualityModule,
    LensThicknessModule,
    LensTintModule,
    TintColorModule,
  ],
})
export class LensModule {}
