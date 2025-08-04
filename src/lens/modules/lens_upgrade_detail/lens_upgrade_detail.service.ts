import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { LensUpgradeDetailEntity } from './entities/lens_upgrade_detail.entity';
import { LensUpgradeDetailModel } from './models/lens_upgrade_detail.model';

@Injectable()
export class LensUpgradeDetailService {
  constructor(
    @InjectRepository(LensUpgradeDetailEntity)
    private readonly lensUpgradeDetailRepository: Repository<LensUpgradeDetailEntity>,
  ) {}

  async getLensUpgradeDetailById(id: number): Promise<LensUpgradeDetailModel> {
    const upgradeDetail = await this.lensUpgradeDetailRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!upgradeDetail) {
      throw new HttpException(
        'Lens upgrade detail not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return upgradeDetail.toModel();
  }

  async getAllLensUpgradeDetails(): Promise<LensUpgradeDetailModel[]> {
    const upgradeDetails = await this.lensUpgradeDetailRepository.find({
      where: { deleted_at: IsNull() },
      order: { created_at: 'DESC' },
    });

    return upgradeDetails.map((detail) => detail.toModel());
  }

  async createLensUpgradeDetail(
    name: string,
    upgradeHardCoating: boolean,
    upgradeAntiReflection: boolean,
    upgradeUvProtection: boolean,
    upgradeBlueLight: boolean,
    upgradeLotusEffect: boolean,
    upgradeSmartFocus: boolean,
    upgradeTransition: boolean,
    upgradeProgressive: boolean,
    upgradeHardCoatingPrice: number,
    upgradeAntiReflectionPrice: number,
    upgradeUvProtectionPrice: number,
    upgradeBluelightPrice: number,
    upgradeLotusEffectPrice: number,
    upgradeSmartFocusPrice: number,
    upgradeTransitionPrice: number,
    upgradeProgressivePrice: number,
    totalUpgradesPrice: number,
    description: string | null,
    reqUserId: number,
  ): Promise<LensUpgradeDetailModel> {
    const entity = new LensUpgradeDetailEntity();
    entity.name = name;
    entity.upgrade_hard_coating = upgradeHardCoating;
    entity.upgrade_anti_reflection = upgradeAntiReflection;
    entity.upgrade_uv_protection = upgradeUvProtection;
    entity.upgrade_blue_light = upgradeBlueLight;
    entity.upgrade_lotus_effect = upgradeLotusEffect;
    entity.upgrade_smart_focus = upgradeSmartFocus;
    entity.upgrade_transition = upgradeTransition;
    entity.upgrade_progressive = upgradeProgressive;
    entity.upgrade_hard_coating_price = upgradeHardCoatingPrice;
    entity.upgrade_anti_reflection_price = upgradeAntiReflectionPrice;
    entity.upgrade_uv_protection_price = upgradeUvProtectionPrice;
    entity.upgrade_bluelight_price = upgradeBluelightPrice;
    entity.upgrade_lotus_effect_price = upgradeLotusEffectPrice;
    entity.upgrade_smart_focus_price = upgradeSmartFocusPrice;
    entity.upgrade_transition_price = upgradeTransitionPrice;
    entity.upgrade_progressive_price = upgradeProgressivePrice;
    entity.total_upgrades_price = totalUpgradesPrice;
    entity.description = description;
    entity.created_at = new Date();
    entity.created_by = reqUserId;
    entity.updated_at = new Date();
    entity.updated_by = reqUserId;

    const savedUpgradeDetail =
      await this.lensUpgradeDetailRepository.save(entity);
    return savedUpgradeDetail.toModel();
  }

  async updateLensUpgradeDetail(
    upgradeDetail: LensUpgradeDetailModel,
    updates: Partial<LensUpgradeDetailModel>,
    reqUserId: number,
  ): Promise<LensUpgradeDetailModel> {
    const updateData: any = {
      updated_at: new Date(),
      updated_by: reqUserId,
    };

    // Apply all possible updates
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && key !== 'id') {
        updateData[key] = updates[key];
      }
    });

    await this.lensUpgradeDetailRepository.update(
      { id: upgradeDetail.id, deleted_at: IsNull() },
      updateData,
    );

    return await this.getLensUpgradeDetailById(upgradeDetail.id);
  }

  async deleteLensUpgradeDetail(
    upgradeDetail: LensUpgradeDetailModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.lensUpgradeDetailRepository.update(
      { id: upgradeDetail.id, deleted_at: IsNull() },
      {
        deleted_at: new Date(),
        deleted_by: reqUserId,
      },
    );

    return true;
  }
}
