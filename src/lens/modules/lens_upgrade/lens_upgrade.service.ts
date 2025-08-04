import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { LensUpgradeEntity } from './entities/lens_upgrade.entity';
import { LensUpgradeModel } from './models/lens_upgrade.model';
import {
  CreateLensUpgradeDto,
  UpdateLensUpgradeDto,
} from './dtos/lens_upgrade.dto';

@Injectable()
export class LensUpgradeService {
  constructor(
    @InjectRepository(LensUpgradeEntity)
    private readonly lensUpgradeRepository: Repository<LensUpgradeEntity>,
  ) {}

  async findAll(): Promise<LensUpgradeModel[]> {
    const lensUpgrades = await this.lensUpgradeRepository.find({
      where: { deletedAt: IsNull() },
      order: { upgradeName: 'ASC' },
    });

    return lensUpgrades.map((upgrade) => upgrade.toModel());
  }

  async findById(id: number): Promise<LensUpgradeModel> {
    const lensUpgrade = await this.lensUpgradeRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lensUpgrade) {
      throw new HttpException('Lens upgrade not found', HttpStatus.NOT_FOUND);
    }

    return lensUpgrade.toModel();
  }

  async findByName(upgradeName: string): Promise<LensUpgradeModel | null> {
    const lensUpgrade = await this.lensUpgradeRepository.findOne({
      where: { upgradeName, deletedAt: IsNull() },
    });

    return lensUpgrade ? lensUpgrade.toModel() : null;
  }

  async create(
    createLensUpgradeDto: CreateLensUpgradeDto,
    reqUserId: number,
  ): Promise<LensUpgradeModel> {
    // Check if upgrade name already exists
    const existingUpgrade = await this.findByName(
      createLensUpgradeDto.upgradeName,
    );
    if (existingUpgrade) {
      throw new HttpException(
        'Lens upgrade with this name already exists',
        HttpStatus.CONFLICT,
      );
    }

    const entity = new LensUpgradeEntity();
    entity.upgradeName = createLensUpgradeDto.upgradeName;
    entity.description = createLensUpgradeDto.description || null;
    entity.price = createLensUpgradeDto.price;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;
    entity.updatedAt = new Date();
    entity.updatedBy = reqUserId;

    const savedLensUpgrade = await this.lensUpgradeRepository.save(entity);
    return savedLensUpgrade.toModel();
  }

  async update(
    id: number,
    updateLensUpgradeDto: UpdateLensUpgradeDto,
    reqUserId: number,
  ): Promise<LensUpgradeModel> {
    const lensUpgrade = await this.lensUpgradeRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lensUpgrade) {
      throw new HttpException('Lens upgrade not found', HttpStatus.NOT_FOUND);
    }

    // Check if new upgrade name already exists (if name is being updated)
    if (
      updateLensUpgradeDto.upgradeName &&
      updateLensUpgradeDto.upgradeName !== lensUpgrade.upgradeName
    ) {
      const existingUpgrade = await this.findByName(
        updateLensUpgradeDto.upgradeName,
      );
      if (existingUpgrade) {
        throw new HttpException(
          'Lens upgrade with this name already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    await this.lensUpgradeRepository.update(
      { id, deletedAt: IsNull() },
      {
        ...updateLensUpgradeDto,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return this.findById(id);
  }

  async delete(id: number, reqUserId: number): Promise<boolean> {
    const lensUpgrade = await this.lensUpgradeRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lensUpgrade) {
      throw new HttpException('Lens upgrade not found', HttpStatus.NOT_FOUND);
    }

    await this.lensUpgradeRepository.update(
      { id },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async getUpgradesByIds(upgradeIds: number[]): Promise<LensUpgradeModel[]> {
    if (!upgradeIds || upgradeIds.length === 0) {
      return [];
    }

    const upgrades = await this.lensUpgradeRepository.find({
      where: {
        id: upgradeIds as any, // TypeORM In operator
        deletedAt: IsNull(),
      },
    });

    return upgrades.map((upgrade) => upgrade.toModel());
  }

  async calculateUpgradesPrice(upgradeIds: number[]): Promise<number> {
    const upgrades = await this.getUpgradesByIds(upgradeIds);
    return upgrades.reduce((total, upgrade) => total + upgrade.price, 0);
  }
}
