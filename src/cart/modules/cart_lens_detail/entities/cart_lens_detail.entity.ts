import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartLensDetailModel } from '../models/cart_lens_detail.model';

@Entity('cart_lens_detail')
export class CartLensDetailEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'cart_frame_id' })
  cartFrameId!: number;

  // Prescription fields
  @Column({
    name: 'right_eye_sphere',
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  rightEyeSphere!: number;

  @Column({
    name: 'right_eye_cylinder',
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  rightEyeCylinder!: number;

  @Column({ name: 'right_eye_axis', nullable: true })
  rightEyeAxis!: number;

  @Column({
    name: 'left_eye_sphere',
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  leftEyeSphere!: number;

  @Column({
    name: 'left_eye_cylinder',
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  leftEyeCylinder!: number;

  @Column({ name: 'left_eye_axis', nullable: true })
  leftEyeAxis!: number;

  @Column({
    name: 'pd_left',
    type: 'decimal',
    precision: 4,
    scale: 1,
    nullable: true,
  })
  pdLeft!: number;

  @Column({
    name: 'pd_right',
    type: 'decimal',
    precision: 4,
    scale: 1,
    nullable: true,
  })
  pdRight!: number;

  @Column({
    name: 'add_left',
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  addLeft!: number;

  @Column({
    name: 'add_right',
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  addRight!: number;

  @Column({
    name: 'lens_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  lensPrice!: number;

  // New fields for lens products from LensSelectionPage
  @Column({ name: 'selected_coating_ids', type: 'text', nullable: true })
  selectedCoatingIds!: string | null; // JSON array of coating IDs

  @Column({ name: 'selected_tint_color_id', type: 'bigint', nullable: true })
  selectedTintColorId!: number | null;

  @Column({ name: 'lens_variant_id', type: 'bigint', nullable: true })
  lensVariantId!: number | null;

  // Notes
  @Column({ name: 'prescription_notes', type: 'text', nullable: true })
  prescriptionNotes!: string;

  @Column({ name: 'lens_notes', type: 'text', nullable: true })
  lensNotes!: string;

  @Column({ name: 'manufacturing_notes', type: 'text', nullable: true })
  manufacturingNotes!: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date;

  @Column({ name: 'deleted_by', nullable: true })
  deletedBy!: number;

  // Relations
  // @ManyToOne(() => CartFrameEntity)
  // @JoinColumn({ name: 'cart_frame_id', referencedColumnName: 'id' })
  // cartFrame: CartFrameEntity  ;

  // @ManyToOne(() => LensEntity)
  // @JoinColumn({ name: 'lens_id', referencedColumnName: 'id' })
  // lens: LensEntity  ;

  toModel(): CartLensDetailModel {
    return new CartLensDetailModel(
      this.id,
      this.cartFrameId,
      undefined, // lensId removed
      this.rightEyeSphere,
      this.rightEyeCylinder,
      this.rightEyeAxis,
      this.leftEyeSphere,
      this.leftEyeCylinder,
      this.leftEyeAxis,
      this.pdLeft,
      this.pdRight,
      undefined, // lensType removed
      'Standard', // lensQuality default
      undefined, // lensThicknessId removed
      undefined, // lensUpgradeDetailId removed
      0, // totalUpgradesPrice default
      this.lensPrice,
      undefined, // lensMaterial removed
      undefined, // tintId removed
      this.prescriptionNotes,
      this.lensNotes,
      this.manufacturingNotes,
      undefined, // fieldOfVision removed
      this.addLeft,
      this.addRight,
      this.selectedCoatingIds,
      this.selectedTintColorId,
      this.lensVariantId,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
