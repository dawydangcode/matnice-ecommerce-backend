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

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({
    name: 'item_type',
    type: 'enum',
    enum: WishlistItemType,
  })
  itemType!: WishlistItemType;

  @Column({ name: 'product_id', nullable: true })
  productId!: number | null;

  @Column({ name: 'lens_id', nullable: true })
  lensId!: number | null;

  @Column({ name: 'selected_color_id', nullable: true })
  selectedColorId!: number | null;

  @Column({ name: 'added_at', default: () => 'CURRENT_TIMESTAMP' })
  addedAt!: Date;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt!: Date | null;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy!: number | null;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  @Column({ name: 'deleted_by', nullable: true })
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
