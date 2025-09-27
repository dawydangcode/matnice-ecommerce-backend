import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddressEntity } from './entities/user-address.entity';
import { UserAddressModel } from './models/user-address.model';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddressEntity)
    private userAddressRepository: Repository<UserAddressModel>,
  ) {}

  async createUserAddress(
    userId: number,
    province: string,
    district: string,
    ward: string,
    addressDetail: string,
    isDefault: boolean,
  ): Promise<UserAddressModel> {
    // Nếu address này được đặt làm mặc định, hủy mặc định của các address khác
    if (isDefault) {
      await this.userAddressRepository.update({ userId }, { isDefault: false });
    }

    const entity = new UserAddressEntity();
    entity.userId = userId;
    entity.province = province;
    entity.district = district;
    entity.ward = ward;
    entity.addressDetail = addressDetail;
    entity.isDefault = isDefault;

    return await this.userAddressRepository.save(entity);
  }

  async getUserAddresses(): Promise<UserAddressModel[]> {
    return await this.userAddressRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserAddressByUserId(userId: number): Promise<UserAddressModel[]> {
    return await this.userAddressRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async getUserAddressById(id: number): Promise<UserAddressModel> {
    const userAddress = await this.userAddressRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!userAddress) {
      throw new NotFoundException(`User address with ID ${id} not found`);
    }

    return userAddress;
  }

  async updateUserAddress(
    userAddress: UserAddressModel,
    province: string | undefined,
    district: string | undefined,
    ward: string | undefined,
    addressDetail: string | undefined,
    isDefault: boolean | undefined,
    reqUserId: number,
  ): Promise<UserAddressModel> {
    await this.getUserAddressById(userAddress.id);

    // Nếu address này được đặt làm mặc định, hủy mặc định của các address khác cùng user
    if (isDefault) {
      await this.userAddressRepository.update(
        { userId: userAddress.userId },
        { isDefault: false },
      );
    }
    await this.userAddressRepository.update(userAddress.id, {
      province: province,
      district: district,
      ward: ward,
      addressDetail: addressDetail,
      isDefault: isDefault,
      updatedAt: new Date(),
      updatedBy: reqUserId,
    });

    return await this.getUserAddressById(userAddress.id);
  }

  async deleteUserAddress(id: number): Promise<boolean> {
    const userAddress = await this.getUserAddressById(id);

    // Nếu xóa address mặc định, đặt address đầu tiên khác làm mặc định
    if (userAddress.isDefault) {
      const otherAddresses = await this.userAddressRepository.find({
        where: { userId: userAddress.userId },
        order: { createdAt: 'ASC' },
      });

      if (otherAddresses.length > 1) {
        const nextDefault = otherAddresses.find((addr) => addr.id !== id);
        if (nextDefault) {
          await this.userAddressRepository.update(nextDefault.id, {
            isDefault: true,
          });
        }
      }
    }

    await this.userAddressRepository.delete(id);
    return true;
  }

  async setDefault(id: number): Promise<UserAddressModel> {
    const userAddress = await this.getUserAddressById(id);

    // Hủy mặc định của các address khác cùng user
    await this.userAddressRepository.update(
      { userId: userAddress.userId },
      { isDefault: false },
    );

    // Đặt address này làm mặc định
    await this.userAddressRepository.update(id, { isDefault: true });

    return await this.getUserAddressById(id);
  }
}
