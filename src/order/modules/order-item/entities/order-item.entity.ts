import { OrderLensDetailEntity } from '../../order-lens-detail/entities/order-lens-detail.entity';
import { OrderEntity } from '../../../entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { OrderItemModel } from '../models/order-item.model';

@Entity('order_item')
export class OrderItemEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'order_id' })
  orderId!: number;

  @Column({ name: 'product_id' })
  productId!: number;

  @Column({ name: 'quantity', type: 'int', default: 1 })
  quantity!: number;

  @Column({
    name: 'frame_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  framePrice!: number;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  totalPrice!: number;

  @Column({
    name: 'discount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  discount!: number;

  @Column({ name: 'selected_color_id', nullable: true })
  selectedColorId?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @Column({ name: 'deleted_by', nullable: true })
  deletedBy?: number;

  // Relations
  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @OneToMany(() => OrderLensDetailEntity, (lensDetail) => lensDetail.orderItem)
  lensDetails!: OrderLensDetailEntity[];

  toModel(): OrderItemModel {
    return new OrderItemModel(
      this.id,
      this.orderId,
      this.productId,
      this.quantity,
      this.framePrice,
      this.totalPrice,
      this.discount,
      this.selectedColorId,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
