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
    lensPrice: number,
    lensMaterial: string,
    prescriptionNotes: string,
    lensNotes: string,
    manufacturingNotes: string,
    fieldOfVision: string,
    addLeft: number,
    addRight: number,
    reqUserId: number,
    lensThicknessId?: number,
    lensUpgradeDetailId?: number,
    tintId?: number,
  ): Promise<CartLensDetailModel> {
    const entity = new CartLensDetailEntity();
    entity.cartFrameId = cartFrameId;
    entity.rightEyeSphere = rightEyeSphere;
    entity.rightEyeCylinder = rightEyeCylinder;
    entity.rightEyeAxis = rightEyeAxis;
    entity.leftEyeSphere = leftEyeSphere;
    entity.leftEyeCylinder = leftEyeCylinder;
    entity.leftEyeAxis = leftEyeAxis;
    entity.pdLeft = pdLeft;
    entity.pdRight = pdRight;
    entity.lensPrice = lensPrice;
    entity.prescriptionNotes = prescriptionNotes;
    entity.lensNotes = lensNotes;
    entity.manufacturingNotes = manufacturingNotes;
    entity.addLeft = addLeft;
    entity.addRight = addRight;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedLensDetail = await this.cartLensDetailRepository.save(entity);
    return savedLensDetail.toModel();
  }

  // New method for lens products from LensSelectionPage
  async createCartLensDetailForLensProduct(
    cartFrameId: number,
    lensVariantId: number,
    rightEyeSphere: number,
    rightEyeCylinder: number | undefined,
    rightEyeAxis: number | undefined,
    leftEyeSphere: number,
    leftEyeCylinder: number | undefined,
    leftEyeAxis: number | undefined,
    pdLeft: number | undefined,
    pdRight: number | undefined,
    addLeft: number | undefined,
    addRight: number | undefined,
    lensPrice: number,
    selectedCoatingIds: number[],
    selectedTintColorId: number | undefined,
    prescriptionNotes: string | undefined,
    lensNotes: string | undefined,
    reqUserId: number,
  ): Promise<CartLensDetailModel> {
    const entity = new CartLensDetailEntity();

    // Basic fields
    entity.cartFrameId = cartFrameId;
    entity.lensVariantId = lensVariantId;
    entity.lensPrice = lensPrice;

    // Prescription values
    entity.rightEyeSphere = rightEyeSphere;
    entity.rightEyeCylinder = rightEyeCylinder || 0;
    entity.rightEyeAxis = rightEyeAxis || 0;
    entity.leftEyeSphere = leftEyeSphere;
    entity.leftEyeCylinder = leftEyeCylinder || 0;
    entity.leftEyeAxis = leftEyeAxis || 0;
    entity.pdLeft = pdLeft || 0;
    entity.pdRight = pdRight || 0;
    entity.addLeft = addLeft || 0;
    entity.addRight = addRight || 0;

    // Lens options
    entity.selectedCoatingIds =
      selectedCoatingIds.length > 0 ? JSON.stringify(selectedCoatingIds) : null;
    entity.selectedTintColorId = selectedTintColorId || null;

    // Notes
    entity.prescriptionNotes = prescriptionNotes || '';
    entity.lensNotes = lensNotes || '';

    // Audit fields
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

    // Quality pricing
    switch (lensDetail.lensQuality) {
      case 'Premium':
        basePrice += 30.0;
        break;
      case 'Ultra':
        basePrice += 60.0;
        break;
    }

    // Return base price, additional pricing will come from referenced tables
    return basePrice;
  }
}
