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
      .leftJoin('product', 'p', 'wi.product_id = p.id AND p.deleted_at IS NULL')
      .leftJoin(
        'product_color',
        'pc',
        'wi.selected_color_id = pc.id AND pc.deleted_at IS NULL',
      )
      .leftJoin('brand', 'b', 'p.brand_id = b.id AND b.deleted_at IS NULL')
      .leftJoin('lens', 'l', 'wi.lens_id = l.id AND l.deleted_at IS NULL')
      .leftJoin(
        'brand_lens',
        'bl',
        'l.brand_lens_id = bl.id AND bl.deleted_at IS NULL',
      )
      // Join product_color for thumbnail when no color selected
      .leftJoin(
        'product_color',
        'pc_thumb',
        'wi.selected_color_id IS NULL AND p.id = pc_thumb.product_id AND pc_thumb.is_thumbnail = 1 AND pc_thumb.deleted_at IS NULL',
      )
      // Join product_image for the selected color
      .leftJoin(
        'product_image',
        'pi_color',
        "wi.selected_color_id = pi_color.product_color_id AND pi_color.deleted_at IS NULL AND pi_color.image_order = 'a'",
      )
      // Join product_image for thumbnail color (when no color selected)
      .leftJoin(
        'product_image',
        'pi_thumb',
        "pc_thumb.id = pi_thumb.product_color_id AND pi_thumb.deleted_at IS NULL AND pi_thumb.image_order = 'a'",
      )
      .addSelect('p.product_name', 'p_product_name')
      .addSelect('p.price', 'p_price')
      .addSelect('pc.product_variant_name', 'pc_product_variant_name')
      .addSelect('pc.color_name', 'pc_color_name')
      .addSelect('pi_color.image_url', 'pi_color_image_url')
      .addSelect('pi_thumb.image_url', 'pi_thumb_image_url')
      .addSelect('b.name', 'b_name')
      .addSelect('l.name', 'l_name')
      .addSelect('bl.name', 'bl_name')
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

    // Use getRawAndEntities to get both entity data and raw joined data
    const { entities, raw } = await queryBuilder.getRawAndEntities();
    const total = await queryBuilder.getCount();

    console.log('[WishlistService] ==== DEBUG START ====');
    console.log('[WishlistService] Total items:', total);
    console.log(
      '[WishlistService] Raw data sample (first item):',
      JSON.stringify(raw[0], null, 2),
    );
    console.log('[WishlistService] Entity data sample:', entities[0]);
    console.log('[WishlistService] ==== DEBUG END ====');

    const models = entities.map((item: WishlistItemEntity, index: number) => {
      const model = item.toModel();
      const rawItem = raw[index];

      // Populate additional data from joins using raw data
      if (rawItem.p_product_name) {
        model.productName = rawItem.p_product_name;
        model.productPrice = rawItem.p_price;
      }
      // Use product_variant_name as displayName (full name with color variant)
      if (rawItem.pc_product_variant_name) {
        model.displayName = rawItem.pc_product_variant_name;
      } else if (rawItem.p_product_name) {
        // Fallback to product_name if no variant name
        model.displayName = rawItem.p_product_name;
      }
      if (rawItem.pc_color_name) {
        model.colorName = rawItem.pc_color_name;
      }
      // Priority: selected color image > thumbnail image
      if (rawItem.pi_color_image_url) {
        model.thumbnailUrl = rawItem.pi_color_image_url;
      } else if (rawItem.pi_thumb_image_url) {
        model.thumbnailUrl = rawItem.pi_thumb_image_url;
      }

      // Debug image URLs
      console.log('[WishlistService] Image debug:', {
        itemId: model.id,
        selectedColorId: rawItem.wi_selected_color_id,
        pi_color_image_url: rawItem.pi_color_image_url,
        pi_thumb_image_url: rawItem.pi_thumb_image_url,
        finalThumbnailUrl: model.thumbnailUrl,
      });

      if (rawItem.b_name) {
        model.brandName = rawItem.b_name;
      }
      if (rawItem.l_name) {
        model.lensName = rawItem.l_name;
      }
      if (rawItem.bl_name) {
        model.lensBrandName = rawItem.bl_name;
      }

      console.log('[WishlistService] Populated model:', {
        id: model.id,
        displayName: model.displayName,
        productName: model.productName,
        brandName: model.brandName,
        thumbnailUrl: model.thumbnailUrl,
        colorName: model.colorName,
        productPrice: model.productPrice,
      });

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
