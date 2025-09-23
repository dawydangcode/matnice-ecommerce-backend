import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CartService } from '../cart.service';
import { CartFrameService } from './cart_frame/cart_frame.service';
import { CartLensDetailService } from './cart_lens_detail/cart_lens_detail.service';
import { CartFrameModel } from './cart_frame/models/cart_frame.model';
import { CartLensDetailModel } from './cart_lens_detail/models/cart_lens_detail.model';
import {
  CreateCartItemCompleteDto,
  CartItemSummary,
  CartSummary,
  AddLensProductToCartDto,
} from './dtos/cart-combined.dto';

@Injectable()
export class CartCombinedService {
  constructor(
    private readonly cartService: CartService,
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
        data.lensDetail.lensPrice,
        data.lensDetail.lensMaterial,
        data.lensDetail.prescriptionNotes,
        data.lensDetail.lensNotes,
        data.lensDetail.manufacturingNotes,
        data.lensDetail.fieldOfVision,
        data.lensDetail.addLeft,
        data.lensDetail.addRight,
        reqUserId,
        data.lensDetail.lensThicknessId,
        data.lensDetail.lensUpgradeDetailId,
        data.lensDetail.tintId,
      );
    }

    return { frame, lensDetail };
  }

  // New method for lens products from LensSelectionPage
  async addLensProductToCart(
    data: AddLensProductToCartDto,
    reqUserId: number,
  ): Promise<{
    frame: CartFrameModel;
    lensDetail: CartLensDetailModel;
  }> {
    // Get or create cart for user
    let cart;
    if (data.cartId) {
      // Use provided cartId
      cart = await this.cartService.getCartById(data.cartId);
      if (!cart) {
        throw new HttpException(
          `Cart with ID ${data.cartId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      // Get user's active cart or create new one
      cart = await this.cartService.findOrCreateCartForUser(reqUserId);
    }

    const cartId = cart.id;

    // Calculate total frame price (frame price + any discounts)
    const totalFramePrice = data.frameData.framePrice; // Can add discount logic here later

    // Create cart frame
    const frame = await this.cartFrameService.createCartFrame(
      cartId,
      data.frameData.productId,
      data.frameData.quantity || 1,
      data.frameData.framePrice,
      totalFramePrice,
      0, // discount
      reqUserId,
    );

    // Create lens detail with all the prescription and lens option data
    const lensDetail =
      await this.cartLensDetailService.createCartLensDetailForLensProduct(
        frame.id,
        data.lensData.lensVariantId,
        data.lensData.prescriptionValues.rightEyeSphere,
        data.lensData.prescriptionValues.rightEyeCylinder,
        data.lensData.prescriptionValues.rightEyeAxis,
        data.lensData.prescriptionValues.leftEyeSphere,
        data.lensData.prescriptionValues.leftEyeCylinder,
        data.lensData.prescriptionValues.leftEyeAxis,
        data.lensData.prescriptionValues.pdLeft,
        data.lensData.prescriptionValues.pdRight,
        data.lensData.prescriptionValues.addLeft,
        data.lensData.prescriptionValues.addRight,
        data.lensData.lensPrice,
        data.lensData.selectedCoatingIds,
        data.lensData.selectedTintColorId,
        data.lensData.prescriptionNotes,
        data.lensData.lensNotes,
        reqUserId,
      );

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
              lensId: lensDetail.lensId ?? undefined,
              lensType: lensDetail.lensType ?? undefined,
              lensQuality: lensDetail.lensQuality,
              lensPrice: lensDetail.lensPrice,
              totalUpgradesPrice: lensDetail.totalUpgradesPrice,
              prescription: {
                rightEye: {
                  sphere: lensDetail.rightEyeSphere ?? undefined,
                  cylinder: lensDetail.rightEyeCylinder ?? undefined,
                  axis: lensDetail.rightEyeAxis ?? undefined,
                },
                leftEye: {
                  sphere: lensDetail.leftEyeSphere ?? undefined,
                  cylinder: lensDetail.leftEyeCylinder ?? undefined,
                  axis: lensDetail.leftEyeAxis ?? undefined,
                },
                pdLeft: lensDetail.pdLeft ?? undefined,
                pdRight: lensDetail.pdRight ?? undefined,
              },
              upgrades: {
                hardCoating: false, // TODO: Implement upgrade logic
                antiReflection: false, // TODO: Implement upgrade logic
                uvProtection: false, // TODO: Implement upgrade logic
                blueLight: false, // TODO: Implement upgrade logic
                lotusEffect: false, // TODO: Implement upgrade logic
                smartFocus: false, // TODO: Implement upgrade logic
                transition: false, // TODO: Implement upgrade logic
                progressive: false, // TODO: Implement upgrade logic
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
