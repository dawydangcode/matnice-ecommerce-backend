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
  CreateProductDetailDto,
  UpdateProductDetailDto,
} from './dtos/product-detail.dto';
import { RequestModel } from 'src/common/models/request.model';

@Controller('api/v1/')
export class ProductDetailController {
  constructor(private readonly productDetailService: ProductDetailService) {}

  @Get('products-detail/:productDetailId/details')
  async getProductDetail(@Param() productDetailId: number) {
    return await this.productDetailService.getProductDetailByProductId(
      productDetailId,
    );
  }

  @Post('product-detail/create')
  async createProductDetail(
    @Body() createDto: CreateProductDetailDto,
    @Req() req: RequestModel,
  ) {
    return await this.productDetailService.createProductDetail(
      createDto.productId, // Get productId from request body
      createDto,
      req.user.userId,
    );
  }

  @Put('product-detail/:productDetailId/update')
  async updateProductDetail(
    @Param('productDetailId') productDetailId: number,
    @Body() updateDto: UpdateProductDetailDto,
    @Req() req: RequestModel,
  ) {
    // Get productId from the existing detail
    const existingDetail =
      await this.productDetailService.getProductDetailByProductId(
        productDetailId,
      );
    if (!existingDetail) {
      throw new Error('Product detail not found');
    }

    return await this.productDetailService.updateProductDetail(
      existingDetail.productId,
      updateDto,
      req.user.userId,
    );
  }

  @Delete('product-detail/:productDetailId/delete')
  async deleteProductDetail(
    @Param('productDetailId') productDetailId: number,
    @Req() req: RequestModel,
  ) {
    // Get productId from the existing detail
    const existingDetail =
      await this.productDetailService.getProductDetailByProductId(
        productDetailId,
      );
    if (!existingDetail) {
      throw new Error('Product detail not found');
    }

    return await this.productDetailService.deleteProductDetail(
      existingDetail.productId,
      req.user.userId,
    );
  }
}
