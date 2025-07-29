import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';
import { CartLensDetailEntity } from './entities/cart_lens_detail.entity';
import { CartLensDetailModel } from './models/cart_lens_detail.model';

@Injectable()
export class CartLensDetailService {
  constructor(
    @InjectRepository(CartLensDetailEntity)
    private readonly cartLensDetailRepository: Repository<CartLensDetailEntity>,
  ) {}

  async getCartLensDetailById(id: number): Promise<CartLensDetailModel> {
    const lensDetail = await this.cartLensDetailRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lensDetail) {
      throw new HttpException(
        'Cart lens detail not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return lensDetail.toModel();
  }

  async getCartLensDetailByCartFrameId(
    cartFrameId: number,
  ): Promise<CartLensDetailModel | undefined> {
    const lensDetail = await this.cartLensDetailRepository.findOne({
      where: { cartFrameId, deletedAt: IsNull() },
    });
    if (!lensDetail) {
      throw new HttpException(
        'Cart lens detail not found for the given cart frame ID',
        HttpStatus.NOT_FOUND,
      );
    }

    return lensDetail.toModel();
  }

  async getCartLensDetailsByCartFrameIds(
    cartFrameIds: number[],
  ): Promise<CartLensDetailModel[]> {
    if (cartFrameIds.length === 0) return [];

    const lensDetails = await this.cartLensDetailRepository.find({
      where: {
        cartFrameId: In(cartFrameIds),
        deletedAt: IsNull(),
      },
    });

    return lensDetails.map((detail) => detail.toModel());
  }

  async createCartLensDetail(
    cartFrameId: number,
    lensId: number,
    rightEyeSphere: number,
    rightEyeCylinder: number,
    rightEyeAxis: number,
    leftEyeSphere: number,
    leftEyeCylinder: number,
    leftEyeAxis: number,
    pdLeft: number,
    pdRight: number,
    lensType: string,
    lensQuality: string,
    refractionIndex: number,
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
    lensPrice: number,
    lensMaterial: string,
    lensThickness: string,
    tintColor: string,
    tintDensity: string,
    prescriptionNotes: string,
    lensNotes: string,
    manufacturingNotes: string,
    fieldOfVision: string,
    addLeft: number,
    addRight: number,
    reqUserId: number,
  ): Promise<CartLensDetailModel> {
    const entity = new CartLensDetailEntity();
    entity.cartFrameId = cartFrameId;
    entity.lensId = lensId;
    entity.rightEyeSphere = rightEyeSphere;
    entity.rightEyeCylinder = rightEyeCylinder;
    entity.rightEyeAxis = rightEyeAxis;
    entity.leftEyeSphere = leftEyeSphere;
    entity.leftEyeCylinder = leftEyeCylinder;
    entity.leftEyeAxis = leftEyeAxis;
    entity.pdLeft = pdLeft;
    entity.pdRight = pdRight;
    entity.lensType = lensType;
    entity.lensQuality = lensQuality || 'Standard';
    entity.refractionIndex = refractionIndex || 1.5;
    entity.upgradeHardCoating = upgradeHardCoating;
    entity.upgradeAntiReflection = upgradeAntiReflection;
    entity.upgradeUvProtection = upgradeUvProtection;
    entity.upgradeBlueLight = upgradeBlueLight;
    entity.upgradeLotusEffect = upgradeLotusEffect;
    entity.upgradeSmartFocus = upgradeSmartFocus;
    entity.upgradeTransition = upgradeTransition;
    entity.upgradeProgressive = upgradeProgressive;
    entity.upgradeHardCoatingPrice = upgradeHardCoatingPrice;
    entity.upgradeAntiReflectionPrice = upgradeAntiReflectionPrice;
    entity.upgradeUvProtectionPrice = upgradeUvProtectionPrice;
    entity.upgradeBluelightPrice = upgradeBluelightPrice;
    entity.upgradeLotusEffectPrice = upgradeLotusEffectPrice;
    entity.upgradeSmartFocusPrice = upgradeSmartFocusPrice;
    entity.upgradeTransitionPrice = upgradeTransitionPrice;
    entity.upgradeProgressivePrice = upgradeProgressivePrice;
    entity.totalUpgradesPrice = totalUpgradesPrice;
    entity.lensPrice = lensPrice;
    entity.lensMaterial = lensMaterial;
    entity.lensThickness = lensThickness;
    entity.tintColor = tintColor;
    entity.tintDensity = tintDensity;
    entity.prescriptionNotes = prescriptionNotes;
    entity.lensNotes = lensNotes;
    entity.manufacturingNotes = manufacturingNotes;
    entity.fieldOfVision = fieldOfVision;
    entity.addLeft = addLeft;
    entity.addRight = addRight;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;
    entity.updatedAt = new Date();
    entity.updatedBy = reqUserId;

    const savedLensDetail = await this.cartLensDetailRepository.save(entity);
    return savedLensDetail.toModel();
  }

  async updateCartLensDetail(
    lensDetail: CartLensDetailModel,
    updates: Partial<CartLensDetailModel>,
    reqUserId: number,
  ): Promise<CartLensDetailModel> {
    const updateData: any = {
      updatedAt: new Date(),
      updatedBy: reqUserId,
    };

    // Apply all possible updates
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && key !== 'id' && key !== 'cartFrameId') {
        updateData[key] = updates[key];
      }
    });

    await this.cartLensDetailRepository.update(
      { id: lensDetail.id, deletedAt: IsNull() },
      updateData,
    );

    return await this.getCartLensDetailById(lensDetail.id);
  }

  async deleteCartLensDetail(
    lensDetail: CartLensDetailModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.cartLensDetailRepository.update(
      { id: lensDetail.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async deleteCartLensDetailByCartFrameId(
    cartFrameId: number,
    reqUserId: number,
  ): Promise<boolean> {
    await this.cartLensDetailRepository.update(
      { cartFrameId, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async calculateLensPrice(lensDetail: CartLensDetailModel): Promise<number> {
    // Base lens price calculation logic
    let basePrice = 50.0; // Default base price

    // Refraction index pricing
    switch (lensDetail.refractionIndex) {
      case 1.56:
        basePrice += 20.0;
        break;
      case 1.6:
        basePrice += 40.0;
        break;
      case 1.67:
        basePrice += 80.0;
        break;
      case 1.74:
        basePrice += 120.0;
        break;
    }

    // Quality pricing
    switch (lensDetail.lensQuality) {
      case 'Premium':
        basePrice += 30.0;
        break;
      case 'Ultra':
        basePrice += 60.0;
        break;
    }

    return basePrice + lensDetail.totalUpgradesPrice;
  }
}
