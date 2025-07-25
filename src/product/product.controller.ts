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
import { ProductService } from './product.service';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import {
  CreateProductBodyDto,
  DeleteProductParamsDto,
  GetProductByIdParamsDto,
  GetProductsQueryDto,
  UpdateProductBodyDto,
  UpdateProductParamsDto,
} from './dtos/product.dto';
import { RequestModel } from 'src/common/models/request.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';

@Controller('api/v1/')
@ApiTags('Product')
@Roles(RoleType.Admin)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('products')
  async getProducts(@Query() query: GetProductsQueryDto) {
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
      req.user.userId,
    );
  }

  @Put('product/:productId/update')
  async updateProduct(
    @Req() req: RequestModel,
    @Param() params: UpdateProductParamsDto,
    @Body() body: UpdateProductBodyDto,
  ) {
    const product = await this.productService.getProductById(params.productId);
    return await this.productService.updateProduct(
      product,
      body.productType,
      body.productName,
      body.categoryId,
      body.brandId,
      body.color,
      body.gender,
      body.price,
      body.stock,
      body.description,
      req.user.userId,
    );
  }

  @Delete('product/:productId/delete')
  async deleteProduct(
    @Req() req: RequestModel,
    @Param() params: DeleteProductParamsDto,
  ) {
    const product = await this.productService.getProductById(params.productId);
    return await this.productService.deleteProduct(product, req.user.userId);
  }
}
