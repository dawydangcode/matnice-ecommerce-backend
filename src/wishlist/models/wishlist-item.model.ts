import { WishlistItemType } from '../enum/wishlist-item-type.enum';

export class WishlistItemModel {
  public readonly id: number;
  public readonly userId: number;
  public readonly itemType: WishlistItemType;
  public readonly productId: number | null;
  public readonly lensId: number | null;
  public readonly selectedColorId: number | null;
  public readonly addedAt: Date;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date | null;
  public readonly updatedBy: number | null;
  public readonly deletedAt: Date | null;
  public readonly deletedBy: number | null;

  // Populated fields (joined data)
  public productName?: string;
  public productPrice?: number;
  public colorName?: string;
  public lensName?: string;
  public brandName?: string;
  public lensBrandName?: string;
  public thumbnailUrl?: string;
  public displayName?: string;

  constructor(
    id: number,
    userId: number,
    itemType: WishlistItemType,
    productId: number | null,
    lensId: number | null,
    selectedColorId: number | null,
    addedAt: Date,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date | null,
    updatedBy: number | null,
    deletedAt: Date | null,
    deletedBy: number | null,
  ) {
    this.id = id;
    this.userId = userId;
    this.itemType = itemType;
    this.productId = productId;
    this.lensId = lensId;
    this.selectedColorId = selectedColorId;
    this.addedAt = addedAt;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
