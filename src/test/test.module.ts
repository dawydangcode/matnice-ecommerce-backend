import { Module } from '@nestjs/common';
import { TestPermissionsController } from './test-permissions.controller';

@Module({
  controllers: [TestPermissionsController],
})
export class TestModule {}
