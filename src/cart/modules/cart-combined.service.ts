import { Injectable } from '@nestjs/common';
import { CartFrameService } from './cart_frame/cart_frame.service';
import { CartLensDetailService } from './cart_lens_detail/cart_lens_detail.service';
import { CartFrameModel } from './cart_frame/models/cart_frame.model';
import { CartLensDetailModel } from './cart_lens_detail/models/cart_lens_detail.model';
import {
  CreateCartItemCompleteDto,
  CartItemSummary,
  CartSummary,
} from './dtos/cart-combined.dto';

@Injectable()
export class CartCombinedService {
  constructor(
    private readonly cartFrameService: CartFrameService,
    private readonly cartLensDetailService: CartLensDetailService,
  ) {}

  async createCartItemComplete(
    data: CreateCartItemCompleteDto,
    reqUserId: number,
  ): Promise<{
    frame: CartFrameModel;
    lensDetail?: CartLensDetailModel;
  }> {
    // Create cart frame first
    const frame = await this.cartFrameService.createCartFrame(
      data.frame.cartId,
      data.frame.productId,
      data.frame.quantity,
      data.frame.framePrice,
      data.frame.totalPrice,
      data.frame.discount || 0,
      reqUserId,
    );

    let lensDetail: CartLensDetailModel | undefined;

    // Create lens detail if provided
    if (data.lensDetail) {
      lensDetail = await this.cartLensDetailService.createCartLensDetail(
        frame.id,
        data.lensDetail.lensId,
        data.lensDetail.rightEyeSphere,
        data.lensDetail.rightEyeCylinder,
        data.lensDetail.rightEyeAxis,
        data.lensDetail.leftEyeSphere,
        data.lensDetail.leftEyeCylinder,
        data.lensDetail.leftEyeAxis,
        data.lensDetail.pdLeft,
        data.lensDetail.pdRight,
        data.lensDetail.lensType,
        data.lensDetail.lensQuality,
        data.lensDetail.refractionIndex,
        data.lensDetail.upgradeHardCoating,
        data.lensDetail.upgradeAntiReflection,
        data.lensDetail.upgradeUvProtection,
        data.lensDetail.upgradeBlueLight,
        data.lensDetail.upgradeLotusEffect,
        data.lensDetail.upgradeSmartFocus,
        data.lensDetail.upgradeTransition,
        data.lensDetail.upgradeProgressive,
        data.lensDetail.upgradeHardCoatingPrice,
        data.lensDetail.upgradeAntiReflectionPrice,
        data.lensDetail.upgradeUvProtectionPrice,
        data.lensDetail.upgradeBluelightPrice,
        data.lensDetail.upgradeLotusEffectPrice,
        data.lensDetail.upgradeSmartFocusPrice,
        data.lensDetail.upgradeTransitionPrice,
        data.lensDetail.upgradeProgressivePrice,
        data.lensDetail.totalUpgradesPrice,
        data.lensDetail.lensPrice,
        data.lensDetail.lensMaterial,
        data.lensDetail.lensThickness,
        data.lensDetail.tintColor,
        data.lensDetail.tintDensity,
        data.lensDetail.prescriptionNotes,
        data.lensDetail.lensNotes,
        data.lensDetail.manufacturingNotes,
        data.lensDetail.fieldOfVision,
        data.lensDetail.addLeft,
        data.lensDetail.addRight,
        reqUserId,
      );
    }

    return { frame, lensDetail };
  }

  async getCartSummary(cartId: number): Promise<CartSummary> {
    // Get all cart frames
    const frames = await this.cartFrameService.getCartFramesByCartId(cartId);

    // Get lens details for all frames
    const frameIds = frames.map((frame) => frame.id);
    const lensDetails =
      await this.cartLensDetailService.getCartLensDetailsByCartFrameIds(
        frameIds,
      );

    // Create lens detail map for easy lookup
    const lensDetailMap = new Map<number, CartLensDetailModel>();
    lensDetails.forEach((detail) => {
      lensDetailMap.set(detail.cartFrameId, detail);
    });

    // Build cart item summaries
    const items: CartItemSummary[] = frames.map((frame) => {
      const lensDetail = lensDetailMap.get(frame.id);

      return {
        cartFrameId: frame.id,
        productId: frame.productId,
        quantity: frame.quantity,
        framePrice: frame.framePrice,
        totalPrice: frame.totalPrice,
        discount: frame.discount,
        lensDetail: lensDetail
          ? {
              id: lensDetail.id,
              lensId: lensDetail.lensId,
              lensType: lensDetail.lensType,
              lensQuality: lensDetail.lensQuality,
              lensPrice: lensDetail.lensPrice,
              totalUpgradesPrice: lensDetail.totalUpgradesPrice,
              prescription: {
                rightEye: {
                  sphere: lensDetail.rightEyeSphere,
                  cylinder: lensDetail.rightEyeCylinder,
                  axis: lensDetail.rightEyeAxis,
                },
                leftEye: {
                  sphere: lensDetail.leftEyeSphere,
                  cylinder: lensDetail.leftEyeCylinder,
                  axis: lensDetail.leftEyeAxis,
                },
                pdLeft: lensDetail.pdLeft,
                pdRight: lensDetail.pdRight,
              },
              upgrades: {
                hardCoating: lensDetail.upgradeHardCoating,
                antiReflection: lensDetail.upgradeAntiReflection,
                uvProtection: lensDetail.upgradeUvProtection,
                blueLight: lensDetail.upgradeBlueLight,
                lotusEffect: lensDetail.upgradeLotusEffect,
                smartFocus: lensDetail.upgradeSmartFocus,
                transition: lensDetail.upgradeTransition,
                progressive: lensDetail.upgradeProgressive,
              },
            }
          : undefined,
      };
    });

    // Calculate totals
    const totalFramePrice = frames.reduce(
      (sum, frame) => sum + frame.framePrice * frame.quantity,
      0,
    );
    const totalLensPrice = lensDetails.reduce(
      (sum, detail) => sum + detail.lensPrice,
      0,
    );
    const totalDiscount = frames.reduce(
      (sum, frame) => sum + frame.discount * frame.quantity,
      0,
    );
    const grandTotal =
      frames.reduce((sum, frame) => sum + frame.totalPrice, 0) + totalLensPrice;

    return {
      cartId,
      items,
      totalItems: frames.length,
      totalFramePrice,
      totalLensPrice,
      totalDiscount,
      grandTotal,
    };
  }

  async deleteCartItemComplete(
    cartFrameId: number,
    reqUserId: number,
  ): Promise<boolean> {
    // Delete lens detail first (if exists)
    await this.cartLensDetailService.deleteCartLensDetailByCartFrameId(
      cartFrameId,
      reqUserId,
    );

    // Then delete cart frame
    const frame = await this.cartFrameService.getCartFrameById(cartFrameId);
    await this.cartFrameService.deleteCartFrame(frame, reqUserId);

    return true;
  }

  async clearCart(cartId: number, reqUserId: number): Promise<boolean> {
    // Get all frames first
    const frames = await this.cartFrameService.getCartFramesByCartId(cartId);

    // Delete all lens details
    for (const frame of frames) {
      await this.cartLensDetailService.deleteCartLensDetailByCartFrameId(
        frame.id,
        reqUserId,
      );
    }

    // Delete all frames
    await this.cartFrameService.clearCartFrames(cartId, reqUserId);

    return true;
  }

  async getCartItemsWithFullDetails(cartId: number): Promise<
    {
      frame: CartFrameModel;
      lensDetail?: CartLensDetailModel;
    }[]
  > {
    const frames = await this.cartFrameService.getCartFramesByCartId(cartId);

    const result: {
      frame: CartFrameModel;
      lensDetail?: CartLensDetailModel;
    }[] = [];

    for (const frame of frames) {
      const lensDetail =
        await this.cartLensDetailService.getCartLensDetailByCartFrameId(
          frame.id,
        );
      result.push({
        frame,
        lensDetail: lensDetail || undefined,
      });
    }

    return result;
  }
}
