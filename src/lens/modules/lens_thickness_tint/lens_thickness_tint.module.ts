import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensThicknessTintController } from './lens_thickness_tint.controller';
import { LensThicknessTintService } from './lens_thickness_tint.service';
import { LensThicknessTintEntity } from './entities/lens_thickness_tint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LensThicknessTintEntity])],
  controllers: [LensThicknessTintController],
  providers: [LensThicknessTintService],
  exports: [LensThicknessTintService],
})
export class LensThicknessTintModule {}
