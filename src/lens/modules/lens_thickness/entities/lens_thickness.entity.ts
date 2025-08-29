import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { LensThicknessModel } from '../models/lens_thickness.model';

@Entity('lens_thickness')
export class LensThicknessEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({ name: 'index_value', type: 'decimal', precision: 3, scale: 2 })
  indexValue!: number;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @Column({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  toModel(): LensThicknessModel {
    return new LensThicknessModel(
      this.id,
      this.name,
      this.indexValue,
      this.description,
      this.createdAt,
      this.updatedAt,
      this.createdBy,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
