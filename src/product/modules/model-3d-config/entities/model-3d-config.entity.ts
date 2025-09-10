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
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'model_id' })
  modelId!: number;

  @Column({ name: 'offset_x' })
  offsetX!: number;

  @Column({ name: 'offset_y' })
  offsetY!: number;

  @Column({ name: 'position_offset_x' })
  positionOffsetX!: number;

  @Column({ name: 'position_offset_y' })
  positionOffsetY!: number;

  @Column({ name: 'position_offset_z' })
  positionOffsetZ!: number;

  @Column({ name: 'initial_scale' })
  initialScale!: number;

  @Column({ name: 'rotation_sensitivity' })
  rotationSensitivity!: number;

  @Column({ name: 'yaw_limit' })
  yawLimit!: number;

  @Column({ name: 'pitch_limit' })
  pitchLimit!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

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
