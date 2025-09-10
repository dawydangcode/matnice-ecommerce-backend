import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Product3dModelEntity } from '../../product-3d-model/entities/product-3d-model.entity';
import { Model3dConfigModel } from '../models/model-3d-config.model';

@Entity('model_3d_config')
export class Model3dConfigEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ name: 'model_id', type: 'bigint' })
  modelId!: number;

  @Column({
    name: 'offset_x',
    type: 'decimal',
    precision: 5,
    scale: 3,
    default: 0.5,
  })
  offsetX!: number;

  @Column({
    name: 'offset_y',
    type: 'decimal',
    precision: 5,
    scale: 3,
    default: 0.5,
  })
  offsetY!: number;

  @Column({
    name: 'position_offset_x',
    type: 'decimal',
    precision: 5,
    scale: 3,
    default: 0.4,
  })
  positionOffsetX!: number;

  @Column({
    name: 'position_offset_y',
    type: 'decimal',
    precision: 5,
    scale: 3,
    default: 0.097,
  })
  positionOffsetY!: number;

  @Column({
    name: 'position_offset_z',
    type: 'decimal',
    precision: 5,
    scale: 3,
    default: -0.4,
  })
  positionOffsetZ!: number;

  @Column({
    name: 'initial_scale',
    type: 'decimal',
    precision: 5,
    scale: 3,
    default: 0.16,
  })
  initialScale!: number;

  @Column({
    name: 'rotation_sensitivity',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 1.0,
  })
  rotationSensitivity!: number;

  @Column({
    name: 'yaw_limit',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0.5,
  })
  yawLimit!: number;

  @Column({
    name: 'pitch_limit',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0.3,
  })
  pitchLimit!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by', type: 'bigint', nullable: true })
  createdBy?: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedBy?: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @Column({ name: 'deleted_by', type: 'bigint', nullable: true })
  deletedBy?: number;

  // Relations
  @OneToOne(() => Product3dModelEntity)
  @JoinColumn({ name: 'model_id' })
  model?: Product3dModelEntity;

  toModel(): Model3dConfigModel {
    return new Model3dConfigModel(
      this.id,
      this.modelId,
      this.offsetX,
      this.offsetY,
      this.positionOffsetX,
      this.positionOffsetY,
      this.positionOffsetZ,
      this.initialScale,
      this.rotationSensitivity,
      this.yawLimit,
      this.pitchLimit,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
