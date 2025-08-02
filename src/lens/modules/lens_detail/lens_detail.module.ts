import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensDetailEntity } from './entities/lens_detail.entity';
import { LensDetailService } from './lens_detail.service';
import { LensDetailController } from './lens_detail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LensDetailEntity])],
  controllers: [LensDetailController],
  providers: [LensDetailService],
  exports: [LensDetailService],
})
export class LensDetailModule {}
