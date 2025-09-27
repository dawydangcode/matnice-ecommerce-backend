import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../../entities/user.entity';
import { UserAddressModel } from '../models/user-address.model';

@Entity('user_address')
export class UserAddressEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'province' })
  province!: string;

  @Column({ name: 'district' })
  district!: string;

  @Column({ name: 'ward' })
  ward!: string;

  @Column({ name: 'address_detail' })
  addressDetail!: string;

  @Column({ name: 'is_default' })
  isDefault!: boolean;

  @Column({ name: 'notes' })
  notes!: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @Column({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  // Relations
  @ManyToOne(() => UserEntity, (user) => user.addresses)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  toModel(): UserAddressModel {
    return new UserAddressModel(
      this.id,
      this.userId,
      this.province,
      this.district,
      this.ward,
      this.addressDetail,
      this.isDefault,
      this.notes,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
