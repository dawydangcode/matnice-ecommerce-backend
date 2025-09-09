import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model3dConfigEntity } from './entities/model-3d-config.entity';
import { Model3dConfigController } from './model-3d-config.controller';
import { Model3dConfigService } from './model-3d-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Model3dConfigEntity])],
  controllers: [Model3dConfigController],
  providers: [Model3dConfigService],
  exports: [Model3dConfigService],
})
export class Model3dConfigModule {}
