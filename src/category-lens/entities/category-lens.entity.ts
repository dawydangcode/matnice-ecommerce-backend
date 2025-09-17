import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryLensModel } from '../models/category-lens.model';

@Entity('category_lens')
export class CategoryLensEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;
  @Column({ name: 'name' })
  name!: string;

  @Column({ name: 'description' })
  description!: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  toModel(): CategoryLensModel {
    return new CategoryLensModel(
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
