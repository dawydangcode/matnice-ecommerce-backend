import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LensTintEntity } from './lens_tint.entity';
import { TintColorModel } from '../models/tint_color.model';

@Entity('tint_color')
export class TintColorEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  tint_id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url!: string | null;

  @Column({ type: 'varchar', length: 7, nullable: true })
  color_code!: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'int', nullable: true })
  created_by!: number | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;

  @Column({ type: 'int', nullable: true })
  updated_by!: number | null;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at!: Date | null;

  @Column({ type: 'int', nullable: true })
  deleted_by!: number | null;

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
