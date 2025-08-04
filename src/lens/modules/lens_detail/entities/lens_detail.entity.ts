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

  @Column({ name: 'lens_type', type: 'varchar', length: 255, nullable: true })
  lensType!: string | null;

  @Column({ name: 'lens_thickness_id', type: 'bigint', nullable: true })
  lensThicknessId!: number | null;

  @Column({
    name: 'quality_type',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  qualityType!: string | null;

  @Column({
    name: 'quality_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  qualityPrice!: number | null;

  @Column({ name: 'tint_id', type: 'bigint', nullable: true })
  tintId!: number | null;

  @Column({ name: 'power_sphere_left', type: 'double', nullable: true })
  powerSphereLeft!: number | null;

  @Column({ name: 'power_sphere_right', type: 'double', nullable: true })
  powerSphereRight!: number | null;

  @Column({ name: 'power_cylinder_left', type: 'double', nullable: true })
  powerCylinderLeft!: number | null;

  @Column({ name: 'power_cylinder_right', type: 'double', nullable: true })
  powerCylinderRight!: number | null;

  @Column({ name: 'axis_left', type: 'int', nullable: true })
  axisLeft!: number | null;

  @Column({ name: 'axis_right', type: 'int', nullable: true })
  axisRight!: number | null;

  @Column({ name: 'pd_left', type: 'double', nullable: true })
  pdLeft!: number | null;

  @Column({ name: 'pd_right', type: 'double', nullable: true })
  pdRight!: number | null;

  @Column({ name: 'prescription_date', type: 'date', nullable: true })
  prescriptionDate!: Date | null;

  @Column({ name: 'material', type: 'varchar', length: 255, nullable: true })
  material!: string | null;

  @Column({ name: 'coating', type: 'varchar', length: 255, nullable: true })
  coating!: string | null;

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
  @ManyToOne(() => LensEntity)
  @JoinColumn({ name: 'lens_id' })
  lens!: LensEntity;

  toModel(): LensDetailModel {
    return new LensDetailModel(
      this.id,
      this.lensId,
      this.lensType,
      this.lensThicknessId,
      this.qualityType,
      this.qualityPrice,
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
      this.material,
      this.coating,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
