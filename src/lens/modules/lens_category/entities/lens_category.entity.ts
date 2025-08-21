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
import { LensCategoryModel } from '../models/lens_category.model';

@Entity('lens_category')
export class LensCategoryEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ name: 'lens_id', type: 'bigint' })
  lensId!: number;

  @Column({ name: 'category_id', type: 'bigint' })
  categoryId!: number;

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
  @ManyToOne(() => LensEntity, { eager: true })
  @JoinColumn({ name: 'lens_id' })
  lens?: LensEntity;

  // Category relation (will be added when category entity is available)
  // @ManyToOne(() => CategoryEntity, { eager: true })
  // @JoinColumn({ name: 'category_id' })
  // category?: CategoryEntity;

  toModel(): LensCategoryModel {
    return new LensCategoryModel(
      this.id,
      this.lensId,
      this.categoryId,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
