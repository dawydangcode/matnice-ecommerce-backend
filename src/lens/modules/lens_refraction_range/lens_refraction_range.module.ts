import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensRefractionRangeEntity } from './entities/lens_refraction_range.entity';
import { LensRefractionRangeService } from './lens_refraction_range.service';
import { LensRefractionRangeController } from './lens_refraction_range.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LensRefractionRangeEntity])],
  controllers: [LensRefractionRangeController],
  providers: [LensRefractionRangeService],
  exports: [LensRefractionRangeService],
})
export class LensRefractionRangeModule {}
