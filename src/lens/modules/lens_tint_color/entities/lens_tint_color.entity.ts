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
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'lens_variant_id' })
  lensVariantId!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ name: 'image_url' })
  imageUrl!: string;

  @Column({ name: 'color_code' })
  colorCode!: string; // Hex color code like #808080

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  @ManyToOne(() => LensVariantEntity, { eager: false })
  @JoinColumn({ name: 'lens_variant_id' })
  lensVariant!: LensVariantEntity;

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
