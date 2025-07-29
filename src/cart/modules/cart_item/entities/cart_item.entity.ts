import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItemModel } from '../models/cart_item.model';
// Import entities (tạm comment để tránh lỗi circular import)
// import { CartEntity } from '../../../entities/cart.entity';
// import { ProductEntity } from '../../../../product/entities/product.entity';
// import { LensEntity } from '../../../../lens/entities/lens.entity';

@Entity('cart_item')
export class CartItemEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'cart_id' })
  cartId!: number;

  @Column({ name: 'product_id' })
  productId!: number;

  @Column({ name: 'lens_id' })
  lensId!: number;

  @Column({ name: 'quantity' })
  quantity!: number;

  @Column({ name: 'added_at' })
  addedAt!: Date;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @Column({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  // Relations (tạm comment để tránh circular import)
  // @ManyToOne(() => CartEntity)
  // @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  // cart: CartEntity | undefined;

  // @ManyToOne(() => ProductEntity)
  // @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  // product: ProductEntity | undefined;

  // @ManyToOne(() => LensEntity)
  // @JoinColumn({ name: 'lens_id', referencedColumnName: 'id' })
  // lens: LensEntity | undefined;

  toModel(): CartItemModel {
    return new CartItemModel(
      this.id,
      this.cartId,
      this.productId,
      this.lensId,
      this.quantity,
      this.addedAt,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
