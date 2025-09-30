import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentModel } from './models/payment.model';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  GetPaymentsQueryDto,
} from './dtos/payment.dto';
import { PaymentStatus } from './enums/payment.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async createPayment(
    createPaymentDto: CreatePaymentDto,
    userId: number,
  ): Promise<PaymentModel> {
    try {
      const paymentEntity = new PaymentEntity();
      // Allow creating payments without an order (embedded cart payments)
      paymentEntity.orderId =
        createPaymentDto.orderId === undefined
          ? null
          : createPaymentDto.orderId;
      paymentEntity.paymentMethod = createPaymentDto.paymentMethod;
      paymentEntity.amount = createPaymentDto.amount;
      paymentEntity.status = PaymentStatus.PENDING;
      paymentEntity.transactionId = createPaymentDto.transactionId;
      paymentEntity.createdBy = userId;
      paymentEntity.updatedBy = userId;

      const savedPayment = await this.paymentRepository.save(paymentEntity);
      return savedPayment.toModel();
    } catch (error: any) {
      console.error('---[PaymentService] Create Payment Error---');
      console.error('Error details:', error);
      console.error('CreatePaymentDto:', createPaymentDto);
      console.error('UserId:', userId);
      throw new HttpException(
        `Failed to create payment: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPayments(
    params: GetPaymentsQueryDto,
  ): Promise<PageList<PaymentModel>> {
    try {
      const pagination = new PaginationParamsModel(params.page, params.limit);
      const queryBuilder = this.paymentRepository
        .createQueryBuilder('payment')
        .where('payment.deletedAt IS NULL');

      // Add filters
      if (params.status) {
        queryBuilder.andWhere('payment.status = :status', {
          status: params.status,
        });
      }

      if (params.paymentMethod) {
        queryBuilder.andWhere('payment.paymentMethod = :paymentMethod', {
          paymentMethod: params.paymentMethod,
        });
      }

      if (params.orderId) {
        queryBuilder.andWhere('payment.orderId = :orderId', {
          orderId: params.orderId,
        });
      }

      if (params.search) {
        queryBuilder.andWhere('payment.transactionId LIKE :search', {
          search: `%${params.search}%`,
        });
      }

      // Add pagination
      if (pagination) {
        const paginationQuery = pagination.toQuery();
        queryBuilder.skip(paginationQuery.skip).take(paginationQuery.take);
      }

      // Order by created date descending
      queryBuilder.orderBy('payment.createdAt', 'DESC');

      const [payments, total] = await queryBuilder.getManyAndCount();

      const paymentModels = payments.map((payment) => payment.toModel());

      return new PageList<PaymentModel>(total, paymentModels);
    } catch (error) {
      throw new HttpException(
        'Failed to get payments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPaymentById(id: number): Promise<PaymentModel> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }

      return payment.toModel();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPaymentsByOrderId(orderId: number): Promise<PaymentModel[]> {
    try {
      const payments = await this.paymentRepository.find({
        where: { orderId, deletedAt: IsNull() },
        order: { createdAt: 'DESC' },
      });

      return payments.map((payment) => payment.toModel());
    } catch (error) {
      throw new HttpException(
        'Failed to get payments for order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPaymentByTransactionId(
    transactionId: string,
  ): Promise<PaymentModel> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { transactionId, deletedAt: IsNull() },
      });

      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }

      return payment.toModel();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get payment by transaction ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePayment(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
    userId: number,
  ): Promise<PaymentModel> {
    try {
      // Check if payment exists
      const existingPayment = await this.paymentRepository.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!existingPayment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }

      // Update payment
      await this.paymentRepository.update(
        { id, deletedAt: IsNull() },
        {
          ...updatePaymentDto,
          updatedBy: userId,
        },
      );

      return await this.getPaymentById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePaymentStatus(
    id: number,
    status: PaymentStatus,
    userId: number,
    transactionId?: string,
  ): Promise<PaymentModel> {
    try {
      const updateData: any = {
        status,
        updatedBy: userId,
      };

      if (transactionId) {
        updateData.transactionId = transactionId;
      }

      await this.paymentRepository.update(
        { id, deletedAt: IsNull() },
        updateData,
      );

      return await this.getPaymentById(id);
    } catch (error) {
      throw new HttpException(
        'Failed to update payment status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletePayment(id: number, userId: number): Promise<boolean> {
    try {
      const existingPayment = await this.paymentRepository.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!existingPayment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }

      // Soft delete payment
      await this.paymentRepository.update(
        { id, deletedAt: IsNull() },
        {
          deletedAt: new Date(),
          deletedBy: userId,
        },
      );

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async processPayment(
    paymentId: number,
    transactionId: string,
    userId: number,
  ): Promise<PaymentModel> {
    try {
      return await this.updatePaymentStatus(
        paymentId,
        PaymentStatus.PROCESSING,
        userId,
        transactionId,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to process payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async completePayment(
    paymentId: number,
    userId: number,
  ): Promise<PaymentModel> {
    try {
      return await this.updatePaymentStatus(
        paymentId,
        PaymentStatus.COMPLETED,
        userId,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to complete payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async failPayment(paymentId: number, userId: number): Promise<PaymentModel> {
    try {
      return await this.updatePaymentStatus(
        paymentId,
        PaymentStatus.FAILED,
        userId,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to fail payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refundPayment(
    paymentId: number,
    userId: number,
  ): Promise<PaymentModel> {
    try {
      return await this.updatePaymentStatus(
        paymentId,
        PaymentStatus.REFUNDED,
        userId,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to refund payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
