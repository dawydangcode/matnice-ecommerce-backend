import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LensImageController } from './lens-image.controller';
import { LensImageService } from './lens-image.service';
import { LensImageEntity } from './entities/lens-image.entity';
import { LensEntity } from '../../entities/lens.entity';
import { AwsS3Service } from 'src/common/services/aws-s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LensImageEntity, LensEntity]),
    ConfigModule,
  ],
  controllers: [LensImageController],
  providers: [LensImageService, AwsS3Service],
  exports: [LensImageService],
})
export class LensImageModule {}
