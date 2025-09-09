import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GenderType } from '../enums/gender.type';
import { UserDetailModel } from '../models/user-detail.model';

@Entity('user_detail')
export class UserDetailEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'name' })
  name?: string;

  @Column({ name: 'dob' })
  dob?: Date;

  @Column({ name: 'gender' })
  gender?: GenderType;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  toModel(): UserDetailModel {
    return new UserDetailModel(
      this.id,
      this.userId,
      this.name,
      this.dob,
      this.gender,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
