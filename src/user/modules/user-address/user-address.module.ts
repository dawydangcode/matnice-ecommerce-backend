import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressService } from './user-address.service';
import { UserAddressController } from './user-address.controller';
import { UserAddressEntity } from './entities/user-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddressEntity])],
  controllers: [UserAddressController],
  providers: [UserAddressService],
  exports: [UserAddressService],
})
export class UserAddressModule {}
