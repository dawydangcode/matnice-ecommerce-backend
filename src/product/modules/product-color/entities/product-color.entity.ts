import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ProductEntity } from '../../../entities/product.entity';
import { ProductDetailEntity } from '../../product-detail/entities/product-detail.entity';
import { ProductImageEntity } from '../../product-image/entities/product-image.entity';
import { ProductColorModel } from '../models/product-color.model';

@Entity('product_color')
export class ProductColorEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'product_id' })
  productId!: number;

  @Column({ name: 'color_name' })
  colorName!: string;

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

  @ManyToOne(() => ProductEntity, (product) => product.productColors)
  @JoinColumn({ name: 'product_id' })
  product?: ProductEntity;

  @OneToMany(() => ProductImageEntity, (image) => image.productColor)
  productImage?: ProductImageEntity[];

  toModel(): ProductColorModel {
    return new ProductColorModel(
      this.id,
      this.productId,
      this.colorName,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
