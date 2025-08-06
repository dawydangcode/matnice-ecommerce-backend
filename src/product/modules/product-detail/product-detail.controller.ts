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
import { JwtAuthGuard } from 'src/middlewares/guards/jwt-auth.guard';
import { RequestModel } from 'src/common/models/request.model';

@Controller('products/:productId/colors/:colorId/details')
@UseGuards(JwtAuthGuard)
export class ProductDetailController {
  constructor(private readonly productDetailService: ProductDetailService) {}

  @Get()
  async getProductDetail(@Param('colorId') colorId: number) {
    return await this.productDetailService.getProductDetailByColorId(colorId);
  }

  @Post()
  async createProductDetail(
    @Param('colorId') colorId: number,
    @Body() createDto: CreateProductDetailDto,
    @Req() req: RequestModel,
  ) {
    return await this.productDetailService.createProductDetail(
      colorId,
      createDto,
      req.user.userId,
    );
  }

  @Put()
  async updateProductDetail(
    @Param('colorId') colorId: number,
    @Body() updateDto: UpdateProductDetailDto,
    @Req() req: RequestModel,
  ) {
    return await this.productDetailService.updateProductDetail(
      colorId,
      updateDto,
      req.user.userId,
    );
  }

  @Delete()
  async deleteProductDetail(
    @Param('colorId') colorId: number,
    @Req() req: RequestModel,
  ) {
    return await this.productDetailService.deleteProductDetail(
      colorId,
      req.user.userId,
    );
  }
}
