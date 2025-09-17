import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { LensModel } from '../models/lens.model';
import { LensStatusType } from '../enum/lens-status.type';
import { LensType } from '../enum/lens.type';

@Entity('lens')
export class LensEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string;

  @Column({ name: 'brand_lens_id' })
  brandId!: number;

  origin!: string;

  @Column({ name: 'lens_type' })
  lensType!: LensType;

  @Column({ name: 'status', type: 'varchar', length: 50 })
  status!: LensStatusType;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string | undefined;

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
  // @ManyToOne(() => CategoryEntity)
  // @JoinColumn({ name: 'category_id' })
  // category!: CategoryEntity;

  // @OneToMany(() => LensDetailEntity, (lensDetail) => lensDetail.lens)
  // lensDetails!: LensDetailEntity[];

  // @OneToMany(() => EyeglassLensEntity, (eyeglassLens) => eyeglassLens.lens)
  // eyeglassLenses!: EyeglassLensEntity[];

  toModel(): LensModel {
    return new LensModel(
      this.id,
      this.name,
      this.brandId,
      this.origin,
      this.lensType,
      this.status,
      this.description,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
