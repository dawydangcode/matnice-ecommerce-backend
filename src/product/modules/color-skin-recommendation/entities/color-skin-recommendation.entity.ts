import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SkinColorType } from '../enum/skin-color.type';
import { ColorSkinRecommendationModel } from '../models/color-skin-recommendation.model';
import { ProductColorEntity } from '../../product-color/entities/product-color.entity';

@Entity('color_skin_recommendation')
export class ColorSkinRecommendationEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'product_color_id' })
  productColorId!: number;

  @Column({ name: 'skin_color_type' })
  skinColorType!: SkinColorType;

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

  // Relations
  @ManyToOne(() => ProductColorEntity, { eager: false })
  @JoinColumn({ name: 'product_color_id' })
  productColor?: ProductColorEntity;

  toModel(): ColorSkinRecommendationModel {
    const model = new ColorSkinRecommendationModel(
      this.id,
      this.productColorId,
      this.skinColorType,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );

    // Add relations if they exist
    if (this.productColor) {
      (model as any).productColor = this.productColor.toModel();
    }

    return model;
  }
}
