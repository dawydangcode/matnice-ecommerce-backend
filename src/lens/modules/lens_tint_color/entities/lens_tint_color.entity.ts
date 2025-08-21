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
import { LensTintColorModel } from '../models/lens_tint_color.model';
import { LensVariantEntity } from '../../lens_variant/entities/lens_variant.entity';

@Entity('lens_tint_color')
export class LensTintColorEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ name: 'lens_variant_id', type: 'bigint' })
  lensVariantId!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl?: string;

  @Column({ name: 'color_code', type: 'varchar', length: 7, nullable: true })
  colorCode?: string; // Hex color code like #808080

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
  @ManyToOne(() => LensVariantEntity, { eager: false })
  @JoinColumn({ name: 'lens_variant_id' })
  lensVariant?: LensVariantEntity;

  toModel(): LensTintColorModel {
    return new LensTintColorModel(
      this.id,
      this.lensVariantId,
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
