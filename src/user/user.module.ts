import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleModule } from 'src/role/role.module';
import { UserAddressModule } from './modules/user-address/user-address.module';
import { UserPrescriptionModule } from './modules/user-prescription/user-prescription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => RoleModule),
    UserAddressModule,
    UserPrescriptionModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, UserAddressModule, UserPrescriptionModule],
})
export class UserModule {}
