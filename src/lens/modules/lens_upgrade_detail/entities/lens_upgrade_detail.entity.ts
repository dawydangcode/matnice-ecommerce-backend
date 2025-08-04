import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { LensUpgradeDetailModel } from '../models/lens_upgrade_detail.model';

@Entity('lens_upgrade_detail')
export class LensUpgradeDetailEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'boolean', default: false })
  upgrade_hard_coating!: boolean;

  @Column({ type: 'boolean', default: false })
  upgrade_anti_reflection!: boolean;

  @Column({ type: 'boolean', default: false })
  upgrade_uv_protection!: boolean;

  @Column({ type: 'boolean', default: false })
  upgrade_blue_light!: boolean;

  @Column({ type: 'boolean', default: false })
  upgrade_lotus_effect!: boolean;

  @Column({ type: 'boolean', default: false })
  upgrade_smart_focus!: boolean;

  @Column({ type: 'boolean', default: false })
  upgrade_transition!: boolean;

  @Column({ type: 'boolean', default: false })
  upgrade_progressive!: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  upgrade_hard_coating_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  upgrade_anti_reflection_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  upgrade_uv_protection_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  upgrade_bluelight_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  upgrade_lotus_effect_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  upgrade_smart_focus_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  upgrade_transition_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  upgrade_progressive_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_upgrades_price!: number;

  @Column({ type: 'text', nullable: true })
  description!: string | undefined;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'int', nullable: true })
  created_by!: number | undefined;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;

  @Column({ type: 'int', nullable: true })
  updated_by!: number | undefined;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at!: Date | undefined;

  @Column({ type: 'int', nullable: true })
  deleted_by!: number | undefined;

  toModel(): LensUpgradeDetailModel {
    return new LensUpgradeDetailModel(
      this.id,
      this.name,
      this.upgrade_hard_coating,
      this.upgrade_anti_reflection,
      this.upgrade_uv_protection,
      this.upgrade_blue_light,
      this.upgrade_lotus_effect,
      this.upgrade_smart_focus,
      this.upgrade_transition,
      this.upgrade_progressive,
      this.upgrade_hard_coating_price,
      this.upgrade_anti_reflection_price,
      this.upgrade_uv_protection_price,
      this.upgrade_bluelight_price,
      this.upgrade_lotus_effect_price,
      this.upgrade_smart_focus_price,
      this.upgrade_transition_price,
      this.upgrade_progressive_price,
      this.total_upgrades_price,
      this.description,
      this.created_at,
      this.created_by,
      this.updated_at,
      this.updated_by,
      this.deleted_at,
      this.deleted_by,
    );
  }
}
