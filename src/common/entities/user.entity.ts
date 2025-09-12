import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('user')
@Index(['username'])
@Index(['email'])
@Index(['createdAt'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint', name: 'role_id' })
  roleId!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'bigint', name: 'created_by', nullable: true })
  createdBy?: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'bigint', name: 'updated_by', nullable: true })
  updatedBy?: number;

  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'bigint', name: 'deleted_by', nullable: true })
  deletedBy?: number;
}
