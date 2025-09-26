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
import { OrderItemEntity } from '../../order-item/entities/order-item.entity';
import { OrderLensDetailModel } from '../models/order-lens-detail.model';

@Entity('order_lens_detail')
export class OrderLensDetailEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'order_item_id' })
  orderItemId!: number;

  @Column({ name: 'lens_variant_id' })
  lensVariantId!: number;

  @Column({ name: 'right_eye_sphere', type: 'decimal', precision: 4, scale: 2 })
  rightEyeSphere!: number;

  @Column({
    name: 'right_eye_cylinder',
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  rightEyeCylinder?: number;

  @Column({ name: 'right_eye_axis', type: 'int', nullable: true })
  rightEyeAxis?: number;

  @Column({ name: 'left_eye_sphere', type: 'decimal', precision: 4, scale: 2 })
  leftEyeSphere!: number;

  @Column({
    name: 'left_eye_cylinder',
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  leftEyeCylinder?: number;

  @Column({ name: 'left_eye_axis', type: 'int', nullable: true })
  leftEyeAxis?: number;

  @Column({
    name: 'pd_left',
    type: 'decimal',
    precision: 4,
    scale: 1,
    nullable: true,
  })
  pdLeft?: number;

  @Column({
    name: 'pd_right',
    type: 'decimal',
    precision: 4,
    scale: 1,
    nullable: true,
  })
  pdRight?: number;

  @Column({
    name: 'add_left',
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  addLeft?: number;

  @Column({
    name: 'add_right',
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  addRight?: number;

  @Column({ name: 'lens_price', type: 'decimal', precision: 10, scale: 2 })
  lensPrice!: number;

  @Column({ name: 'selected_coating_ids', type: 'text', nullable: true })
  selectedCoatingIds?: string; // JSON array string

  @Column({ name: 'selected_tint_color_id', nullable: true })
  selectedTintColorId?: number;

  @Column({ name: 'prescription_notes', type: 'text', nullable: true })
  prescriptionNotes?: string;

  @Column({ name: 'lens_notes', type: 'text', nullable: true })
  lensNotes?: string;

  @Column({ name: 'manufacturing_notes', type: 'text', nullable: true })
  manufacturingNotes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @Column({ name: 'deleted_by', nullable: true })
  deletedBy?: number;

  // Relations
  @ManyToOne(() => OrderItemEntity, (orderItem) => orderItem.lensDetails)
  @JoinColumn({ name: 'order_item_id' })
  orderItem!: OrderItemEntity;

  toModel(): OrderLensDetailModel {
    return new OrderLensDetailModel(
      this.id,
      this.orderItemId,
      this.lensVariantId,
      this.rightEyeSphere,
      this.rightEyeCylinder,
      this.rightEyeAxis,
      this.leftEyeSphere,
      this.leftEyeCylinder,
      this.leftEyeAxis,
      this.pdLeft,
      this.pdRight,
      this.addLeft,
      this.addRight,
      this.lensPrice,
      this.selectedCoatingIds,
      this.selectedTintColorId,
      this.prescriptionNotes,
      this.lensNotes,
      this.manufacturingNotes,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
