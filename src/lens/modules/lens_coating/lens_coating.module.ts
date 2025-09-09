import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensCoatingEntity } from './entities/lens_coating.entity';
import { LensCoatingController } from './lens_coating.controller';
import { LensCoatingService } from './lens_coating.service';
import { LensVariantCoatingEntity } from '../lens_variant_coating/entities/lens_variant_coating.entity';
import { LensVariantEntity } from '../lens_variant/entities/lens_variant.entity';
import { LensModule } from 'src/lens/lens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LensCoatingEntity,
      LensVariantCoatingEntity,
      LensVariantEntity,
    ]),
    forwardRef(() => LensModule),
  ],
  controllers: [LensCoatingController],
  providers: [LensCoatingService],
  exports: [LensCoatingService],
})
export class LensCoatingModule {}
