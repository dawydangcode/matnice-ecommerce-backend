import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { UserAddressEntity } from './entities/user-address.entity';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddressEntity)
    private userAddressRepository: Repository<UserAddressEntity>,
  ) {}

  async create(
    userId: number,
    createUserAddressDto: CreateUserAddressDto,
  ): Promise<UserAddressEntity> {
    // Nếu address này được đặt làm mặc định, hủy mặc định của các address khác
    if (createUserAddressDto.isDefault) {
      await this.userAddressRepository.update({ userId }, { isDefault: false });
    }

    const userAddress = this.userAddressRepository.create({
      ...createUserAddressDto,
      userId,
    });

    return await this.userAddressRepository.save(userAddress);
  }

  async findAll(): Promise<UserAddressEntity[]> {
    return await this.userAddressRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<UserAddressEntity[]> {
    return await this.userAddressRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<UserAddressEntity> {
    const userAddress = await this.userAddressRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!userAddress) {
      throw new NotFoundException(`User address with ID ${id} not found`);
    }

    return userAddress;
  }

  async update(
    id: number,
    updateUserAddressDto: UpdateUserAddressDto,
  ): Promise<UserAddressEntity> {
    const userAddress = await this.findOne(id);

    // Nếu address này được đặt làm mặc định, hủy mặc định của các address khác cùng user
    if (updateUserAddressDto.isDefault) {
      await this.userAddressRepository.update(
        { userId: userAddress.userId },
        { isDefault: false },
      );

      // Ngoại trừ address hiện tại
      await this.userAddressRepository
        .createQueryBuilder()
        .update(UserAddressEntity)
        .set({ isDefault: false })
        .where('userId = :userId AND id != :id', {
          userId: userAddress.userId,
          id,
        })
        .execute();
    }

    await this.userAddressRepository.update(id, updateUserAddressDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const userAddress = await this.findOne(id);

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
  }

  async setDefault(id: number): Promise<UserAddressEntity> {
    const userAddress = await this.findOne(id);

    // Hủy mặc định của các address khác cùng user
    await this.userAddressRepository.update(
      { userId: userAddress.userId },
      { isDefault: false },
    );

    // Đặt address này làm mặc định
    await this.userAddressRepository.update(id, { isDefault: true });

    return await this.findOne(id);
  }
}
