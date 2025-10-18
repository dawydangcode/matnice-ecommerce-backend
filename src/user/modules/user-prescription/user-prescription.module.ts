import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPrescriptionEntity } from './entities/user-prescription.entity';
import { UserPrescriptionService } from './user-prescription.service';
import { UserPrescriptionController } from './user-prescription.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserPrescriptionEntity])],
  controllers: [UserPrescriptionController],
  providers: [UserPrescriptionService],
  exports: [UserPrescriptionService],
})
export class UserPrescriptionModule {}
