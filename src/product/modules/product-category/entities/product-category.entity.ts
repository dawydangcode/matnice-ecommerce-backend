import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductCategoryModel } from '../models/product-category.model';
import { ProductEntity } from '../../../entities/product.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';

@Entity('product_category')
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'product_id' })
  productId!: number;

  @Column({ name: 'category_id' })
  categoryId!: number;

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
  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: ProductEntity;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: CategoryEntity;

  toModel(): ProductCategoryModel {
    return new ProductCategoryModel(
      this.id,
      this.productId,
      this.categoryId,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
