import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ProductDetailModel } from '../models/product-detail.model';
import {
  FrameBridgeDesignType,
  FrameMaterialType,
  FrameShapeType,
  FrameStyleType,
  FrameType,
} from '../enum/frame.type';

@Entity('product_detail')
export class ProductDetailEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'product_id' })
  productId!: number;

  @Column({ name: 'product_number' })
  productNumber!: number;

  @Column({ name: 'bridge_width' })
  bridgeWidth!: number;

  @Column({ name: 'frame_width' })
  frameWidth!: number;

  @Column({ name: 'lens_height' })
  lensHeight!: number;

  @Column({ name: 'lens_width' })
  lensWidth!: number;

  @Column({ name: 'temple_length' })
  templeLength!: number;

  @Column({
    name: 'frame_material',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  frameMaterial!: FrameMaterialType;

  @Column({ name: 'frame_shape' })
  frameShape!: FrameShapeType;

  @Column({ name: 'frame_type' })
  frameType!: FrameType;

  @Column({
    name: 'bridge_design',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  bridgeDesign!: FrameBridgeDesignType;

  @Column({ name: 'style' })
  style!: FrameStyleType;

  @Column({ name: 'spring_hinges' })
  springHinges!: boolean;

  @Column({ name: 'weight' })
  weight!: number;

  @Column({ name: 'multifocal', type: 'boolean', default: false })
  multifocal!: boolean;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by', type: 'bigint' })
  createdBy!: number;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ name: 'updated_by', type: 'bigint' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  // Relations - TODO: Add to ProductEntity
  // @ManyToOne(
  //   () => ProductEntity,
  //   (product) => product.productDetails,
  // )
  // @JoinColumn({ name: 'product_id' })
  // product!: ProductEntity;

  toModel(): ProductDetailModel {
    return new ProductDetailModel(
      this.id,
      this.productId,
      this.productNumber,
      this.bridgeWidth,
      this.frameWidth,
      this.lensHeight,
      this.lensWidth,
      this.templeLength,
      this.frameMaterial,
      this.frameShape,
      this.frameType,
      this.bridgeDesign,
      this.style,
      this.springHinges,
      this.weight,
      this.multifocal,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
