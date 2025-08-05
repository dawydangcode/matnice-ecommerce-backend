import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductThicknessCompatibilityModel } from '../models/product-thickness-compatibility.model';
import { ProductEntity } from '../../../entities/product.entity';
import { LensThicknessEntity } from 'src/lens/modules/lens_thickness/entities/lens_thickness.entity';

@Entity('product_thickness_compatibility')
export class ProductThicknessCompatibilityEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'product_id' })
  productId!: number;

  @Column({ name: 'lens_thickness_id' })
  lensThicknessId!: number;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by', nullable: true })
  deletedBy!: number;

  // Relations
  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: ProductEntity;

  @ManyToOne(() => LensThicknessEntity)
  @JoinColumn({ name: 'lens_thickness_id', referencedColumnName: 'id' })
  lensThickness?: LensThicknessEntity;

  toModel(): ProductThicknessCompatibilityModel {
    return new ProductThicknessCompatibilityModel(
      this.id,
      this.productId,
      this.lensThicknessId,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
