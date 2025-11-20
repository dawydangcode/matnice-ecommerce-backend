import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductBestsellerEntity } from '../entities/product-bestseller.entity';
import { ProductEntity } from '../entities/product.entity';

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
  ) {}

  /**
   * Get Bestsellers - Hybrid approach
   * Combines manual admin curation with automatic sales-based ranking
   */
  async getBestsellers(
    limit: number = 8,
    pinnedOnly: boolean = false,
  ): Promise<BestsellerProduct[]> {
    const queryBuilder = this.bestsellerRepository
      .createQueryBuilder('bestseller')
      .leftJoinAndSelect('bestseller.product', 'product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.productColors', 'productColors')
      .leftJoinAndSelect('productColors.productImage', 'productImage')
      .where('bestseller.is_active = :isActive', { isActive: true })
      .andWhere('product.deleted_at IS NULL');

    if (pinnedOnly) {
      queryBuilder.andWhere('bestseller.is_pinned = :isPinned', {
        isPinned: true,
      });
    }

    // Hybrid sorting logic:
    // 1. Pinned products first (by custom_priority or display_order)
    // 2. Then by sales performance
    // Note: MySQL doesn't support NULLS LAST, so we use COALESCE or IS NULL workaround
    queryBuilder
      .orderBy('bestseller.is_pinned', 'DESC')
      .addOrderBy('COALESCE(bestseller.custom_priority, 999999)', 'ASC')
      .addOrderBy('COALESCE(bestseller.display_order, 999999)', 'ASC')
      .addOrderBy('bestseller.sales_last_30_days', 'DESC')
      .addOrderBy('bestseller.total_sales', 'DESC')
      .limit(limit);

    const bestsellers = await queryBuilder.getMany();

    // Transform to frontend-friendly format
    return bestsellers.map((bestseller) => {
      const product = bestseller.product;
      const firstColor = product.productColors?.[0];
      const firstImage = firstColor?.productImage?.[0];

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
  async syncSalesData(days: number = 30): Promise<void> {
    // This is a placeholder - you'll need to implement based on your Order entity structure
    // Query order items, group by product, calculate totals

    // Example pseudo-code:
    // const salesData = await this.orderItemRepository
    //   .createQueryBuilder('orderItem')
    //   .select('orderItem.product_id', 'productId')
    //   .addSelect('SUM(orderItem.quantity)', 'totalSales')
    //   .addSelect('SUM(orderItem.price * orderItem.quantity)', 'revenue')
    //   .groupBy('orderItem.product_id')
    //   .getRawMany();

    // Update or create bestseller entries based on sales data

    console.log(`Syncing sales data for last ${days} days...`);
    // TODO: Implement actual sales data sync from Order entities
  }

  /**
   * Get all bestsellers (admin view)
   */
  async getAllBestsellers(): Promise<ProductBestsellerEntity[]> {
    return await this.bestsellerRepository.find({
      relations: ['product', 'product.brand'],
      order: {
        isPinned: 'DESC',
        customPriority: 'ASC',
        salesLast30Days: 'DESC',
      },
    });
  }
}
