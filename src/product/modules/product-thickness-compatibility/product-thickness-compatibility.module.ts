import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductThicknessCompatibilityController } from './product-thickness-compatibility.controller';
import { ProductThicknessCompatibilityService } from './product-thickness-compatibility.service';
import { ProductThicknessCompatibilityEntity } from './entities/product-thickness-compatibility.entity';
import { LensThicknessEntity } from 'src/lens/modules/lens_thickness/entities/lens_thickness.entity';
import { LensThicknessModule } from 'src/lens/modules/lens_thickness/lens_thickness.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductThicknessCompatibilityEntity,
      LensThicknessEntity,
    ]),
    LensThicknessModule,
  ],
  controllers: [ProductThicknessCompatibilityController],
  providers: [ProductThicknessCompatibilityService],
  exports: [ProductThicknessCompatibilityService],
})
export class ProductThicknessCompatibilityModule {}
