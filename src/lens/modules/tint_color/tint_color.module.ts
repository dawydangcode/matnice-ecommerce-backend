import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TintColorController } from './tint_color.controller';
import { TintColorService } from './tint_color.service';
import { TintColorEntity } from './entities/tint_color.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TintColorEntity])],
  controllers: [TintColorController],
  providers: [TintColorService],
  exports: [TintColorService],
})
export class TintColorModule {}
