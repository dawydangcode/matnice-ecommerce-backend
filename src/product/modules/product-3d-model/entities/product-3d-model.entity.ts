import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ProductEntity } from '../../../entities/product.entity';
import { Model3dConfigEntity } from '../../model-3d-config/entities/model-3d-config.entity';
import { Product3dModel } from '../models/product-3d-model.model';
import { ModelType } from '../enum/model.type';

@Entity('product_3d_model')
export class Product3dModelEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ name: 'product_id', type: 'bigint' })
  productId!: number;

  @Column({ name: 'model_name', type: 'varchar', length: 255 })
  modelName!: string;

  @Column({ name: 'model_file_path', type: 'varchar', length: 255 })
  modelFilePath!: string;

  @Column({ name: 'model_type', type: 'varchar', length: 255 })
  modelType!: ModelType;

  @Column({
    name: 'mtl_file_path',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  mtlFilePath!: string;

  @Column({
    name: 'texture_base_path',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  textureBasePath!: string;

  @Column({ name: 'config_json', type: 'text', nullable: true })
  configJson!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by', type: 'bigint', nullable: true })
  createdBy!: number;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by', type: 'bigint', nullable: true })
  deletedBy!: number;

  // Relations
  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @OneToOne(() => Model3dConfigEntity, (config) => config.model)
  config!: Model3dConfigEntity;

  toModel(): Product3dModel {
    return new Product3dModel(
      this.id,
      this.productId,
      this.modelName,
      this.modelFilePath,
      this.modelType,
      this.mtlFilePath,
      this.textureBasePath,
      this.configJson,
      this.isActive,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
