import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ProductGenderType, ProductType } from '../enum/product.type';
import { ProductModel } from '../models/product.model';
import { ProductColorEntity } from '../modules/product-color/entities/product-color.entity';
import { BrandEntity } from '../../brand/entities/brand.entity';
import { ProductDetailEntity } from '../modules/product-detail/entities/product-detail.entity';

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

  // Relations
  @OneToMany(() => ProductColorEntity, (productColor) => productColor.product)
  productColors!: ProductColorEntity[];

  @ManyToOne(() => BrandEntity, { eager: false })
  @JoinColumn({ name: 'brand_id' })
  brand?: BrandEntity;

  @OneToOne(() => ProductDetailEntity, { eager: false })
  @JoinColumn({ name: 'id', referencedColumnName: 'productId' })
  productDetail?: ProductDetailEntity;

  toModel(): ProductModel {
    const model = new ProductModel(
      this.id,
      this.productName,
      this.productType,
      this.brandId,
      this.gender,
      this.price,
      this.description,
      this.isSustainable,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );

    // Add relations if they exist
    if (this.brand) {
      (model as any).brand = this.brand.toModel();
    }
    if (this.productDetail) {
      (model as any).productDetail = this.productDetail.toModel();
    }
    if (this.productColors) {
      (model as any).productColors = this.productColors.map((color) =>
        color.toModel(),
      );
      // Calculate total stock from all colors
      (model as any).stock = this.productColors.reduce(
        (total, color) => total + color.stock,
        0,
      );
    }

    return model;
  }
}
