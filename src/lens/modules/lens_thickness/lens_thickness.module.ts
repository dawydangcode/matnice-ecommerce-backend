import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensThicknessEntity } from './entities/lens_thickness.entity';
import { LensThicknessService } from './lens_thickness.service';
import { LensThicknessController } from './lens_thickness.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LensThicknessEntity])],
  controllers: [LensThicknessController],
  providers: [LensThicknessService],
  exports: [LensThicknessService, TypeOrmModule],
})
export class LensThicknessModule {}
