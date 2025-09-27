import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleModule } from 'src/role/role.module';
import { UserAddressModule } from './modules/user-address/user-address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => RoleModule),
    UserAddressModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, UserAddressModule],
})
export class UserModule {}
