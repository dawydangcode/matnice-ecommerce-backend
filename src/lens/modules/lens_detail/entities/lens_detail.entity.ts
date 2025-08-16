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
import { LensDetailModel } from '../models/lens_detail.model';
import { LensEntity } from '../../../entities/lens.entity';

@Entity('lens_detail')
export class LensDetailEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'lens_id' })
  lensId!: number;

  @Column({ name: 'lens_thickness_id', type: 'bigint', nullable: true })
  lensThicknessId!: number;

  @Column({ name: 'lens_quality_id', type: 'bigint', nullable: true })
  lensQualityId!: number;

  @Column({ name: 'tint_id', type: 'bigint', nullable: true })
  tintId!: number;

  @Column({ name: 'power_sphere_left', type: 'double', nullable: true })
  powerSphereLeft!: number;

  @Column({ name: 'power_sphere_right', type: 'double', nullable: true })
  powerSphereRight!: number;

  @Column({ name: 'power_cylinder_left', type: 'double', nullable: true })
  powerCylinderLeft!: number;

  @Column({ name: 'power_cylinder_right', type: 'double', nullable: true })
  powerCylinderRight!: number;

  @Column({ name: 'axis_left', type: 'int', nullable: true })
  axisLeft!: number;

  @Column({ name: 'axis_right', type: 'int', nullable: true })
  axisRight!: number;

  @Column({ name: 'pd_left', type: 'double', nullable: true })
  pdLeft!: number;

  @Column({ name: 'pd_right', type: 'double', nullable: true })
  pdRight!: number;

  @Column({ name: 'prescription_date', type: 'date', nullable: true })
  prescriptionDate!: Date;

  @Column({
    name: 'lens_type',
    type: 'enum',
    enum: ['single_vision', 'progressive', 'office', 'non_prescription'],
    default: 'single_vision',
  })
  lensType!: string;

  @Column({ name: 'has_axis_correction' })
  hasAxisCorrection!: boolean;

  @Column({ name: 'is_non_prescription', default: false })
  isNonPrescription!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by', type: 'bigint' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ name: 'updated_by', type: 'bigint' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date;

  @Column({ name: 'deleted_by', type: 'bigint', nullable: true })
  deletedBy!: number;

  // Relations
  @ManyToOne(() => LensEntity)
  @JoinColumn({ name: 'lens_id' })
  lens!: LensEntity;

  toModel(): LensDetailModel {
    return new LensDetailModel(
      this.id,
      this.lensId,
      this.lensThicknessId,
      this.lensQualityId,
      this.tintId,
      this.powerSphereLeft,
      this.powerSphereRight,
      this.powerCylinderLeft,
      this.powerCylinderRight,
      this.axisLeft,
      this.axisRight,
      this.pdLeft,
      this.pdRight,
      this.prescriptionDate,
      this.lensType,
      this.hasAxisCorrection,
      this.isNonPrescription,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
