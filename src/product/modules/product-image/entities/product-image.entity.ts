import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ProductEntity } from '../../../entities/product.entity';
import { ProductColorEntity } from '../../product-color/entities/product-color.entity';
import { ProductImageModel } from '../models/product-image.model';

@Entity('product_image')
export class ProductImageEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'product_id' })
  productId!: number;

  @Column({ name: 'product_color_id', nullable: true })
  productColorId?: number;

  @Column({ name: 'image_url' })
  imageUrl!: string;

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

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @ManyToOne(
    () => ProductColorEntity,
    (productColor) => productColor.productImage,
  )
  @JoinColumn({ name: 'product_color_id' })
  productColor?: ProductColorEntity;

  toModel(): ProductImageModel {
    return new ProductImageModel(
      this.id,
      this.productId,
      this.productColorId,
      this.imageUrl,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
