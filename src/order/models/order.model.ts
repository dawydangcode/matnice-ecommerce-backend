import { OrderStatus, PaymentMethod, PaymentStatus } from '../enums/order.enum';

export class OrderModel {
  public readonly id: number;
  public readonly userId: number;
  public readonly cartId: number;
  public readonly orderDate: Date;
  public readonly subtotal: number;
  public readonly shippingCost: number;
  public readonly totalPrice: number;
  public readonly paymentMethod: PaymentMethod;
  public readonly paymentStatus: PaymentStatus;
  public readonly trackingNumber?: string;
  public readonly deliveryDate?: Date;
  public readonly fullName: string;
  public readonly phone: string;
  public readonly email: string;
  public readonly province: string;
  public readonly district: string;
  public readonly ward: string;
  public readonly addressDetail: string;
  public readonly notes?: string;
  public readonly status: OrderStatus;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date;
  public readonly updatedBy: number;
  public readonly deletedAt?: Date;
  public readonly deletedBy?: number;
  public readonly orderItems?: any[]; // Will be populated in getOrderWithDetails

  constructor(
    id: number,
    userId: number,
    cartId: number,
    orderDate: Date,
    subtotal: number,
    shippingCost: number,
    totalPrice: number,
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus,
    trackingNumber: string | undefined,
    deliveryDate: Date | undefined,
    fullName: string,
    phone: string,
    email: string,
    province: string,
    district: string,
    ward: string,
    addressDetail: string,
    notes: string | undefined,
    status: OrderStatus,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
    orderItems?: any[],
  ) {
    this.id = id;
    this.userId = userId;
    this.cartId = cartId;
    this.orderDate = orderDate;
    this.subtotal = subtotal;
    this.shippingCost = shippingCost;
    this.totalPrice = totalPrice;
    this.paymentMethod = paymentMethod;
    this.paymentStatus = paymentStatus;
    this.trackingNumber = trackingNumber;
    this.deliveryDate = deliveryDate;
    this.fullName = fullName;
    this.phone = phone;
    this.email = email;
    this.province = province;
    this.district = district;
    this.ward = ward;
    this.addressDetail = addressDetail;
    this.notes = notes;
    this.status = status;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    this.orderItems = orderItems;
  }
}
