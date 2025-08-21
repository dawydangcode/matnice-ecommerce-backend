import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensTintColorEntity } from './entities/lens_tint_color.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LensTintColorEntity])],
  exports: [TypeOrmModule],
})
export class LensTintColorModule {}
