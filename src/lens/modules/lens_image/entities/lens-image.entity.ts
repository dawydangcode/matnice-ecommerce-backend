import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { LensEntity } from '../../../entities/lens.entity';
import { LensImageModel } from '../models/lens-image.model';

@Entity('lens_image')
export class LensImageEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'lens_id' })
  lensId!: number;

  @Column({ name: 'image_url' })
  imageUrl!: string;

  @Column({ name: 'image_order', type: 'varchar', length: 1, nullable: true })
  imageOrder?: string; // 'a', 'b', 'c', 'd', 'e' - 'a' là ảnh chính

  @Column({ name: 'is_thumbnail', type: 'boolean', default: false })
  isThumbnail?: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @Column({ name: 'deleted_by', nullable: true })
  deletedBy?: number;

  @ManyToOne(() => LensEntity)
  @JoinColumn({ name: 'lens_id' })
  lens!: LensEntity;

  toModel(): LensImageModel {
    return new LensImageModel(
      this.id,
      this.lensId,
      this.imageUrl,
      this.imageOrder,
      this.isThumbnail,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
