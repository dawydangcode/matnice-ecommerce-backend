import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { LensUpgradeModel } from '../models/lens_upgrade.model';

@Entity('lens_upgrade')
export class LensUpgradeEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: number;

  @Column({ name: 'upgrade_name', type: 'varchar', length: 255 })
  upgradeName!: string;

  @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
  description!: string | undefined;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by', type: 'bigint' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ name: 'updated_by', type: 'bigint' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date | undefined;

  @Column({ name: 'deleted_by', type: 'bigint', nullable: true })
  deletedBy!: number | undefined;

  toModel(): LensUpgradeModel {
    return new LensUpgradeModel(
      this.id,
      this.upgradeName,
      this.description,
      this.price,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
