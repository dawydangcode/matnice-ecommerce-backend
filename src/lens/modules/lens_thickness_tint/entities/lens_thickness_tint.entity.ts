import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { LensThicknessEntity } from '../../lens_thickness/entities/lens_thickness.entity';
import { LensTintEntity } from '../../lens_tint/entities/lens_tint.entity';
import { LensThicknessTintModel } from '../models/lens_thickness_tint.model';

@Entity('lens_thickness_tint')
@Index(['lensThicknessId', 'tintId'], {
  unique: true,
  where: 'deleted_at IS NULL',
})
export class LensThicknessTintEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: number;

  @Column({ name: 'lens_thickness_id', type: 'bigint' })
  lensThicknessId!: number;

  @Column({ name: 'tint_id', type: 'bigint' })
  tintId!: number;

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
  @ManyToOne(() => LensThicknessEntity)
  @JoinColumn({ name: 'lens_thickness_id' })
  lensThickness!: LensThicknessEntity;

  @ManyToOne(() => LensTintEntity)
  @JoinColumn({ name: 'tint_id' })
  lensTint!: LensTintEntity;

  toModel(): LensThicknessTintModel {
    return new LensThicknessTintModel(
      this.id,
      this.lensThicknessId,
      this.tintId,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
