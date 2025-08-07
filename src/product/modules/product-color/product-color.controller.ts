import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductColorService } from './product-color.service';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { RequestModel } from 'src/common/models/request.model';
import {
  CreateProductColorBodyDto,
  UpdateProductColorBodyDto,
} from './dtos/product-color.dto';

@Controller('api/v1/products/:productId/colors')
export class ProductColorController {
  constructor(private readonly productColorService: ProductColorService) {}

  @Get()
  async getProductColors(
    @Param('productId') productId: number,
    @Query() pagination: PaginationParamsModel,
  ) {
    return await this.productColorService.getProductColors(
      productId,
      pagination,
    );
  }

  @Get(':colorId')
  async getProductColor(
    @Param('productId') productId: number,
    @Param('colorId') colorId: number,
  ) {
    return await this.productColorService.getProductColorById(colorId);
  }

  @Post()
  async createProductColor(
    @Param('productId') productId: number,
    @Body() body: CreateProductColorBodyDto,
    @Req() req: RequestModel,
  ) {
    return await this.productColorService.createProductColor(
      productId,
      body.colorName,
      req.user.userId,
    );
  }

  @Put(':colorId')
  async updateProductColor(
    @Param('productId') productId: number,
    @Param('colorId') colorId: number,
    @Body() body: UpdateProductColorBodyDto,
    @Req() req: RequestModel,
  ) {
    const productColor =
      await this.productColorService.getProductColorById(colorId);

    return await this.productColorService.updateProductColor(
      productColor,
      body.colorName,
      req.user.userId,
    );
  }

  @Delete(':colorId')
  async deleteProductColor(
    @Param('productId') productId: number,
    @Param('colorId') colorId: number,
    @Req() req: RequestModel,
  ) {
    return await this.productColorService.deleteProductColor(
      colorId,
      req.user.userId,
    );
  }
}
