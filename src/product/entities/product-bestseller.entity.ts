import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

/**
 * ProductBestsellerEntity - Hybrid bestseller management
 * Combines manual admin curation with automatic sales-based ranking
 */
@Entity('product_bestseller')
export class ProductBestsellerEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'product_id' })
  productId!: number;

  // Manual admin settings
  @Column({ name: 'is_pinned', default: false })
  isPinned!: boolean; // Admin manually pins this as bestseller

  @Column({ name: 'custom_priority', nullable: true })
  customPriority!: number; // Manual priority (1 = highest)

  @Column({ name: 'display_order', nullable: true })
  displayOrder!: number; // Manual display order

  // Automatic sales-based data
  @Column({ name: 'total_sales', default: 0 })
  totalSales!: number; // Auto-calculated from orders

  @Column({ name: 'sales_last_30_days', default: 0 })
  salesLast30Days!: number; // Recent sales trend

  @Column({
    name: 'revenue_generated',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  revenueGenerated!: number; // Total revenue from this product

  // Metadata
  @Column({ name: 'is_active', default: true })
  isActive!: boolean; // Can be toggled on/off

  @Column({ name: 'notes', nullable: true })
  notes!: string; // Admin notes

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  // Relations
  @ManyToOne(() => ProductEntity, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;
}
