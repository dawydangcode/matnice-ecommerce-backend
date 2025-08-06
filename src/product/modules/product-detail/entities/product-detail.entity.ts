import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductDetailModel } from '../models/product-detail.model';
import { ProductColorEntity } from '../../product-color/entities/product-color.entity';

@Entity('product_detail')
export class ProductDetailEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ name: 'product_color_id', type: 'bigint' })
  productColorId!: number;

  @Column({ name: 'bridge_width', type: 'double precision', nullable: true })
  bridgeWidth?: number;

  @Column({ name: 'frame_width', type: 'double precision', nullable: true })
  frameWidth?: number;

  @Column({ name: 'lens_height', type: 'double precision', nullable: true })
  lensHeight?: number;

  @Column({ name: 'lens_width', type: 'double precision', nullable: true })
  lensWidth?: number;

  @Column({ name: 'temple_length', type: 'double precision', nullable: true })
  templeLength?: number;

  @Column({ name: 'product_number', type: 'int', nullable: true })
  productNumber?: number;

  @Column({
    name: 'frame_material',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  frameMaterial?: string;

  @Column({ name: 'frame_shape', type: 'varchar', length: 50, nullable: true })
  frameShape?: string;

  @Column({ name: 'frame_type', type: 'varchar', length: 50, nullable: true })
  frameType?: string;

  @Column({
    name: 'bridge_design',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  bridgeDesign?: string;

  @Column({ name: 'style', type: 'varchar', length: 50, nullable: true })
  style?: string;

  @Column({ name: 'spring_hinges', type: 'boolean', default: false })
  springHinges!: boolean;

  @Column({ name: 'weight', type: 'double precision', nullable: true })
  weight?: number;

  @Column({ name: 'multifocal', type: 'boolean', default: false })
  multifocal!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by', type: 'bigint' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ name: 'updated_by', type: 'bigint' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @Column({ name: 'deleted_by', type: 'bigint', nullable: true })
  deletedBy?: number;

  // Relations
  @ManyToOne(
    () => ProductColorEntity,
    (productColor) => productColor.productDetails,
  )
  @JoinColumn({ name: 'product_color_id' })
  productColor!: ProductColorEntity;

  toModel(): ProductDetailModel {
    return new ProductDetailModel(
      this.id,
      this.productColorId,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.bridgeWidth,
      this.frameWidth,
      this.lensHeight,
      this.lensWidth,
      this.templeLength,
      this.productNumber,
      this.frameMaterial,
      this.frameShape,
      this.frameType,
      this.bridgeDesign,
      this.style,
      this.springHinges,
      this.weight,
      this.multifocal,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
