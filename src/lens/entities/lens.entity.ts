import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { LensModel } from '../models/lens.model';

@Entity('lens')
export class LensEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by', type: 'bigint' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ name: 'updated_by', type: 'bigint' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date | null;

  @Column({ name: 'deleted_by', type: 'bigint', nullable: true })
  deletedBy!: number | null;

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
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
