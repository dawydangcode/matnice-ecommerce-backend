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

  @Column({
    name: 'lens_id',
    type: 'bigint',
    nullable: true,
    default: null,
  })
  lensId!: number;

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

  // Lens configuration
  @Column({ name: 'lens_type', length: 100, nullable: true })
  lensType!: string;

  @Column({ name: 'lens_quality', length: 50, default: 'Standard' })
  lensQuality!: string;

  @Column({
    name: 'refraction_index',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 1.5,
  })
  refractionIndex!: number;

  // Upgrades
  @Column({ name: 'upgrade_hard_coating', default: false })
  upgradeHardCoating!: boolean;

  @Column({ name: 'upgrade_anti_reflection', default: false })
  upgradeAntiReflection!: boolean;

  @Column({ name: 'upgrade_uv_protection', default: false })
  upgradeUvProtection!: boolean;

  @Column({ name: 'upgrade_blue_light', default: false })
  upgradeBlueLight!: boolean;

  @Column({ name: 'upgrade_lotus_effect', default: false })
  upgradeLotusEffect!: boolean;

  @Column({ name: 'upgrade_smart_focus', default: false })
  upgradeSmartFocus!: boolean;

  @Column({ name: 'upgrade_transition', default: false })
  upgradeTransition!: boolean;

  @Column({ name: 'upgrade_progressive', default: false })
  upgradeProgressive!: boolean;

  // Upgrade prices
  @Column({
    name: 'upgrade_hard_coating_price',
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
  })
  upgradeHardCoatingPrice!: number;

  @Column({
    name: 'upgrade_anti_reflection_price',
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
  })
  upgradeAntiReflectionPrice!: number;

  @Column({
    name: 'upgrade_uv_protection_price',
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
  })
  upgradeUvProtectionPrice!: number;

  @Column({
    name: 'upgrade_blue_light_price',
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
  })
  upgradeBluelightPrice!: number;

  @Column({
    name: 'upgrade_lotus_effect_price',
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
  })
  upgradeLotusEffectPrice!: number;

  @Column({
    name: 'upgrade_smart_focus_price',
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
  })
  upgradeSmartFocusPrice!: number;

  @Column({
    name: 'upgrade_transition_price',
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
  })
  upgradeTransitionPrice!: number;

  @Column({
    name: 'upgrade_progressive_price',
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
  })
  upgradeProgressivePrice!: number;

  @Column({
    name: 'total_upgrades_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalUpgradesPrice!: number;

  @Column({
    name: 'lens_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  lensPrice!: number;

  // Additional lens options
  @Column({ name: 'lens_material', length: 50, nullable: true })
  lensMaterial!: string;

  @Column({ name: 'lens_thickness', length: 20, nullable: true })
  lensThickness!: string;

  @Column({ name: 'tint_color', length: 30, nullable: true })
  tintColor!: string;

  @Column({ name: 'tint_density', length: 20, nullable: true })
  tintDensity!: string;

  // Notes
  @Column({ name: 'prescription_notes', type: 'text', nullable: true })
  prescriptionNotes!: string;

  @Column({ name: 'lens_notes', type: 'text', nullable: true })
  lensNotes!: string;

  @Column({ name: 'manufacturing_notes', type: 'text', nullable: true })
  manufacturingNotes!: string;

  @Column({ name: 'field_of_vision', length: 50, nullable: true })
  fieldOfVision!: string;

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
      this.lensId,
      this.rightEyeSphere,
      this.rightEyeCylinder,
      this.rightEyeAxis,
      this.leftEyeSphere,
      this.leftEyeCylinder,
      this.leftEyeAxis,
      this.pdLeft,
      this.pdRight,
      this.lensType,
      this.lensQuality,
      this.refractionIndex,
      this.upgradeHardCoating,
      this.upgradeAntiReflection,
      this.upgradeUvProtection,
      this.upgradeBlueLight,
      this.upgradeLotusEffect,
      this.upgradeSmartFocus,
      this.upgradeTransition,
      this.upgradeProgressive,
      this.upgradeHardCoatingPrice,
      this.upgradeAntiReflectionPrice,
      this.upgradeUvProtectionPrice,
      this.upgradeBluelightPrice,
      this.upgradeLotusEffectPrice,
      this.upgradeSmartFocusPrice,
      this.upgradeTransitionPrice,
      this.upgradeProgressivePrice,
      this.totalUpgradesPrice,
      this.lensPrice,
      this.lensMaterial,
      this.lensThickness,
      this.tintColor,
      this.tintDensity,
      this.prescriptionNotes,
      this.lensNotes,
      this.manufacturingNotes,
      this.fieldOfVision,
      this.addLeft,
      this.addRight,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
