import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensTintColorEntity } from './entities/lens_tint_color.entity';
import { LensTintColorController } from './lens_tint_color.controller';
import { LensTintColorService } from './lens_tint_color.service';

@Module({
  imports: [TypeOrmModule.forFeature([LensTintColorEntity])],
  controllers: [LensTintColorController],
  providers: [LensTintColorService],
  exports: [TypeOrmModule, LensTintColorService],
})
export class LensTintColorModule {}
