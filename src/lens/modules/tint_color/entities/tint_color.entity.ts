import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TintColorModel } from '../models/tint_color.model';

@Entity('tint_color')
export class TintColorEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: number;

  @Column({ name: 'tint_id', type: 'bigint' })
  tintId!: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl!: string | undefined;

  @Column({ name: 'color_code', type: 'varchar', length: 10, nullable: true })
  colorCode!: string | undefined;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by', type: 'bigint' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ name: 'updated_by', type: 'bigint' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date | undefined;

  @Column({ name: 'deleted_by', type: 'bigint', nullable: true })
  deletedBy!: number | undefined;

  // Relations
  // @ManyToOne(() => LensTintEntity)
  // @JoinColumn({ name: 'tint_id' })
  // tint!: LensTintEntity;

  toModel(): TintColorModel {
    return new TintColorModel(
      this.id,
      this.tintId,
      this.name,
      this.imageUrl,
      this.colorCode,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
