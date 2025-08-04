import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { LensTintModel } from '../models/lens_tint.model';

@Entity('lens_tint')
export class LensTintEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price!: number;

  @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
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

  toModel(): LensTintModel {
    return new LensTintModel(
      this.id,
      this.name,
      this.price,
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
