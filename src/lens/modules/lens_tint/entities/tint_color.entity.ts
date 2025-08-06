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
import { LensTintEntity } from './lens_tint.entity';
import { TintColorModel } from '../models/tint_color.model';

@Entity('tint_color')
export class TintColorEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: number;

  @Column({ name: 'tint_id', type: 'bigint' })
  tint_id!: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name!: string;

  @Column({ name: 'image_url', type: 'varchar', length: 255, nullable: true })
  image_url!: string | undefined;

  @Column({ name: 'color_code', type: 'varchar', length: 7, nullable: true })
  color_code!: string | undefined;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at!: Date;

  @Column({ name: 'created_by', type: 'bigint', nullable: true })
  created_by!: number | undefined;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at!: Date;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updated_by!: number | undefined;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at!: Date | undefined;

  @Column({ name: 'deleted_by', type: 'bigint', nullable: true })
  deleted_by!: number | undefined;

  @ManyToOne(() => LensTintEntity)
  @JoinColumn({ name: 'tint_id' })
  lensTint!: LensTintEntity;

  toModel(): TintColorModel {
    return new TintColorModel(
      this.id,
      this.tint_id,
      this.name,
      this.image_url,
      this.color_code,
      this.created_at,
      this.created_by,
      this.updated_at,
      this.updated_by,
      this.deleted_at,
      this.deleted_by,
    );
  }
}
