import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensUpgradeDetailEntity } from './entities/lens_upgrade_detail.entity';
import { LensUpgradeDetailService } from './lens_upgrade_detail.service';
import { LensUpgradeDetailController } from './lens_upgrade_detail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LensUpgradeDetailEntity])],
  providers: [LensUpgradeDetailService],
  controllers: [LensUpgradeDetailController],
  exports: [LensUpgradeDetailService],
})
export class LensUpgradeDetailModule {}
