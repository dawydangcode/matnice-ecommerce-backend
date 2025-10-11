import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistItemEntity } from './entities/wishlist-item.entity';
import { IsNull, Repository } from 'typeorm';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { WishlistItemModel } from './models/wishlist-item.model';
import { PageList } from 'src/common/models/page-list.model';
import { WishlistItemType } from './enum/wishlist-item-type.enum';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItemEntity)
    private readonly wishlistRepository: Repository<WishlistItemEntity>,
  ) {}

  async getWishlist(
    userId: number,
    itemType: WishlistItemType | undefined,
    pagination: PaginationParamsModel | undefined,
  ): Promise<PageList<WishlistItemModel>> {
    const queryBuilder = this.wishlistRepository
      .createQueryBuilder('wi')
      .leftJoinAndSelect(
        'product',
        'p',
        'wi.product_id = p.id AND p.deleted_at IS NULL',
      )
      .leftJoinAndSelect(
        'product_color',
        'pc',
        'wi.selected_color_id = pc.id AND pc.deleted_at IS NULL',
      )
      .leftJoinAndSelect(
        'brand',
        'b',
        'p.brand_id = b.id AND b.deleted_at IS NULL',
      )
      .leftJoinAndSelect(
        'lens',
        'l',
        'wi.lens_id = l.id AND l.deleted_at IS NULL',
      )
      .leftJoinAndSelect(
        'brand_lens',
        'bl',
        'l.brand_lens_id = bl.id AND bl.deleted_at IS NULL',
      )
      .where('wi.user_id = :userId', { userId })
      .andWhere('wi.deleted_at IS NULL');

    if (itemType) {
      queryBuilder.andWhere('wi.item_type = :itemType', { itemType });
    }

    queryBuilder.orderBy('wi.added_at', 'DESC');

    if (pagination) {
      const query = pagination.toQuery();
      queryBuilder.skip(query.skip).take(query.take);
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    const models = items.map((item: WishlistItemEntity) => {
      const model = item.toModel();

      // Populate additional data from joins
      const rawItem = item as any;
      if (rawItem.p_product_name) {
        model.productName = rawItem.p_product_name;
        model.productPrice = rawItem.p_price;
      }
      if (rawItem.pc_color_name) {
        model.colorName = rawItem.pc_color_name;
      }
      if (rawItem.b_name) {
        model.brandName = rawItem.b_name;
      }
      if (rawItem.l_name) {
        model.lensName = rawItem.l_name;
      }
      if (rawItem.bl_name) {
        model.lensBrandName = rawItem.bl_name;
      }

      return model;
    });

    return new PageList<WishlistItemModel>(total, models);
  }

  async addToWishlist(
    userId: number,
    itemType: WishlistItemType,
    productId: number | undefined,
    lensId: number | undefined,
    selectedColorId: number | undefined,
    reqUserId: number,
  ): Promise<WishlistItemModel> {
    // Validate input
    if (itemType === WishlistItemType.Product && !productId) {
      throw new BadRequestException('Product ID is required for product items');
    }
    if (itemType === WishlistItemType.Lens && !lensId) {
      throw new BadRequestException('Lens ID is required for lens items');
    }
    if (itemType === WishlistItemType.Product && lensId) {
      throw new BadRequestException(
        'Lens ID should not be provided for product items',
      );
    }
    if (itemType === WishlistItemType.Lens && productId) {
      throw new BadRequestException(
        'Product ID should not be provided for lens items',
      );
    }

    // Check if item already exists in wishlist
    const whereCondition: any = {
      userId,
      itemType,
      deletedAt: IsNull(),
    };

    if (productId) whereCondition.productId = productId;
    if (lensId) whereCondition.lensId = lensId;
    if (selectedColorId) whereCondition.selectedColorId = selectedColorId;

    const existingItem = await this.wishlistRepository.findOne({
      where: whereCondition,
    });

    if (existingItem) {
      throw new ConflictException('Item already exists in wishlist');
    }

    // Create new wishlist item
    const entity = new WishlistItemEntity();
    entity.userId = userId;
    entity.itemType = itemType;
    entity.productId = productId || null;
    entity.lensId = lensId || null;
    entity.selectedColorId = selectedColorId || null;
    entity.addedAt = new Date();
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedEntity = await this.wishlistRepository.save(entity);
    return savedEntity.toModel();
  }

  async removeFromWishlist(
    userId: number,
    wishlistItemId: number,
    reqUserId: number,
  ): Promise<boolean> {
    const item = await this.wishlistRepository.findOne({
      where: {
        id: wishlistItemId,
        userId,
        deletedAt: IsNull(),
      },
    });

    if (!item) {
      throw new BadRequestException('Wishlist item not found');
    }

    await this.wishlistRepository.update(
      { id: wishlistItemId, userId, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async checkItemInWishlist(
    userId: number,
    itemType: WishlistItemType,
    itemId: number,
    selectedColorId?: number,
  ): Promise<boolean> {
    const whereCondition: any = {
      userId,
      itemType,
      deletedAt: IsNull(),
    };

    if (itemType === WishlistItemType.Product) {
      whereCondition.productId = itemId;
      if (selectedColorId) {
        whereCondition.selectedColorId = selectedColorId;
      }
    } else if (itemType === WishlistItemType.Lens) {
      whereCondition.lensId = itemId;
    }

    const count = await this.wishlistRepository.count({
      where: whereCondition,
    });

    return count > 0;
  }

  async getWishlistCount(userId: number): Promise<number> {
    return await this.wishlistRepository.count({
      where: {
        userId,
        deletedAt: IsNull(),
      },
    });
  }
}
