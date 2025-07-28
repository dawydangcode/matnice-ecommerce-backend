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
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { ProductDetailService } from './product-detail.service';
import { ProductService } from 'src/product/product.service';
import { GetProductsQueryDto } from 'src/product/dtos/product.dto';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import {
  CreateProductDetailBodyDto,
  DeleteProductDetailParamsDto,
  GetProductDetailByIdParamsDto,
  UpdateProductDetailBodyDto,
  UpdateProductDetailParamsDto,
} from './dtos/product-detail.dto';
import { RequestModel } from 'src/common/models/request.model';

@Controller('api/v1')
@ApiTags('Product / Product Detail')
@Roles(RoleType.Admin)
export class ProductDetailController {
  constructor(
    private readonly productDetailService: ProductDetailService,
    private readonly productService: ProductService,
  ) {}

  @Get('product-detail/list')
  async getProductDetails(@Query() query: GetProductsQueryDto) {
    return this.productDetailService.getProductDetails(
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      undefined,
      undefined,
    );
  }

  @Get('product-detail/:productDetailId/detail')
  async getProductDetailById(@Param() params: GetProductDetailByIdParamsDto) {
    return this.productDetailService.getProductDetailById(
      params.productDetailId,
    );
  }

  @Post('product-detail/create')
  async createProductDetail(
    @Req() req: RequestModel,
    @Body() body: CreateProductDetailBodyDto,
  ) {
    const product = await this.productService.getProductById(body.productId);
    return this.productDetailService.createProductDetail(
      product,
      body.productNumber,
      body.color,
      body.bridgeWidth,
      body.frameWidth,
      body.lensHeight,
      body.lensWidth,
      body.templeLength,
      body.frameColor,
      body.frameMaterial,
      body.frameShape,
      body.frameType,
      body.springHinge,
      req.user.userId,
    );
  }

  @Put('product-detail/:productDetailId/update')
  async updateProductDetail(
    @Req() req: RequestModel,
    @Param() params: UpdateProductDetailParamsDto,
    @Body() body: UpdateProductDetailBodyDto,
  ) {
    const productDetail = await this.productDetailService.getProductDetailById(
      params.productDetailId,
    );
    return this.productDetailService.updateProductDetail(
      productDetail,
      body.productId,
      body.productNumber,
      body.color,
      body.bridgeWidth,
      body.frameWidth,
      body.lensWidth,
      body.lensHeight,
      body.templeLength,
      body.frameColor,
      body.frameMaterial,
      body.frameShape,
      body.frameType,
      body.springHinge,
      req.user.userId,
    );
  }

  @Delete('product-detail/:productDetailId/delete')
  async deleteProductDetail(
    @Req() req: RequestModel,
    @Param() params: DeleteProductDetailParamsDto,
  ) {
    const productDetail = await this.productDetailService.getProductDetailById(
      params.productDetailId,
    );
    return this.productDetailService.deleteProductDetail(
      productDetail,
      req.user.userId,
    );
  }
}
