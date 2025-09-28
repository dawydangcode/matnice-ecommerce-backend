import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { PaymentMethod, PaymentStatus } from '../enums/payment.enum';
import { PaymentModel } from '../models/payment.model';

@Entity('payment')
export class PaymentEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'order_id', type: 'int', nullable: true })
  orderId!: number | null;

  @Column({ name: 'payment_method', type: 'varchar' })
  paymentMethod!: PaymentMethod;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ name: 'status', type: 'varchar' })
  status!: PaymentStatus;

  @Column({ name: 'transaction_id', type: 'varchar', nullable: true })
  transactionId?: string;

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

  toModel(): PaymentModel {
    return new PaymentModel(
      this.id,
      this.orderId === undefined ? null : this.orderId,
      this.paymentMethod,
      this.amount,
      this.status,
      this.transactionId,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
