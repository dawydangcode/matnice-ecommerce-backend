import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductDetailService } from './product-detail.service';
import {
  CreateProductDetailBodyDto,
  DeleteProductDetailParamsDto,
  GetProductDetailByIdParamsDto,
  UpdateProductDetailBodyDto,
  UpdateProductDetailParamsDto,
} from './dtos/product-detail.dto';
import { RequestModel } from 'src/common/models/request.model';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';

@Controller('api/v1/')
export class ProductDetailController {
  constructor(private readonly productDetailService: ProductDetailService) {}

  @Get('products-detail/:productDetailId/details')
  @Public()
  async getProductDetail(@Param() params: GetProductDetailByIdParamsDto) {
    return await this.productDetailService.getProductDetailById(
      params.productDetailId,
    );
  }

  @Post('product-detail/create')
  @Roles(RoleType.Admin)
  async createProductDetail(
    @Body() body: CreateProductDetailBodyDto,
    @Req() req: RequestModel,
  ) {
    return await this.productDetailService.createProductDetail(
      body.productId,
      body.bridgeWidth,
      body.frameWidth,
      body.lensHeight,
      body.lensWidth,
      body.templeLength,
      body.frameMaterial,
      body.frameShape,
      body.frameType,
      body.bridgeDesign,
      body.style,
      body.springHinges,
      body.weight,
      body.multifocal,
      req.user.userId,
    );
  }

  @Put('product-detail/:productDetailId/update')
  @Roles(RoleType.Admin)
  async updateProductDetail(
    @Param() params: UpdateProductDetailParamsDto,
    @Body() body: UpdateProductDetailBodyDto,
    @Req() req: RequestModel,
  ) {
    const productDetail = await this.productDetailService.getProductDetailById(
      params.productDetailId,
    );

    return await this.productDetailService.updateProductDetail(
      productDetail,
      body.productId,
      body.bridgeWidth,
      body.frameWidth,
      body.lensHeight,
      body.lensWidth,
      body.templeLength,
      body.frameMaterial,
      body.frameShape,
      body.frameType,
      body.bridgeDesign,
      body.style,
      body.springHinges,
      body.weight,
      body.multifocal,
      req.user.userId,
    );
  }

  @Delete('product-detail/:productDetailId/delete')
  @Roles(RoleType.Admin)
  async deleteProductDetail(
    @Param() params: DeleteProductDetailParamsDto,
    @Req() req: RequestModel,
  ) {
    const productDetail = await this.productDetailService.getProductDetailById(
      params.productDetailId,
    );

    return await this.productDetailService.deleteProductDetail(
      productDetail,
      req.user.userId,
    );
  }
}
