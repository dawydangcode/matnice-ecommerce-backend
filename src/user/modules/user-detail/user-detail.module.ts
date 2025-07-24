import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetailEntity } from './entities/user-detail.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserDetailService } from './user-detail.service';
import { UserDetailController } from './user-detail.controller';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserDetailEntity])],
  controllers: [UserDetailController],
  providers: [UserDetailService],
  exports: [UserDetailService],
})
export class UserDetailModule {}
