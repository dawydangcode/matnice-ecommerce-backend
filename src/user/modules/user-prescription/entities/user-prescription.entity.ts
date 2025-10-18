import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserPrescriptionModel } from '../models/user-prescription.model';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('user_prescription')
export class UserPrescriptionEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'prescription_name', nullable: true })
  prescriptionName!: string;

  @Column({ name: 'right_eye_sph', type: 'decimal', precision: 4, scale: 2 })
  rightEyeSph!: number;

  @Column({ name: 'right_eye_cyl', type: 'decimal', precision: 4, scale: 2 })
  rightEyeCyl!: number;

  @Column({ name: 'right_eye_axis', type: 'int' })
  rightEyeAxis!: number;

  @Column({
    name: 'right_eye_add',
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  rightEyeAdd!: number | null;

  @Column({ name: 'left_eye_sph', type: 'decimal', precision: 4, scale: 2 })
  leftEyeSph!: number;

  @Column({ name: 'left_eye_cyl', type: 'decimal', precision: 4, scale: 2 })
  leftEyeCyl!: number;

  @Column({ name: 'left_eye_axis', type: 'int' })
  leftEyeAxis!: number;

  @Column({
    name: 'left_eye_add',
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  leftEyeAdd!: number | null;

  @Column({ name: 'pd_right', type: 'decimal', precision: 4, scale: 2 })
  pdRight!: number;

  @Column({ name: 'pd_left', type: 'decimal', precision: 4, scale: 2 })
  pdLeft!: number;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault!: boolean;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes!: string | null;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt!: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy!: number;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt!: Date;

  @Column({ name: 'deleted_by', nullable: true })
  deletedBy!: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user?: UserEntity;

  toModel(): UserPrescriptionModel {
    return new UserPrescriptionModel(
      this.id,
      this.userId,
      this.prescriptionName,
      this.rightEyeSph,
      this.rightEyeCyl,
      this.rightEyeAxis,
      this.rightEyeAdd ?? undefined,
      this.leftEyeSph,
      this.leftEyeCyl,
      this.leftEyeAxis,
      this.leftEyeAdd ?? undefined,
      this.pdRight,
      this.pdLeft,
      this.isDefault,
      this.notes ?? undefined,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
