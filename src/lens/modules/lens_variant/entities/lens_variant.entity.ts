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
import { LensEntity } from '../../../entities/lens.entity';
import { LensThicknessEntity } from '../../lens_thickness/entities/lens_thickness.entity';
import { LensVariantModel } from '../models/lens_variant.model';

@Entity('lens_variant')
export class LensVariantEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ name: 'lens_id', type: 'bigint' })
  lensId!: number;

  @Column({ name: 'lens_thickness_id', type: 'bigint' })
  lensThicknessId!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  design?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  material?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by', type: 'bigint' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedBy?: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @Column({ name: 'deleted_by', type: 'bigint', nullable: true })
  deletedBy?: number;

  // Relations
  @ManyToOne(() => LensEntity, { eager: false })
  @JoinColumn({ name: 'lens_id' })
  lens?: LensEntity;

  @ManyToOne(() => LensThicknessEntity, { eager: false })
  @JoinColumn({ name: 'lens_thickness_id' })
  lensThickness?: LensThicknessEntity;

  toModel(): LensVariantModel {
    return new LensVariantModel(
      this.id,
      this.lensId,
      this.lensThicknessId,
      this.design,
      this.material,
      this.price,
      this.stock,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
