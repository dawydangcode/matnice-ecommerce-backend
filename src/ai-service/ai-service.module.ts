import { Module } from '@nestjs/common';
import { AIServiceController } from './ai-service.controller';
import { AIServiceService } from './ai-service.service';

@Module({
  imports: [],
  controllers: [AIServiceController],
  providers: [AIServiceService]
})
export class AIServiceModule {}
