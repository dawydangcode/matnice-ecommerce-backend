import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SessionModel } from '../models/session.model';
import { SessionType } from '../enum/session.type';

@Entity('session')
export class SessionEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'type' })
  type!: SessionType;

  @Column({ name: 'user_agent' })
  userAgent!: string;

  @Column({ name: 'ip_address' })
  ipAddress!: string;

  @Column({ name: 'is_active' })
  isActive!: boolean;

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

  toModel(): SessionModel {
    return new SessionModel(
      this.id,
      this.userId,
      this.type,
      this.userAgent,
      this.ipAddress,
      this.isActive,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
