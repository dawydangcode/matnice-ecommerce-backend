import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import {
  CreateProductBodyDto,
  GetProductByIdParamsDto,
} from './dtos/product.dto';
import { RequestModel } from 'src/common/models/request.model';

@Controller('api/v1/')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('products')
  async getProducts(@Query() query: PaginationParamsModel) {
    return await this.productService.getProducts(
      undefined,
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      undefined,
      undefined,
    );
  }

  @Get('product/:id/detail')
  async getProductById(@Param() params: GetProductByIdParamsDto) {
    return await this.productService.getProductById(params.productId);
  }

  @Post('product/create')
  async createProduct(
    @Req() req: RequestModel,
    @Body() body: CreateProductBodyDto,
  ) {
    return await this.productService.createProduct(
      body.productName,
      body.categoryId,
      body.brandId,
      body.gender,
      body.price,
      body.color,
      body.stock,
      body.description,
      req.user.userId,);
  }
}
