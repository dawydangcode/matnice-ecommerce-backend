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
import { LensEntity } from '../../../entities/lens.entity';
import { LensThicknessEntity } from '../../lens_thickness/entities/lens_thickness.entity';
import { LensVariantModel } from '../models/lens_variant.model';
import { LensMaterialsType } from '../enum/lens-materials.type';
import { LensDesignType } from '../enum/lens_design.type';

@Entity('lens_variant')
export class LensVariantEntity {
  @PrimaryGeneratedColumn('increment', {})
  id!: number;

  @Column({ name: 'lens_id' })
  lensId!: number;

  @Column({ name: 'lens_thickness_id' })
  lensThicknessId!: number;

  @Column({ name: 'design' })
  design!: LensDesignType;

  @Column({ type: 'varchar', length: 255 })
  material!: LensMaterialsType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

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
  @ManyToOne(() => LensEntity, { eager: false })
  @JoinColumn({ name: 'lens_id' })
  lens!: LensEntity;

  @ManyToOne(() => LensThicknessEntity, { eager: false })
  @JoinColumn({ name: 'lens_thickness_id' })
  lensThickness!: LensThicknessEntity;

  toModel(): LensVariantModel {
    return new LensVariantModel(
      this.id,
      this.lensId,
      this.lensThicknessId,
      this.design,
      this.material,
      this.price,
      this.stock,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
