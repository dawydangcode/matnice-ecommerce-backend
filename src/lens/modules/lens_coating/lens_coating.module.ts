import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensCoatingEntity } from './entities/lens_coating.entity';
import { LensCoatingController } from './lens_coating.controller';
import { LensCoatingService } from './lens_coating.service';

@Module({
  imports: [TypeOrmModule.forFeature([LensCoatingEntity])],
  controllers: [LensCoatingController],
  providers: [LensCoatingService],
  exports: [LensCoatingService],
})
export class LensCoatingModule {}
