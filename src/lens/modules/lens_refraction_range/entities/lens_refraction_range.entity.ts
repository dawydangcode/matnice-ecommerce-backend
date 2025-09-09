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
import { LensRefractionRangeModel } from '../models/lens_refraction_range.model';
import { LensVariantEntity } from '../../lens_variant/entities/lens_variant.entity';
import { LensRefractionType } from '../enum/lens-refraction.type';

@Entity('lens_refraction_range')
export class LensRefractionRangeEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'lens_variant_id' })
  lensVariantId!: number;

  @Column({ name: 'refraction_type' })
  refractionType!: LensRefractionType; // SPH, CYL, ADD, AXIS

  @Column({ name: 'min_value', type: 'decimal', precision: 4, scale: 2 })
  minValue!: number;

  @Column({ name: 'max_value', type: 'decimal', precision: 4, scale: 2 })
  maxValue!: number;

  @Column({ name: 'step_value', type: 'decimal', precision: 4, scale: 2 })
  stepValue!: number;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by', type: 'bigint' })
  createdBy!: number;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date;

  @Column({ name: 'deleted_by', type: 'bigint', nullable: true })
  deletedBy!: number;

  // Relations
  @ManyToOne(() => LensVariantEntity, { eager: false })
  @JoinColumn({ name: 'lens_variant_id' })
  lensVariant!: LensVariantEntity;

  toModel(): LensRefractionRangeModel {
    return new LensRefractionRangeModel(
      this.id,
      this.lensVariantId,
      this.refractionType,
      this.minValue,
      this.maxValue,
      this.stepValue,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
