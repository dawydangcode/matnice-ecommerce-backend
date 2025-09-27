import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartModel } from '../models/cart.model';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  toModel(): CartModel {
    console.log(
      '[CartEntity] toModel called - Entity ID:',
      this.id,
      'Type:',
      typeof this.id,
    );

    if (
      !this.id ||
      this.id === null ||
      this.id === undefined ||
      isNaN(this.id)
    ) {
      console.error('[CartEntity] Invalid entity ID in toModel:', this.id);
      throw new Error(
        `[CartEntity] Invalid entity ID: ${this.id} (type: ${typeof this.id})`,
      );
    }

    return new CartModel(
      this.id,
      this.userId,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
