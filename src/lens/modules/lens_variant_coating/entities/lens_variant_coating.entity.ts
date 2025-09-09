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
import { LensCoatingEntity } from '../../lens_coating/entities/lens_coating.entity';
import { LensVariantCoatingModel } from '../models/lens_variant_coating.model';

@Entity('lens_variant_coating')
export class LensVariantCoatingEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ name: 'lens_variant_id', type: 'bigint' })
  lensVariantId!: number;

  @Column({ name: 'lens_coating_id', type: 'bigint' })
  lensCoatingId!: number;

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

  // Relations (commented out for now since entities don't exist yet)
  // @ManyToOne(() => LensVariantEntity, { eager: true })
  // @JoinColumn({ name: 'lens_variant_id' })
  // lensVariant?: LensVariantEntity;

  @ManyToOne(() => LensCoatingEntity, { eager: true })
  @JoinColumn({ name: 'lens_coating_id' })
  lensCoating?: LensCoatingEntity;

  toModel(): LensVariantCoatingModel {
    return new LensVariantCoatingModel(
      this.id,
      this.lensVariantId,
      this.lensCoatingId,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
