import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensQualityService } from './lens_quality.service';
import { LensQualityController } from './lens_quality.controller';
import { LensQualityEntity } from './entities/lens_quality.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LensQualityEntity])],
  providers: [LensQualityService],
  controllers: [LensQualityController],
  exports: [LensQualityService],
})
export class LensQualityModule {}
