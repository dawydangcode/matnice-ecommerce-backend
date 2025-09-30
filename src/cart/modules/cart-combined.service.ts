import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CartService } from '../cart.service';
import { CartFrameService } from './cart_frame/cart_frame.service';
import { CartLensDetailService } from './cart_lens_detail/cart_lens_detail.service';
import { CartFrameModel } from './cart_frame/models/cart_frame.model';
import { CartLensDetailModel } from './cart_lens_detail/models/cart_lens_detail.model';
import { ProductService } from '../../product/product.service';
import { ProductImageService } from '../../product/modules/product-image/product-image.service';
import { ProductColorService } from '../../product/modules/product-color/product-color.service';
import { LensService } from '../../lens/lens.service';
import { LensVariantService } from '../../lens/modules/lens_variant/lens_variant.service';
import { LensImageService } from '../../lens/modules/lens_image/lens-image.service';
import { LensCoatingService } from '../../lens/modules/lens_coating/lens_coating.service';
import { LensTintColorService } from '../../lens/modules/lens_tint_color/lens_tint_color.service';
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
    private readonly productService: ProductService,
    private readonly productImageService: ProductImageService,
    private readonly productColorService: ProductColorService,
    private readonly lensService: LensService,
    private readonly lensVariantService: LensVariantService,
    private readonly lensImageService: LensImageService,
    private readonly lensCoatingService: LensCoatingService,
    private readonly lensTintColorService: LensTintColorService,
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
      data.frame.selectedColorId,
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
      data.frameData.selectedColorId,
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

    // Get product names and images for all frames
    const productIds = frames.map((frame) => frame.productId);
    const uniqueProductIds = [...new Set(productIds)];
    const products = await Promise.all(
      uniqueProductIds.map(async (productId) => {
        try {
          return await this.productService.getProductById(productId);
        } catch (error) {
          console.error(`Failed to get product ${productId}:`, error);
          return null;
        }
      }),
    );

    // Get lens information for lens details with lensVariantId
    const lensVariantIds = lensDetails
      .filter((detail) => detail.lensVariantId)
      .map((detail) => detail.lensVariantId)
      .filter((id): id is number => id !== null);
    const uniqueLensVariantIds = [...new Set(lensVariantIds)];

    const lensVariants = await Promise.all(
      uniqueLensVariantIds.map(async (lensVariantId) => {
        try {
          return await this.lensVariantService.findById(lensVariantId);
        } catch (error) {
          console.error(`Failed to get lens variant ${lensVariantId}:`, error);
          return null;
        }
      }),
    );

    // Get lens information for the lens variants
    const lensIds = lensVariants
      .filter(
        (variant): variant is NonNullable<typeof variant> =>
          variant !== null && variant.lensId !== undefined,
      )
      .map((variant) =>
        typeof variant.lensId === 'string'
          ? parseInt(variant.lensId)
          : variant.lensId,
      )
      .filter((id): id is number => typeof id === 'number' && !isNaN(id));
    const uniqueLensIds = [...new Set(lensIds)];

    console.log('Unique lens IDs:', uniqueLensIds);

    console.log('Lens variants found:', lensVariants.length);
    console.log('Unique lens IDs:', uniqueLensIds);

    const lenses = await Promise.all(
      uniqueLensIds.map(async (lensId) => {
        try {
          const lens = await this.lensService.getLensById(lensId);
          console.log(`Loaded lens ${lensId}:`, lens?.name);
          return lens;
        } catch (error) {
          console.error(`Failed to get lens ${lensId}:`, error);
          return null;
        }
      }),
    ); // Get lens images for lenses (imageorder = 'a')
    const lensImages = await Promise.all(
      uniqueLensIds.map(async (lensId) => {
        try {
          const primaryImage =
            await this.lensImageService.getPrimaryImageForLens(lensId);
          return { lensId, imageUrl: primaryImage?.imageUrl || null };
        } catch (error) {
          console.error(`Failed to get lens images for lens ${lensId}:`, error);
          return { lensId, imageUrl: null };
        }
      }),
    );

    // Create maps for easy lookup
    const lensVariantMap = new Map();
    const lensMap = new Map();
    const lensImageMap = new Map();

    lensVariants.forEach((variant, index) => {
      if (variant) {
        lensVariantMap.set(uniqueLensVariantIds[index], variant);
      }
    });

    lenses.forEach((lens, index) => {
      if (lens) {
        // Store both string and number version of lens id for mapping
        const lensId = uniqueLensIds[index];
        lensMap.set(lensId, lens);
        lensMap.set(lensId.toString(), lens);
      }
    });

    lensImages.forEach((imageData) => {
      lensImageMap.set(imageData.lensId, imageData.imageUrl);
    });

    // Get product colors for frames with selectedColorId
    const frameColorData = await Promise.all(
      frames.map(async (frame) => {
        if (frame.selectedColorId) {
          try {
            const color = await this.productColorService.getProductColorById(
              frame.selectedColorId,
            );
            const colorImages =
              await this.productImageService.getProductImagesByColorId(
                frame.productId,
                frame.selectedColorId,
              );
            const thumbnailImage = colorImages.find(
              (img) => img.imageOrder === 'a',
            );
            return {
              frameId: frame.id,
              color: color,
              colorImage: thumbnailImage?.imageUrl || null,
            };
          } catch (error) {
            console.error(
              `Failed to get color data for frame ${frame.id}:`,
              error,
            );
            return { frameId: frame.id, color: null, colorImage: null };
          }
        }
        return { frameId: frame.id, color: null, colorImage: null };
      }),
    );

    // Get product images for frames without selectedColorId (fallback to product images)
    const productImages = await Promise.all(
      uniqueProductIds.map(async (productId) => {
        try {
          const images =
            await this.productImageService.getProductThumbnailImages(productId);
          // Get the first image with order 'a' (thumbnail)
          const thumbnailImage = images.find((img) => img.imageOrder === 'a');
          return thumbnailImage?.imageUrl || null;
        } catch (error) {
          console.error(`Failed to get product image ${productId}:`, error);
          return null;
        }
      }),
    );

    // Create product map for easy lookup
    const productMap = new Map();
    const productImageMap = new Map();
    const frameColorMap = new Map();

    products.forEach((product, index) => {
      if (product) {
        productMap.set(uniqueProductIds[index], product);
      }
      productImageMap.set(uniqueProductIds[index], productImages[index]);
    });

    frameColorData.forEach((colorData) => {
      frameColorMap.set(colorData.frameId, colorData);
    });

    // Process coating and tint color data for lens details
    const coatingMap = new Map();
    const tintColorMap = new Map();

    // Collect all coating IDs and tint color IDs from lens details
    const allCoatingIds = new Set<number>();
    const allTintColorIds = new Set<number>();

    lensDetails.forEach((detail) => {
      // Parse selectedCoatingIds JSON
      if (detail.selectedCoatingIds) {
        try {
          const coatingIds = JSON.parse(detail.selectedCoatingIds);
          if (Array.isArray(coatingIds)) {
            coatingIds.forEach((id) => {
              if (typeof id === 'number') {
                allCoatingIds.add(id);
              }
            });
          }
        } catch (error) {
          console.error(
            `Failed to parse coating IDs for lens detail ${detail.id}:`,
            error,
          );
        }
      }

      // Collect tint color IDs
      if (detail.selectedTintColorId) {
        allTintColorIds.add(detail.selectedTintColorId);
      }
    });

    // Fetch all coatings
    if (allCoatingIds.size > 0) {
      try {
        const coatings = await Promise.all(
          Array.from(allCoatingIds).map(async (coatingId) => {
            try {
              return await this.lensCoatingService.getLensCoatingById(
                coatingId,
              );
            } catch (error) {
              console.error(`Failed to get coating ${coatingId}:`, error);
              return null;
            }
          }),
        );

        coatings.forEach((coating, index) => {
          if (coating) {
            coatingMap.set(Array.from(allCoatingIds)[index], coating);
          }
        });
      } catch (error) {
        console.error('Failed to fetch coatings:', error);
      }
    }

    // Fetch all tint colors
    if (allTintColorIds.size > 0) {
      try {
        const tintColors = await Promise.all(
          Array.from(allTintColorIds).map(async (tintColorId) => {
            try {
              return await this.lensTintColorService.getLensTintColorById(
                tintColorId,
              );
            } catch (error) {
              console.error(`Failed to get tint color ${tintColorId}:`, error);
              return null;
            }
          }),
        );

        tintColors.forEach((tintColor, index) => {
          if (tintColor) {
            tintColorMap.set(Array.from(allTintColorIds)[index], tintColor);
          }
        });
      } catch (error) {
        console.error('Failed to fetch tint colors:', error);
      }
    }

    // Build cart item summaries
    const items: CartItemSummary[] = frames.map((frame) => {
      const lensDetail = lensDetailMap.get(frame.id);
      const product = productMap.get(frame.productId);
      const frameColorData = frameColorMap.get(frame.id);

      // Build full product name with variant
      let fullProductName = product?.productName || 'Unknown Product';
      if (product?.productNumber) {
        fullProductName = `${product.productNumber}`;
      }

      // Use color-specific image if available, otherwise fallback to product image
      const productImage =
        frameColorData?.colorImage ||
        productImageMap.get(frame.productId) ||
        null;

      return {
        cartFrameId: frame.id,
        productId: frame.productId,
        productName: fullProductName,
        productImage: productImage,
        selectedColor: frameColorData?.color
          ? {
              id: frameColorData.color.id,
              colorName: frameColorData.color.colorName,
              colorCode: frameColorData.color.colorCode,
              productVariantName: frameColorData.color.productVariantName,
            }
          : null,
        quantity: frame.quantity,
        framePrice: frame.framePrice,
        totalPrice: frame.totalPrice,
        discount: frame.discount,
        lensDetail: lensDetail
          ? (() => {
              // Process coating data for this lens detail
              const selectedCoatings: {
                id: number;
                name: string;
                price: number;
                description?: string;
              }[] = [];
              if (lensDetail.selectedCoatingIds) {
                try {
                  const coatingIds = JSON.parse(lensDetail.selectedCoatingIds);
                  if (Array.isArray(coatingIds)) {
                    coatingIds.forEach((coatingId) => {
                      const coating = coatingMap.get(coatingId);
                      if (coating) {
                        selectedCoatings.push({
                          id: coating.id,
                          name: coating.name,
                          price: coating.price || 0,
                          description: coating.description,
                        });
                      }
                    });
                  }
                } catch (error) {
                  console.error(
                    `Failed to process coating IDs for lens detail ${lensDetail.id}:`,
                    error,
                  );
                }
              }

              // Process tint color data for this lens detail
              const selectedTintColor = lensDetail.selectedTintColorId
                ? (() => {
                    const tintColor = tintColorMap.get(
                      lensDetail.selectedTintColorId,
                    );
                    return tintColor
                      ? {
                          id: tintColor.id,
                          name: tintColor.name,
                          colorCode: tintColor.colorCode,
                          price: tintColor.price || 0,
                          description: tintColor.description,
                        }
                      : null;
                  })()
                : null;

              return {
                id: lensDetail.id,
                lensId: lensDetail.lensId ?? undefined,
                lensType: lensDetail.lensType ?? undefined,
                lensQuality: lensDetail.lensQuality,
                lensPrice: lensDetail.lensPrice,
                totalUpgradesPrice: lensDetail.totalUpgradesPrice,
                selectedCoatings:
                  selectedCoatings.length > 0 ? selectedCoatings : undefined,
                selectedTintColor,
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
              };
            })()
          : undefined,
        lensInfo: lensDetail?.lensVariantId
          ? (() => {
              const lensVariant = lensVariantMap.get(lensDetail.lensVariantId);
              const lens = lensVariant?.lensId
                ? lensMap.get(lensVariant.lensId) // lensVariant.lensId is string
                : null;
              const lensImage = lens?.id
                ? lensImageMap.get(parseInt(lens.id))
                : null;
              return lens
                ? {
                    id: lens.id,
                    name: lens.name,
                    lensType: lens.lensType,
                    description: lens.description,
                    origin: lens.origin,
                    image: lensImage,
                  }
                : null;
            })()
          : null,
        lensVariantInfo: lensDetail?.lensVariantId
          ? (() => {
              const lensVariant = lensVariantMap.get(lensDetail.lensVariantId);
              return lensVariant
                ? {
                    id: lensVariant.id,
                    design: lensVariant.design,
                    material: lensVariant.material,
                    price: lensVariant.price,
                    lensThickness: lensVariant.lensThickness,
                  }
                : null;
            })()
          : null,
      };
    });

    // Calculate totals
    const totalFramePrice = frames.reduce(
      (sum, frame) => sum + frame.framePrice * frame.quantity,
      0,
    );
    const totalLensPrice = lensDetails.reduce(
      (sum, detail) => sum + detail.lensPrice + (detail.totalUpgradesPrice || 0),
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
      frame: CartFrameModel & { productName?: string; productImage?: string };
      lensDetail?: CartLensDetailModel;
    }[]
  > {
    console.log(
      '[CartCombinedService] getCartItemsWithFullDetails called with cartId:',
      cartId,
      'Type:',
      typeof cartId,
    );

    if (!cartId || cartId === null || cartId === undefined || isNaN(cartId)) {
      throw new Error(
        `[CartCombinedService] Invalid cartId passed: ${cartId} (type: ${typeof cartId})`,
      );
    }

    const frames = await this.cartFrameService.getCartFramesByCartId(cartId);

    const result: {
      frame: CartFrameModel & { productName?: string; productImage?: string };
      lensDetail?: CartLensDetailModel;
    }[] = [];

    for (const frame of frames) {
      const lensDetail =
        await this.cartLensDetailService.getCartLensDetailByCartFrameId(
          frame.id,
        );

      // Get product details
      let productName: string | undefined;
      let productImage: string | undefined;

      try {
        const product = await this.productService.getProductById(
          frame.productId,
        );
        productName = product.productName;

        // Get product thumbnail image
        try {
          const imageResult =
            await this.productImageService.getProductImagesByProductId(
              frame.productId,
              undefined, // no pagination
            );
          const thumbnailImage = imageResult.data.find(
            (img) => img.imageOrder === 'a',
          );
          productImage = thumbnailImage?.imageUrl;
        } catch (imageError) {
          console.error(
            `Failed to get product image for product ${frame.productId}:`,
            imageError,
          );
        }
      } catch (productError) {
        console.error(
          `Failed to get product ${frame.productId}:`,
          productError,
        );
        productName = 'Unknown Product';
      }

      result.push({
        frame: {
          ...frame,
          productName,
          productImage,
        },
        lensDetail: lensDetail || undefined,
      });
    }

    return result;
  }
}
