import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductDetailModel } from '../models/product-detail.model';
import { FrameShapeType } from '../enum/frame.type';

@Entity('product_detail')
export class ProductDetailEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'product_id' })
  productId!: number;

  @Column({ name: 'product_number' })
  productNumber!: string;

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

  @Column({ name: 'frame_colour' })
  frameColor!: string;

  @Column({ name: 'frame_material' })
  frameMaterial!: string;

  @Column({ name: 'frame_shape' })
  frameShape!: FrameShapeType;

  @Column({ name: 'frame_type' })
  frameType!: string;

  @Column({ name: 'bridge_design' })
  bridgeDesign!: string;

  @Column({ name: 'style' })
  style!: string;

  @Column({ name: 'spring_hinges' })
  springHinge!: boolean;

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

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

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
      this.frameColor,
      this.frameMaterial,
      this.frameShape,
      this.frameType,
      this.bridgeDesign,
      this.style,
      this.springHinge,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
