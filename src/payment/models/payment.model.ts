import { PaymentMethod, PaymentStatus } from '../enums/payment.enum';

export class PaymentModel {
  public readonly id: number;
  public readonly orderId: number;
  public readonly paymentMethod: PaymentMethod;
  public readonly amount: number;
  public readonly status: PaymentStatus;
  public readonly transactionId?: string;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date;
  public readonly updatedBy: number;
  public readonly deletedAt?: Date;
  public readonly deletedBy?: number;

  constructor(
    id: number,
    orderId: number,
    paymentMethod: PaymentMethod,
    amount: number,
    status: PaymentStatus,
    transactionId: string | undefined,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.orderId = orderId;
    this.paymentMethod = paymentMethod;
    this.amount = amount;
    this.status = status;
    this.transactionId = transactionId;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
