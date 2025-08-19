import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TintColorController } from './tint_color.controller';
import { TintColorService } from './tint_color.service';
import { TintColorEntity } from './entities/tint_color.entity';
import { AwsS3Service } from '../../../common/services/aws-s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([TintColorEntity]), ConfigModule],
  controllers: [TintColorController],
  providers: [TintColorService, AwsS3Service],
  exports: [TintColorService],
})
export class TintColorModule {}
