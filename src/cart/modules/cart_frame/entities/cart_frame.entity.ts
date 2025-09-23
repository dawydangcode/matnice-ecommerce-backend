import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartFrameModel } from '../models/cart_frame.model';

@Entity('cart_frame')
export class CartFrameEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'cart_id' })
  cartId!: number;

  @Column({ name: 'product_id' })
  productId!: number;

  @Column({ name: 'quantity', default: 1 })
  quantity!: number;

  @Column({
    name: 'frame_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  framePrice!: number;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalPrice!: number;

  @Column({
    name: 'discount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  discount!: number;

  @Column({ name: 'added_at', type: 'timestamp', nullable: true })
  addedAt!: Date;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date;

  @Column({ name: 'deleted_by', nullable: true })
  deletedBy!: number;

  // Relations (comment để tránh circular import)
  // @ManyToOne(() => CartEntity)
  // @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  // cart: CartEntity   ;

  // @ManyToOne(() => ProductEntity)
  // @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  // product: ProductEntity   ;

  // @OneToOne(() => CartLensDetailEntity, lensDetail => lensDetail.cartFrame)
  // lensDetail: CartLensDetailEntity   ;

  toModel(): CartFrameModel {
    return new CartFrameModel(
      this.id,
      this.cartId,
      this.productId,
      this.quantity,
      typeof this.framePrice === 'string'
        ? parseFloat(this.framePrice)
        : this.framePrice,
      typeof this.totalPrice === 'string'
        ? parseFloat(this.totalPrice)
        : this.totalPrice,
      typeof this.discount === 'string'
        ? parseFloat(this.discount)
        : this.discount,
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
