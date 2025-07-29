import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductGenderType, ProductType } from '../enum/product.type';
import { ProductModel } from '../models/product.model';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'product_name' })
  productName!: string;

  @Column({ name: 'product_type' })
  productType!: ProductType;

  @Column({ name: 'brand_id' })
  brandId!: number;

  @Column({ name: 'gender' })
  gender!: ProductGenderType;

  @Column({ name: 'price' })
  price!: number;

  @Column({ name: 'stock' })
  stock!: number;

  @Column({ name: 'description' })
  description!: string;

  @Column({ name: 'is_sustainable', default: false })
  isSustainable!: boolean;

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

  toModel(): ProductModel {
    return new ProductModel(
      this.id,
      this.productName,
      this.productType,
      this.brandId,
      this.gender,
      this.price,
      this.stock,
      this.description,
      this.isSustainable,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
