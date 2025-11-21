import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ProductBestsellerEntity } from '../entities/product-bestseller.entity';
import { ProductEntity } from '../entities/product.entity';
import { OrderItemEntity } from '../../order/modules/order-item/entities/order-item.entity';
import { OrderEntity } from '../../order/entities/order.entity';
import { OrderStatus } from '../../order/enums/order.enum';

export interface BestsellerProduct {
  id: number;
  productName: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  brand: {
    id: number;
    name: string;
  };
  image: string;
  isBoutique: boolean;
  isNew: boolean;
  totalSales: number;
  isPinned: boolean;
  productCode?: string;
}

@Injectable()
export class BestsellerService {
  constructor(
    @InjectRepository(ProductBestsellerEntity)
    private readonly bestsellerRepository: Repository<ProductBestsellerEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  /**
   * Get Bestsellers - Hybrid approach
   * Combines manual admin curation with automatic sales-based ranking
   */
  async getBestsellers(
    limit: number = 8,
    pinnedOnly: boolean = false,
  ): Promise<BestsellerProduct[]> {
    // Step 1: Get bestseller IDs first (without JOIN to avoid LIMIT issues)
    const bestsellerIdsQuery = this.bestsellerRepository
      .createQueryBuilder('bestseller')
      .select('bestseller.id')
      .innerJoin('bestseller.product', 'product')
      .where('bestseller.is_active = :isActive', { isActive: true })
      .andWhere('product.deleted_at IS NULL');

    if (pinnedOnly) {
      bestsellerIdsQuery.andWhere('bestseller.is_pinned = :isPinned', {
        isPinned: true,
      });
    }

    bestsellerIdsQuery
      .orderBy('bestseller.is_pinned', 'DESC')
      .addOrderBy('bestseller.total_sales', 'DESC')
      .addOrderBy('bestseller.sales_last_30_days', 'DESC')
      .addOrderBy('bestseller.created_at', 'DESC')
      .limit(limit);

    const bestsellerIds = await bestsellerIdsQuery.getRawMany();
    const ids = bestsellerIds.map((b) => b.bestseller_id);

    if (ids.length === 0) {
      return [];
    }

    // Step 2: Get full data with relations for the selected IDs
    const bestsellers = await this.bestsellerRepository
      .createQueryBuilder('bestseller')
      .leftJoinAndSelect('bestseller.product', 'product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.productColors', 'productColors')
      .leftJoinAndSelect('productColors.productImage', 'productImage')
      .where('bestseller.id IN (:...ids)', { ids })
      .orderBy('bestseller.is_pinned', 'DESC')
      .addOrderBy('bestseller.total_sales', 'DESC')
      .addOrderBy('bestseller.sales_last_30_days', 'DESC')
      .addOrderBy('bestseller.created_at', 'DESC')
      .getMany();

    console.log(
      `[BestsellerService] Found ${bestsellers.length} bestseller records from database`,
    );

    // Transform to frontend-friendly format
    return bestsellers.map((bestseller) => {
      const product = bestseller.product;
      const firstColor = product.productColors?.[0];
      const firstImage = firstColor?.productImage?.[0];

      console.log(
        `[BestsellerService] Processing product ${product.id}: ${product.productName}, has ${product.productColors?.length || 0} colors, first image: ${firstImage?.imageUrl ? 'YES' : 'NO'}`,
      );

      // For now, no discount logic (can be added later)
      let discountPrice: number | undefined;
      let discountPercentage: number | undefined;

      // TODO: Add discount logic when discount fields are available
      // if (firstColor?.discountPrice && firstColor.discountPrice < product.price) {
      //   discountPrice = firstColor.discountPrice;
      //   discountPercentage = Math.round(
      //     ((product.price - firstColor.discountPrice) / product.price) * 100,
      //   );
      // }

      return {
        id: product.id,
        productName: product.productName,
        price: product.price,
        discountPrice,
        discountPercentage,
        brand: {
          id: product.brand?.id || 0,
          name: product.brand?.name || 'Unknown',
        },
        image: firstImage?.imageUrl || '/api/placeholder/250/200',
        isBoutique: product.isBoutique,
        isNew: product.isNew,
        totalSales: bestseller.totalSales,
        isPinned: bestseller.isPinned,
        productCode: firstColor?.productNumber,
      };
    });
  }

  /**
   * Admin: Create a manual bestseller entry
   */
  async createBestseller(
    productId: number,
    isPinned: boolean,
    customPriority: number | undefined,
    displayOrder: number | undefined,
    notes: string | undefined,
    userId: number,
  ): Promise<ProductBestsellerEntity> {
    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if already exists
    const existing = await this.bestsellerRepository.findOne({
      where: { productId },
    });

    if (existing) {
      throw new BadRequestException(
        `Product ${productId} is already in bestsellers`,
      );
    }

    // Create new bestseller entry
    const bestseller = this.bestsellerRepository.create({
      productId,
      isPinned,
      customPriority,
      displayOrder,
      notes,
      totalSales: 0, // Will be synced by cron job
      salesLast30Days: 0,
      revenueGenerated: 0,
      isActive: true,
      createdBy: userId,
      updatedBy: userId,
    });

    return await this.bestsellerRepository.save(bestseller);
  }

  /**
   * Admin: Update bestseller settings
   */
  async updateBestseller(
    id: number,
    updates: {
      isPinned?: boolean;
      customPriority?: number;
      displayOrder?: number;
      isActive?: boolean;
      notes?: string;
    },
    userId: number,
  ): Promise<ProductBestsellerEntity> {
    const bestseller = await this.bestsellerRepository.findOne({
      where: { id },
    });

    if (!bestseller) {
      throw new NotFoundException(`Bestseller with ID ${id} not found`);
    }

    // Update fields
    if (updates.isPinned !== undefined) bestseller.isPinned = updates.isPinned;
    if (updates.customPriority !== undefined)
      bestseller.customPriority = updates.customPriority;
    if (updates.displayOrder !== undefined)
      bestseller.displayOrder = updates.displayOrder;
    if (updates.isActive !== undefined) bestseller.isActive = updates.isActive;
    if (updates.notes !== undefined) bestseller.notes = updates.notes;

    bestseller.updatedBy = userId;

    return await this.bestsellerRepository.save(bestseller);
  }

  /**
   * Admin: Delete bestseller entry
   */
  async deleteBestseller(id: number): Promise<void> {
    const bestseller = await this.bestsellerRepository.findOne({
      where: { id },
    });

    if (!bestseller) {
      throw new NotFoundException(`Bestseller with ID ${id} not found`);
    }

    await this.bestsellerRepository.remove(bestseller);
  }

  /**
   * Cron Job: Sync sales data from orders
   * This should be called periodically (e.g., daily) to update sales stats
   */
  /**
   * Sync sales data from Order table
   * Calculates total sales and revenue for bestseller products
   */
  async syncSalesData(days: number = 30): Promise<void> {
    console.log(
      `[BestsellerService] Syncing sales data for last ${days} days...`,
    );

    // Calculate date threshold
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      // Get all bestseller products
      const bestsellers = await this.bestsellerRepository.find({
        select: ['id', 'productId'],
      });

      console.log(
        `[BestsellerService] Found ${bestsellers.length} bestseller products to sync`,
      );

      // Sync each bestseller's sales data
      for (const bestseller of bestsellers) {
        await this.syncProductSalesData(
          bestseller.id,
          bestseller.productId,
          startDate,
        );
      }

      console.log(`[BestsellerService] Sales data sync completed successfully`);
    } catch (error) {
      console.error('[BestsellerService] Error syncing sales data:', error);
      throw error;
    }
  }

  /**
   * Sync sales data for a specific product
   */
  private async syncProductSalesData(
    bestsellerId: number,
    productId: number,
    startDate: Date,
  ): Promise<void> {
    // Query total sales (all time) for completed orders only
    const totalSalesResult = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.order', 'order')
      .select('COALESCE(SUM(orderItem.quantity), 0)', 'totalQuantity')
      .addSelect('COALESCE(SUM(orderItem.total_price), 0)', 'totalRevenue')
      .where('orderItem.product_id = :productId', { productId })
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERED })
      .andWhere('order.deleted_at IS NULL')
      .andWhere('orderItem.deleted_at IS NULL')
      .getRawOne();

    // Query sales for last N days
    const recentSalesResult = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.order', 'order')
      .select('COALESCE(SUM(orderItem.quantity), 0)', 'totalQuantity')
      .where('orderItem.product_id = :productId', { productId })
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERED })
      .andWhere('order.order_date >= :startDate', { startDate })
      .andWhere('order.deleted_at IS NULL')
      .andWhere('orderItem.deleted_at IS NULL')
      .getRawOne();

    const totalSales = parseInt(totalSalesResult?.totalQuantity || '0');
    const salesLastNDays = parseInt(recentSalesResult?.totalQuantity || '0');
    const revenueGenerated = parseFloat(totalSalesResult?.totalRevenue || '0');

    console.log(
      `[BestsellerService] Product ${productId}: Total Sales=${totalSales}, Sales Last ${Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))}d=${salesLastNDays}, Revenue=${revenueGenerated}`,
    );

    // Update bestseller record
    await this.bestsellerRepository.update(bestsellerId, {
      totalSales,
      salesLast30Days: salesLastNDays,
      revenueGenerated,
      updatedAt: new Date(),
    });
  }

  /**
   * Get all bestsellers (admin view)
   */
  async getAllBestsellers(): Promise<ProductBestsellerEntity[]> {
    return await this.bestsellerRepository.find({
      relations: ['product', 'product.brand'],
      order: {
        isPinned: 'DESC',
        totalSales: 'DESC',
        salesLast30Days: 'DESC',
        createdAt: 'DESC',
      },
    });
  }
}
