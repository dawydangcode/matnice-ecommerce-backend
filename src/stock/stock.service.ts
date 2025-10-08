import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProductColorEntity } from '../product/modules/product-color/entities/product-color.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { LensVariantEntity } from '../lens/modules/lens_variant/entities/lens_variant.entity';
import { OrderItemEntity } from '../order/modules/order-item/entities/order-item.entity';
import { OrderLensDetailEntity } from '../order/modules/order-lens-detail/entities/order-lens-detail.entity';

export interface StockReservationItem {
  productColorId: number;
  quantity: number;
}

export interface StockValidationResult {
  isValid: boolean;
  errors: {
    productColorId: number;
    colorName: string;
    requested: number;
    available: number;
    message: string;
  }[];
}

export interface OrderStockUpdateResult {
  success: boolean;
  message: string;
  details?: {
    productColorUpdates?: Array<{
      productColorId: number;
      previousStock: number;
      newStock: number;
      quantityReduced: number;
    }>;
    lensVariantUpdates?: Array<{
      lensVariantId: number;
      previousStock: number;
      newStock: number;
      quantityReduced: number;
    }>;
  };
}

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(
    @InjectRepository(ProductColorEntity)
    private readonly productColorRepository: Repository<ProductColorEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(LensVariantEntity)
    private readonly lensVariantRepository: Repository<LensVariantEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(OrderLensDetailEntity)
    private readonly orderLensDetailRepository: Repository<OrderLensDetailEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Kiểm tra tồn kho có đủ không trước khi đặt hàng
   */
  async validateStock(
    items: StockReservationItem[],
  ): Promise<StockValidationResult> {
    const result: StockValidationResult = {
      isValid: true,
      errors: [],
    };

    for (const item of items) {
      const productColor = await this.productColorRepository.findOne({
        where: { id: item.productColorId },
        relations: ['product'],
      });

      if (!productColor) {
        result.isValid = false;
        result.errors.push({
          productColorId: item.productColorId,
          colorName: 'Unknown',
          requested: item.quantity,
          available: 0,
          message: `Product color with ID ${item.productColorId} not found`,
        });
        continue;
      }

      if (productColor.stock < item.quantity) {
        result.isValid = false;
        result.errors.push({
          productColorId: item.productColorId,
          colorName: productColor.colorName,
          requested: item.quantity,
          available: productColor.stock,
          message: `Insufficient stock for ${productColor.colorName}. Requested: ${item.quantity}, Available: ${productColor.stock}`,
        });
      }
    }

    return result;
  }

  /**
   * Trừ stock khi đặt hàng thành công (với transaction)
   */
  async reserveStock(
    items: StockReservationItem[],
    userId: number,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate stock trước khi trừ
      const validation = await this.validateStock(items);
      if (!validation.isValid) {
        const errorMessages = validation.errors
          .map((e) => e.message)
          .join('; ');
        throw new HttpException(
          `Stock validation failed: ${errorMessages}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Trừ stock cho từng item
      for (const item of items) {
        await queryRunner.manager.decrement(
          ProductColorEntity,
          { id: item.productColorId },
          'stock',
          item.quantity,
        );

        // Update timestamp
        await queryRunner.manager.update(
          ProductColorEntity,
          { id: item.productColorId },
          {
            updatedBy: userId,
            updatedAt: new Date(),
          },
        );
      }

      // Commit transaction
      await queryRunner.commitTransaction();

      console.log('Stock reserved successfully:', items);
    } catch (error) {
      // Rollback nếu có lỗi
      await queryRunner.rollbackTransaction();
      console.error('Stock reservation failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Hoàn trả stock khi hủy đơn hàng hoặc rollback
   */
  async releaseStock(
    items: StockReservationItem[],
    userId: number,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Hoàn trả stock cho từng item
      for (const item of items) {
        await queryRunner.manager.increment(
          ProductColorEntity,
          { id: item.productColorId },
          'stock',
          item.quantity,
        );

        // Update timestamp
        await queryRunner.manager.update(
          ProductColorEntity,
          { id: item.productColorId },
          {
            updatedBy: userId,
            updatedAt: new Date(),
          },
        );
      }

      // Commit transaction
      await queryRunner.commitTransaction();

      console.log('Stock released successfully:', items);
    } catch (error) {
      // Rollback nếu có lỗi
      await queryRunner.rollbackTransaction();
      console.error('Stock release failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Lấy thông tin stock hiện tại
   */
  async getStockInfo(productColorId: number): Promise<{
    productColorId: number;
    colorName: string;
    productName: string;
    stock: number;
  } | null> {
    const productColor = await this.productColorRepository.findOne({
      where: { id: productColorId },
      relations: ['product'],
    });

    if (!productColor) {
      return null;
    }

    return {
      productColorId: productColor.id,
      colorName: productColor.colorName,
      productName: productColor.product?.productName || 'Unknown Product',
      stock: productColor.stock,
    };
  }

  /**
   * Lấy tổng stock của một product (tất cả màu)
   */
  async getTotalProductStock(productId: number): Promise<number> {
    const productColors = await this.productColorRepository.find({
      where: { productId },
    });

    return productColors.reduce((total, color) => total + color.stock, 0);
  }

  /**
   * Cập nhật stock cho một product color cụ thể
   */
  async updateStock(
    productColorId: number,
    newStock: number,
    userId: number,
  ): Promise<void> {
    const productColor = await this.productColorRepository.findOne({
      where: { id: productColorId },
    });

    if (!productColor) {
      throw new HttpException(
        `Product color with ID ${productColorId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.productColorRepository.update(
      { id: productColorId },
      {
        stock: newStock,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    );

    console.log(
      `Stock updated for product color ${productColorId}: ${productColor.stock} -> ${newStock}`,
    );
  }

  /**
   * Kiểm tra stock có sẵn cho một màu cụ thể
   */
  async checkAvailableStock(productColorId: number): Promise<number> {
    const productColor = await this.productColorRepository.findOne({
      where: { id: productColorId },
      select: ['stock'],
    });

    return productColor?.stock || 0;
  }

  /**
   * Trừ stock cho toàn bộ order (bao gồm cả ProductColor và LensVariant)
   */
  async reduceStockForOrder(
    orderId: number,
    userId: number,
  ): Promise<OrderStockUpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log(`Starting stock reduction for order ${orderId}`);

      // Get all order items with their lens details
      const orderItems = await queryRunner.manager.find(OrderItemEntity, {
        where: { orderId },
        relations: ['lensDetails'],
      });

      if (!orderItems.length) {
        throw new HttpException(
          'No order items found for this order',
          HttpStatus.BAD_REQUEST,
        );
      }

      const productColorUpdates: Array<{
        productColorId: number;
        previousStock: number;
        newStock: number;
        quantityReduced: number;
      }> = [];

      const lensVariantUpdates: Array<{
        lensVariantId: number;
        previousStock: number;
        newStock: number;
        quantityReduced: number;
      }> = [];

      // Process each order item
      for (const orderItem of orderItems) {
        // 1. Reduce ProductColor stock (for frames)
        if (orderItem.selectedColorId) {
          const productColor = await queryRunner.manager.findOne(
            ProductColorEntity,
            {
              where: { id: orderItem.selectedColorId },
            },
          );

          if (!productColor) {
            throw new HttpException(
              `ProductColor with ID ${orderItem.selectedColorId} not found`,
              HttpStatus.BAD_REQUEST,
            );
          }

          const previousStock = productColor.stock;
          const quantityToReduce = orderItem.quantity;

          if (previousStock < quantityToReduce) {
            throw new HttpException(
              `Insufficient stock for ProductColor ${orderItem.selectedColorId}. ` +
                `Available: ${previousStock}, Required: ${quantityToReduce}`,
              HttpStatus.BAD_REQUEST,
            );
          }

          productColor.stock = previousStock - quantityToReduce;
          productColor.updatedBy = userId;

          await queryRunner.manager.save(ProductColorEntity, productColor);

          productColorUpdates.push({
            productColorId: orderItem.selectedColorId,
            previousStock,
            newStock: productColor.stock,
            quantityReduced: quantityToReduce,
          });

          this.logger.log(
            `Reduced ProductColor ${orderItem.selectedColorId} stock: ${previousStock} -> ${productColor.stock}`,
          );
        }

        // 2. Reduce LensVariant stock (for each lens)
        if (orderItem.lensDetails && orderItem.lensDetails.length > 0) {
          for (const lensDetail of orderItem.lensDetails) {
            const lensVariant = await queryRunner.manager.findOne(
              LensVariantEntity,
              {
                where: { id: lensDetail.lensVariantId },
              },
            );

            if (!lensVariant) {
              throw new HttpException(
                `LensVariant with ID ${lensDetail.lensVariantId} not found`,
                HttpStatus.BAD_REQUEST,
              );
            }

            const previousStock = lensVariant.stock;
            const quantityToReduce = 1; // Each lens detail represents 1 lens pair per frame

            if (previousStock < quantityToReduce) {
              throw new HttpException(
                `Insufficient stock for LensVariant ${lensDetail.lensVariantId}. ` +
                  `Available: ${previousStock}, Required: ${quantityToReduce}`,
                HttpStatus.BAD_REQUEST,
              );
            }

            lensVariant.stock = previousStock - quantityToReduce;
            lensVariant.updatedBy = userId;

            await queryRunner.manager.save(LensVariantEntity, lensVariant);

            lensVariantUpdates.push({
              lensVariantId: lensDetail.lensVariantId,
              previousStock,
              newStock: lensVariant.stock,
              quantityReduced: quantityToReduce,
            });

            this.logger.log(
              `Reduced LensVariant ${lensDetail.lensVariantId} stock: ${previousStock} -> ${lensVariant.stock}`,
            );
          }
        }
      }

      await queryRunner.commitTransaction();

      const result: OrderStockUpdateResult = {
        success: true,
        message: `Successfully reduced stock for order ${orderId}`,
        details: {
          productColorUpdates,
          lensVariantUpdates,
        },
      };

      this.logger.log(
        `Completed stock reduction for order ${orderId}`,
        result.details,
      );
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to reduce stock for order ${orderId}`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Failed to reduce stock: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Kiểm tra stock availability cho toàn bộ order trước khi đặt hàng
   */
  async checkOrderStockAvailability(orderId: number): Promise<{
    available: boolean;
    issues: string[];
  }> {
    try {
      const orderItems = await this.orderItemRepository.find({
        where: { orderId },
        relations: ['lensDetails'],
      });

      const issues: string[] = [];

      for (const orderItem of orderItems) {
        // Check ProductColor stock
        if (orderItem.selectedColorId) {
          const productColor = await this.productColorRepository.findOne({
            where: { id: orderItem.selectedColorId },
          });

          if (!productColor) {
            issues.push(`ProductColor ${orderItem.selectedColorId} not found`);
          } else if (productColor.stock < orderItem.quantity) {
            issues.push(
              `Insufficient ProductColor ${orderItem.selectedColorId} stock. ` +
                `Available: ${productColor.stock}, Required: ${orderItem.quantity}`,
            );
          }
        }

        // Check LensVariant stock
        if (orderItem.lensDetails && orderItem.lensDetails.length > 0) {
          for (const lensDetail of orderItem.lensDetails) {
            const lensVariant = await this.lensVariantRepository.findOne({
              where: { id: lensDetail.lensVariantId },
            });

            if (!lensVariant) {
              issues.push(`LensVariant ${lensDetail.lensVariantId} not found`);
            } else if (lensVariant.stock < 1) {
              issues.push(
                `Insufficient LensVariant ${lensDetail.lensVariantId} stock. ` +
                  `Available: ${lensVariant.stock}, Required: 1`,
              );
            }
          }
        }
      }

      return {
        available: issues.length === 0,
        issues,
      };
    } catch (error) {
      this.logger.error(
        `Failed to check stock availability for order ${orderId}`,
        error,
      );
      return {
        available: false,
        issues: [
          `Error checking stock: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ],
      };
    }
  }

  /**
   * Hoàn trả stock khi hủy order
   */
  async restoreStockForOrder(
    orderId: number,
    userId: number,
  ): Promise<OrderStockUpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log(`Starting stock restoration for order ${orderId}`);

      const orderItems = await queryRunner.manager.find(OrderItemEntity, {
        where: { orderId },
        relations: ['lensDetails'],
      });

      if (!orderItems.length) {
        throw new HttpException(
          'No order items found for this order',
          HttpStatus.BAD_REQUEST,
        );
      }

      const productColorUpdates: Array<{
        productColorId: number;
        previousStock: number;
        newStock: number;
        quantityReduced: number;
      }> = [];

      const lensVariantUpdates: Array<{
        lensVariantId: number;
        previousStock: number;
        newStock: number;
        quantityReduced: number;
      }> = [];

      // Process each order item
      for (const orderItem of orderItems) {
        // 1. Restore ProductColor stock
        if (orderItem.selectedColorId) {
          const productColor = await queryRunner.manager.findOne(
            ProductColorEntity,
            {
              where: { id: orderItem.selectedColorId },
            },
          );

          if (productColor) {
            const previousStock = productColor.stock;
            const quantityToRestore = orderItem.quantity;

            productColor.stock = previousStock + quantityToRestore;
            productColor.updatedBy = userId;

            await queryRunner.manager.save(ProductColorEntity, productColor);

            productColorUpdates.push({
              productColorId: orderItem.selectedColorId,
              previousStock,
              newStock: productColor.stock,
              quantityReduced: -quantityToRestore, // Negative for restore
            });

            this.logger.log(
              `Restored ProductColor ${orderItem.selectedColorId} stock: ${previousStock} -> ${productColor.stock}`,
            );
          }
        }

        // 2. Restore LensVariant stock
        if (orderItem.lensDetails && orderItem.lensDetails.length > 0) {
          for (const lensDetail of orderItem.lensDetails) {
            const lensVariant = await queryRunner.manager.findOne(
              LensVariantEntity,
              {
                where: { id: lensDetail.lensVariantId },
              },
            );

            if (lensVariant) {
              const previousStock = lensVariant.stock;
              const quantityToRestore = 1;

              lensVariant.stock = previousStock + quantityToRestore;
              lensVariant.updatedBy = userId;

              await queryRunner.manager.save(LensVariantEntity, lensVariant);

              lensVariantUpdates.push({
                lensVariantId: lensDetail.lensVariantId,
                previousStock,
                newStock: lensVariant.stock,
                quantityReduced: -quantityToRestore, // Negative for restore
              });

              this.logger.log(
                `Restored LensVariant ${lensDetail.lensVariantId} stock: ${previousStock} -> ${lensVariant.stock}`,
              );
            }
          }
        }
      }

      await queryRunner.commitTransaction();

      const result: OrderStockUpdateResult = {
        success: true,
        message: `Successfully restored stock for order ${orderId}`,
        details: {
          productColorUpdates,
          lensVariantUpdates,
        },
      };

      this.logger.log(
        `Completed stock restoration for order ${orderId}`,
        result.details,
      );
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to restore stock for order ${orderId}`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Failed to restore stock: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
