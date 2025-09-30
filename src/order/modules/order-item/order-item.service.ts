import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderItemModel } from './models/order-item.model';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import {
  CreateOrderItemDto,
  UpdateOrderItemDto,
  GetOrderItemsQueryDto,
} from './dtos/order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async createOrderItem(
    createOrderItemDto: CreateOrderItemDto,
    userId: number,
  ): Promise<OrderItemModel> {
    try {
      console.log(
        '[OrderItemService] Creating order item with DTO:',
        createOrderItemDto,
      );
      console.log('[OrderItemService] userId:', userId);

      const orderItemEntity = new OrderItemEntity();
      orderItemEntity.orderId = createOrderItemDto.orderId;
      orderItemEntity.productId = createOrderItemDto.productId;
      orderItemEntity.quantity = createOrderItemDto.quantity;
      orderItemEntity.framePrice = createOrderItemDto.framePrice;
      orderItemEntity.totalPrice = createOrderItemDto.totalPrice;
      orderItemEntity.discount = createOrderItemDto.discount || 0;
      orderItemEntity.selectedColorId = createOrderItemDto.selectedColorId;
      orderItemEntity.createdBy = userId;
      orderItemEntity.updatedBy = userId;

      console.log('[OrderItemService] Created entity:', orderItemEntity);

      const savedOrderItem =
        await this.orderItemRepository.save(orderItemEntity);

      console.log('[OrderItemService] Saved order item:', savedOrderItem);
      return savedOrderItem.toModel();
    } catch (error) {
      console.error('[OrderItemService] Error creating order item:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack =
        error instanceof Error ? error.stack : 'No stack trace available';
      console.error('[OrderItemService] Error message:', errorMessage);
      console.error('[OrderItemService] Error stack:', errorStack);
      throw new HttpException(
        `Failed to create order item: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderItems(
    params: GetOrderItemsQueryDto,
  ): Promise<PageList<OrderItemModel>> {
    try {
      const pagination = new PaginationParamsModel(params.page, params.limit);
      const queryBuilder = this.orderItemRepository
        .createQueryBuilder('orderItem')
        .leftJoinAndSelect('orderItem.lensDetails', 'lensDetails')
        .where('orderItem.deletedAt IS NULL');

      // Add filters
      if (params.orderId) {
        queryBuilder.andWhere('orderItem.orderId = :orderId', {
          orderId: params.orderId,
        });
      }

      if (params.productId) {
        queryBuilder.andWhere('orderItem.productId = :productId', {
          productId: params.productId,
        });
      }

      // Add pagination
      if (pagination) {
        const paginationQuery = pagination.toQuery();
        queryBuilder.skip(paginationQuery.skip).take(paginationQuery.take);
      }

      // Order by created date descending
      queryBuilder.orderBy('orderItem.createdAt', 'DESC');

      const [orderItems, total] = await queryBuilder.getManyAndCount();

      const orderItemModels = orderItems.map((orderItem) =>
        orderItem.toModel(),
      );

      return new PageList<OrderItemModel>(total, orderItemModels);
    } catch (error) {
      throw new HttpException(
        'Failed to get order items',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderItemById(id: number): Promise<OrderItemModel> {
    try {
      const orderItem = await this.orderItemRepository.findOne({
        where: { id, deletedAt: IsNull() },
        relations: ['lensDetails'],
      });

      if (!orderItem) {
        throw new HttpException('Order item not found', HttpStatus.NOT_FOUND);
      }

      return orderItem.toModel();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get order item',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItemModel[]> {
    try {
      const orderItems = await this.orderItemRepository.find({
        where: { orderId, deletedAt: IsNull() },
        relations: ['lensDetails'],
        order: { createdAt: 'DESC' },
      });

      return orderItems.map((orderItem) => orderItem.toModel());
    } catch (error) {
      throw new HttpException(
        'Failed to get order items for order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderItemsWithFullDetails(orderId: number): Promise<any[]> {
    try {
      // First get basic order items with lens details
      const orderItems = await this.orderItemRepository.find({
        where: { orderId, deletedAt: IsNull() },
        relations: ['lensDetails'],
        order: { createdAt: 'DESC' },
      });

      // Get detailed information for each order item
      const enrichedOrderItems = await Promise.all(
        orderItems.map(async (orderItem) => {
          // Get product information
          const productQuery = `
            SELECT 
              p.product_name as productName,
              p.price as productPrice,
              p.description as productDescription,
              b.name as brandName,
              pc.color_name as colorName,
              pc.product_variant_name as productVariantName,
              pc.product_number as productNumber
            FROM product p
            LEFT JOIN brand b ON b.id = p.brand_id
            LEFT JOIN product_color pc ON pc.id = ?
            WHERE p.id = ? AND p.deleted_at IS NULL
          `;

          const productResult = await this.orderItemRepository.query(
            productQuery,
            [orderItem.selectedColorId, orderItem.productId],
          );

          const productInfo = productResult[0] || {};

          // Get lens details with full information
          const lensDetailsWithInfo = await Promise.all(
            orderItem.lensDetails?.map(async (lensDetail) => {
              if (!lensDetail.lensVariantId) {
                return {
                  ...lensDetail.toModel(),
                  lensInfo: null,
                };
              }

              console.log(
                `[OrderItemService] Getting lens info for variant ID: ${lensDetail.lensVariantId}`,
              );

              // Get lens variant and related information
              const lensQuery = `
                SELECT 
                  lv.design,
                  lv.material,
                  lv.price as variantPrice,
                  l.name as lensName,
                  l.lens_type as lensType,
                  l.description as lensDescription,
                  bl.name as brandLensName,
                  lt.name as thicknessName,
                  lt.index_value as indexValue,
                  lt.price as thicknessPrice,
                  lt.description as thicknessDescription
                FROM lens_variant lv
                LEFT JOIN lens l ON l.id = lv.lens_id
                LEFT JOIN brand_lens bl ON bl.id = l.brand_lens_id
                LEFT JOIN lens_thickness lt ON lt.id = lv.lens_thickness_id
                WHERE lv.id = ? AND lv.deleted_at IS NULL
              `;

              const lensResult = await this.orderItemRepository.query(
                lensQuery,
                [lensDetail.lensVariantId],
              );

              console.log(
                `[OrderItemService] Lens query result for ID ${lensDetail.lensVariantId}:`,
                lensResult,
              );

              const lensInfo = lensResult[0] || {};

              // Get lens coatings if selected
              let coatings = [];
              if (lensDetail.selectedCoatingIds) {
                try {
                  const coatingIds = JSON.parse(lensDetail.selectedCoatingIds);
                  if (Array.isArray(coatingIds) && coatingIds.length > 0) {
                    const coatingQuery = `
                      SELECT name, price, description
                      FROM lens_coating 
                      WHERE id IN (${coatingIds.map(() => '?').join(',')})
                      AND deleted_at IS NULL
                    `;
                    coatings = await this.orderItemRepository.query(
                      coatingQuery,
                      coatingIds,
                    );
                  }
                } catch (e) {
                  console.error('Error parsing coating IDs:', e);
                }
              }

              // Get tint color if selected
              let tintColor = null;
              if (lensDetail.selectedTintColorId) {
                const tintQuery = `
                  SELECT name, color_code as colorCode
                  FROM lens_tint_color 
                  WHERE id = ? AND deleted_at IS NULL
                `;
                const tintResult = await this.orderItemRepository.query(
                  tintQuery,
                  [lensDetail.selectedTintColorId],
                );
                tintColor = tintResult[0] || null;
              }

              return {
                ...lensDetail.toModel(),
                lensInfo: {
                  lensName: lensInfo.lensName,
                  lensType: lensInfo.lensType,
                  lensDescription: lensInfo.lensDescription,
                  brandLens: lensInfo.brandLensName,
                  lensVariant: {
                    design: lensInfo.design,
                    material: lensInfo.material,
                    price: lensInfo.variantPrice,
                  },
                  lensThickness: lensInfo.thicknessName
                    ? {
                        name: lensInfo.thicknessName,
                        indexValue: lensInfo.indexValue,
                        price: lensInfo.thicknessPrice,
                        description: lensInfo.thicknessDescription,
                      }
                    : null,
                  lensCoatings: coatings,
                  tintColor: tintColor,
                },
              };
            }) || [],
          );

          return {
            ...orderItem.toModel(),
            productInfo: {
              productName: productInfo.productName,
              productPrice: productInfo.productPrice,
              productDescription: productInfo.productDescription,
              brandName: productInfo.brandName,
              colorInfo: {
                colorName: productInfo.colorName,
                productVariantName: productInfo.productVariantName,
                productNumber: productInfo.productNumber,
              },
            },
            lensDetails: lensDetailsWithInfo,
          };
        }),
      );

      return enrichedOrderItems;
    } catch (error) {
      console.error('Error getting order items with full details:', error);
      throw new HttpException(
        'Failed to get order items with full details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrderItem(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
    userId: number,
  ): Promise<OrderItemModel> {
    try {
      // Check if order item exists
      const existingOrderItem = await this.orderItemRepository.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!existingOrderItem) {
        throw new HttpException('Order item not found', HttpStatus.NOT_FOUND);
      }

      // Update order item
      await this.orderItemRepository.update(
        { id, deletedAt: IsNull() },
        {
          ...updateOrderItemDto,
          updatedBy: userId,
        },
      );

      return await this.getOrderItemById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update order item',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteOrderItem(id: number, userId: number): Promise<boolean> {
    try {
      const existingOrderItem = await this.orderItemRepository.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!existingOrderItem) {
        throw new HttpException('Order item not found', HttpStatus.NOT_FOUND);
      }

      // Soft delete order item
      await this.orderItemRepository.update(
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
        'Failed to delete order item',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async calculateOrderItemTotal(
    framePrice: number,
    quantity: number,
    discount: number = 0,
  ): Promise<number> {
    const subtotal = framePrice * quantity;
    return subtotal - discount;
  }
}
