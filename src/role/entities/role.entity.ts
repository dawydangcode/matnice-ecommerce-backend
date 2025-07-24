import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleModel } from '../models/role.model';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('role', { schema: 'multiple_choice' })
export class RoleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: number;

  @Column({ type: 'varchar', name: 'name' })
  name!: string;

  @Column('timestamp', { name: 'created_at' })
  createdAt!: Date;

  @Column('bigint', { name: 'created_by' })
  createdBy!: number;

  @Column('timestamp', { name: 'updated_at' })
  updatedAt!: Date;

  @Column('bigint', { name: 'updated_by' })
  updatedBy!: number;

  @Column('timestamp', { name: 'deleted_at' })
  deletedAt!: Date;

  @Column('bigint', { name: 'deleted_by' })
  deletedBy!: number;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[] | undefined;

  toModel(): RoleModel {
    return new RoleModel(
      this.id,
      this.name,
      this.createdAt,
      this.createdBy,
      this.deletedAt,
      this.deletedBy,
      this.updatedAt,
      this.updatedBy,
    );
  }
}
