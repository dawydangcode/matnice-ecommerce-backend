import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AIServiceController } from './ai-service.controller';
import { AIServiceService } from './ai-service.service';
import { FaceAnalysisEntity } from './entities/face-analysis.entity';
import { AwsS3Service } from '../common/services/aws-s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([FaceAnalysisEntity]), ConfigModule],
  controllers: [AIServiceController],
  providers: [AIServiceService, AwsS3Service],
  exports: [AIServiceService],
})
export class AIServiceModule {}
