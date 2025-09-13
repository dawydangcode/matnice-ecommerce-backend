import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AIServiceController } from './ai-service.controller';
import { AIServiceService } from './ai-service.service';
import { FaceAnalysisEntity } from './entities/face-analysis.entity';
import { SessionEntity } from '../common/entities/session.entity';
import { AwsS3Service } from '../common/services/aws-s3.service';
import { SessionService } from '../common/services/session.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FaceAnalysisEntity, SessionEntity]),
    ConfigModule,
  ],
  controllers: [AIServiceController],
  providers: [AIServiceService, SessionService, AwsS3Service],
  exports: [AIServiceService, SessionService],
})
export class AIServiceModule {}
