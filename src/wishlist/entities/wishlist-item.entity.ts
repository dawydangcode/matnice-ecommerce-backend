import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { WishlistItemType } from '../enum/wishlist-item-type.enum';
import { WishlistItemModel } from '../models/wishlist-item.model';

@Entity('wishlist_item')
@Index(['userId', 'itemType'])
@Index(['userId', 'productId', 'selectedColorId', 'deletedAt'], {
  unique: true,
})
@Index(['userId', 'lensId', 'deletedAt'], { unique: true })
export class WishlistItemEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: number;

  @Column({
    name: 'item_type',
    type: 'enum',
    enum: WishlistItemType,
  })
  itemType!: WishlistItemType;

  @Column({ name: 'product_id', type: 'bigint', nullable: true })
  productId!: number | null;

  @Column({ name: 'lens_id', type: 'bigint', nullable: true })
  lensId!: number | null;

  @Column({ name: 'selected_color_id', type: 'bigint', nullable: true })
  selectedColorId!: number | null;

  @Column({ name: 'added_at', type: 'timestamp' })
  addedAt!: Date;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by', type: 'bigint' })
  createdBy!: number;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt!: Date | null;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedBy!: number | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date | null;

  @Column({ name: 'deleted_by', type: 'bigint', nullable: true })
  deletedBy!: number | null;

  toModel(): WishlistItemModel {
    return new WishlistItemModel(
      this.id,
      this.userId,
      this.itemType,
      this.productId,
      this.lensId,
      this.selectedColorId,
      this.addedAt,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
