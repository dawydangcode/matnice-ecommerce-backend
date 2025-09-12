import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('session')
@Index(['userId'])
@Index(['isActive'])
@Index(['createdAt'])
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint', name: 'user_id', nullable: true })
  userId?: number;

  @Column({ type: 'varchar', length: 50, name: 'type' })
  type!: string; // 'web_login', 'mobile_login', 'anonymous_ai', 'api_token'

  @Column({ type: 'text', name: 'user_agent', nullable: true })
  userAgent?: string;

  @Column({ type: 'varchar', length: 45, name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

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
