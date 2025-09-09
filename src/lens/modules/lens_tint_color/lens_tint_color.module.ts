import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LensTintColorEntity } from './entities/lens_tint_color.entity';
import { LensTintColorController } from './lens_tint_color.controller';
import { LensTintColorService } from './lens_tint_color.service';
import { AwsS3Service } from 'src/common/services/aws-s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([LensTintColorEntity]), ConfigModule],
  controllers: [LensTintColorController],
  providers: [LensTintColorService, AwsS3Service],
  exports: [TypeOrmModule, LensTintColorService],
})
export class LensTintColorModule {}
