import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensUpgradeEntity } from './entities/lens_upgrade.entity';
import { LensUpgradeService } from './lens_upgrade.service';
import { LensUpgradeController } from './lens_upgrade.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LensUpgradeEntity])],
  controllers: [LensUpgradeController],
  providers: [LensUpgradeService],
  exports: [LensUpgradeService],
})
export class LensUpgradeModule {}
