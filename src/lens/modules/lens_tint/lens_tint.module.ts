import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensTintController } from './lens_tint.controller';
import { LensTintService } from './lens_tint.service';
import { LensTintEntity } from './entities/lens_tint.entity';
import { TintColorEntity } from './entities/tint_color.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LensTintEntity, TintColorEntity])],
  controllers: [LensTintController],
  providers: [LensTintService],
  exports: [LensTintService],
})
export class LensTintModule {}
