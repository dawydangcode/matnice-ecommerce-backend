import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LensQualityModel } from '../models/lens_quality.model';

@Entity('lens_quality')
export class LensQualityEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'name' })
  name!: string;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @Column({ name: 'uv_protection', default: true })
  uvProtection!: boolean;

  @Column({ name: 'anti_reflective', default: true })
  antiReflective!: boolean;

  @Column({ name: 'hard_coating', default: true })
  hardCoating!: boolean;

  @Column({ name: 'night_day_optimization', default: false })
  nightDayOptimization!: boolean;

  @Column({ name: 'antistatic_coating', default: false })
  antistaticCoating!: boolean;

  @Column({ name: 'free_form_technology', default: false })
  freeFormTechnology!: boolean;

  @Column({ name: 'transitions_option', default: false })
  transitionsOption!: boolean;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy?: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @Column({ name: 'deleted_by', nullable: true })
  deletedBy?: number;

  toModel(): LensQualityModel {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      uvProtection: this.uvProtection,
      antiReflective: this.antiReflective,
      hardCoating: this.hardCoating,
      nightDayOptimization: this.nightDayOptimization,
      antistaticCoating: this.antistaticCoating,
      freeFormTechnology: this.freeFormTechnology,
      transitionsOption: this.transitionsOption,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy,
      deletedAt: this.deletedAt,
      deletedBy: this.deletedBy,
    };
  }
}
