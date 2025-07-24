import {
  Column,
  Entity,
  JoinColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from '../models/user.model';
import { RoleEntity } from 'src/role/entities/role.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'role_id' })
  roleId!: number;

  @Column({ name: 'username' })
  username!: string;

  @Column({ name: 'password' })
  password!: string;

  @Column({ name: 'email' })
  email!: string;

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

  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: RoleEntity | undefined;

  toModel(isHiddenPassword: boolean): UserModel {
    return new UserModel(
      this.id,
      this.username,
      this.roleId,
      this.email,
      !isHiddenPassword ? this.password : undefined,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
