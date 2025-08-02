import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensTintEntity } from './entities/lens_tint.entity';
import { TintColorEntity } from './entities/tint_color.entity';
import { LensTintService } from './lens_tint.service';
import { LensTintController } from './lens_tint.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LensTintEntity, TintColorEntity])],
  providers: [LensTintService],
  controllers: [LensTintController],
  exports: [LensTintService],
})
export class LensTintModule {}
