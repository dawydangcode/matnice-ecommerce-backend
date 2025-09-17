import { Module } from '@nestjs/common';
import { LensBrandController } from './lens_brand.controller';
import { LensBrandService } from './lens_brand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensBrandEntity } from './entities/lens-brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LensBrandEntity])],
  controllers: [LensBrandController],
  providers: [LensBrandService],
})
export class LensBrandModule {}
