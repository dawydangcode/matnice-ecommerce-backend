import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartLensDetailService } from './cart_lens_detail.service';
import { RequestModel } from 'src/common/models/request.model';
import {
  CreateCartLensDetailDto,
  UpdateCartLensDetailDto,
  CartLensDetailQueryDto,
  GetCartLensDetailParamsDto,
} from './dtos/cart_lens_detail.dto';
import { CartLensDetailModel } from './models/cart_lens_detail.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';

@ApiTags('Cart / Cart Lens Detail')
@Controller('api/v1/cart-lens-detail')
@Roles(RoleType.Admin, RoleType.User, RoleType.Employee, RoleType.Guest)
export class CartLensDetailController {
  constructor(private readonly cartLensDetailService: CartLensDetailService) {}

  @Get(':cartLensDetailId/detail')
  async getCartLensDetailById(
    @Param() params: GetCartLensDetailParamsDto,
  ): Promise<CartLensDetailModel> {
    return await this.cartLensDetailService.getCartLensDetailById(
      params.cartLensDetailId,
    );
  }

  @Get('cart-frame/:cartFrameId')
  async getCartLensDetailByCartFrameId(
    @Param('cartFrameId') cartFrameId: number,
  ): Promise<CartLensDetailModel | undefined> {
    return await this.cartLensDetailService.getCartLensDetailByCartFrameId(
      cartFrameId,
    );
  }

  @Post('create')
  async createCartLensDetail(
    @Req() req: RequestModel,
    @Body() body: CreateCartLensDetailDto,
  ): Promise<CartLensDetailModel> {
    // Check if lens detail already exists for this cart frame
    const existingLensDetail =
      await this.cartLensDetailService.getCartLensDetailByCartFrameId(
        body.cartFrameId,
      );

    if (existingLensDetail) {
      // Update existing lens detail
      return await this.cartLensDetailService.updateCartLensDetail(
        existingLensDetail,
        body,
        req.user.userId,
      );
    }

    return await this.cartLensDetailService.createCartLensDetail(
      body.cartFrameId,
      body.lensId,
      body.rightEyeSphere,
      body.rightEyeCylinder,
      body.rightEyeAxis,
      body.leftEyeSphere,
      body.leftEyeCylinder,
      body.leftEyeAxis,
      body.pdLeft,
      body.pdRight,
      body.lensType,
      body.lensQuality,
      body.lensPrice,
      body.lensMaterial,
      body.prescriptionNotes,
      body.lensNotes,
      body.manufacturingNotes,
      body.fieldOfVision,
      body.addLeft,
      body.addRight,
      req.user.userId,
      body.lensThicknessId,
      body.lensUpgradeDetailId,
      body.tintId,
    );
  }

  @Put(':cartLensDetailId/update')
  async updateCartLensDetail(
    @Req() req: RequestModel,
    @Param() params: GetCartLensDetailParamsDto,
    @Body() body: UpdateCartLensDetailDto,
  ): Promise<CartLensDetailModel> {
    const lensDetail = await this.cartLensDetailService.getCartLensDetailById(
      params.cartLensDetailId,
    );

    return await this.cartLensDetailService.updateCartLensDetail(
      lensDetail,
      body,
      req.user.userId,
    );
  }

  @Delete(':cartLensDetailId/delete')
  async deleteCartLensDetail(
    @Req() req: RequestModel,
    @Param() params: GetCartLensDetailParamsDto,
  ): Promise<boolean> {
    const lensDetail = await this.cartLensDetailService.getCartLensDetailById(
      params.cartLensDetailId,
    );
    return await this.cartLensDetailService.deleteCartLensDetail(
      lensDetail,
      req.user.userId,
    );
  }

  @Delete('cart-frame/:cartFrameId/delete')
  async deleteCartLensDetailByCartFrameId(
    @Req() req: RequestModel,
    @Param('cartFrameId') cartFrameId: number,
  ): Promise<boolean> {
    return await this.cartLensDetailService.deleteCartLensDetailByCartFrameId(
      cartFrameId,
      req.user.userId,
    );
  }

  @Get(':cartLensDetailId/calculate-price')
  async calculateLensPrice(
    @Param() params: GetCartLensDetailParamsDto,
  ): Promise<{ calculatedPrice: number }> {
    const lensDetail = await this.cartLensDetailService.getCartLensDetailById(
      params.cartLensDetailId,
    );

    const calculatedPrice =
      await this.cartLensDetailService.calculateLensPrice(lensDetail);

    return { calculatedPrice };
  }
}
