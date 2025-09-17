import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LensBrandModel } from '../models/lens-brand.model';

@Entity('lens_brand')
export class LensBrandEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'name' })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @Column({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  toModel(): LensBrandModel {
    return new LensBrandModel(
      this.id,
      this.name,
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
