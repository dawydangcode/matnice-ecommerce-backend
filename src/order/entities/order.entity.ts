import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../enums/order.enum';
import { OrderItemEntity } from '../modules/order-item/entities/order-item.entity';
import { OrderModel } from '../models/order.model';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'cart_id' })
  cartId!: number;

  @Column({
    name: 'order_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  orderDate!: Date;

  @Column({ name: 'subtotal', type: 'double' })
  subtotal!: number;

  @Column({ name: 'shipping_cost', type: 'double' })
  shippingCost!: number;

  @Column({ name: 'total_price', type: 'double' })
  totalPrice!: number;

  @Column({ name: 'payment_method', type: 'varchar' })
  paymentMethod!: PaymentMethod;

  @Column({ name: 'payment_status', type: 'varchar' })
  paymentStatus!: PaymentStatus;

  @Column({
    name: 'tracking_number',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  trackingNumber?: string;

  @Column({ name: 'delivery_date', type: 'timestamp', nullable: true })
  deliveryDate?: Date;

  @Column({ name: 'full_name', type: 'varchar' })
  fullName!: string;

  @Column({ name: 'phone', type: 'varchar' })
  phone!: string;

  @Column({ name: 'email', type: 'varchar' })
  email!: string;

  @Column({ name: 'province', type: 'varchar' })
  province!: string;

  @Column({ name: 'district', type: 'varchar' })
  district!: string;

  @Column({ name: 'ward', type: 'varchar' })
  ward!: string;

  @Column({ name: 'address_detail', type: 'varchar' })
  addressDetail!: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'status', type: 'varchar' })
  status!: OrderStatus;

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
  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems!: OrderItemEntity[];

  toModel(): OrderModel {
    // Map orderItems to model if they exist
    const orderItemsModel = this.orderItems?.map((item) => item.toModel());

    return new OrderModel(
      this.id,
      this.userId,
      this.cartId,
      this.orderDate,
      this.subtotal,
      this.shippingCost,
      this.totalPrice,
      this.paymentMethod,
      this.paymentStatus,
      this.trackingNumber,
      this.deliveryDate,
      this.fullName,
      this.phone,
      this.email,
      this.province,
      this.district,
      this.ward,
      this.addressDetail,
      this.notes,
      this.status,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
      orderItemsModel,
    );
  }
}
