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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ProductImageService } from './product-image.service';
import {
  CreateProductImageBodyDto,
  DeleteProductImageParamsDto,
  GetProductImageParamsDto,
  GetProductImagesByProductIdParamsDto,
  GetProductImagesQueryDto,
  UpdateProductImageBodyDto,
  UpdateProductImageParamsDto,
} from './dtos/product-image.dto';
import { RequestModel } from 'src/common/models/request.model';
import { ProductImageModel } from './models/product-image.model';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { ProductService } from 'src/product/product.service';

@Controller('api/v1')
@ApiTags('Product / Product Image')
@Roles(RoleType.Admin, RoleType.Employee)
export class ProductImageController {
  constructor(
    private readonly productImageService: ProductImageService,
    private readonly productService: ProductService,
  ) {}

  @Get('product-image/list')
  @ApiOperation({ summary: 'Get list of product images' })
  @ApiOkResponse({
    description: 'Successfully retrieved product images',
    type: PageList<ProductImageModel>,
  })
  async getProductImages(
    @Query() query: GetProductImagesQueryDto,
  ): Promise<PageList<ProductImageModel>> {
    return await this.productImageService.getProductImages(
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      undefined,
      undefined,
    );
  }

  @Get('product/:productId/product-image/list')
  async getProductImagesByProductId(
    @Param() params: GetProductImagesByProductIdParamsDto,
    @Query() query: GetProductImagesQueryDto,
  ): Promise<PageList<ProductImageModel>> {
    return await this.productImageService.getProductImagesByProductId(
      params.productId,
      new PaginationParamsModel(query.page, query.limit),
    );
  }

  @Get('product-image/:productImageId/detail')
  async getProductImageById(
    @Param() params: GetProductImageParamsDto,
  ): Promise<ProductImageModel> {
    return await this.productImageService.getProductImageById(
      params.productImageId,
    );
  }

  @Post('product-image/create')
  async createProductImage(
    @Req() req: RequestModel,
    @Body() body: CreateProductImageBodyDto,
  ): Promise<ProductImageModel> {
    return await this.productImageService.createProductImage(
      body.productId,
      body.imageUrl,
      req.user.userId,
    );
  }

  @Put('product-image/:productImageId/update')
  async updateProductImage(
    @Param() params: UpdateProductImageParamsDto,
    @Body() body: UpdateProductImageBodyDto,
    @Req() req: RequestModel,
  ): Promise<ProductImageModel> {
    const productImage = await this.productImageService.getProductImageById(
      params.productImageId,
    );

    return await this.productImageService.updateProductImage(
      productImage,
      body.imageUrl,
      req.user.userId,
    );
  }

  @Delete('product-image/:productImageId/delete')
  async deleteProductImage(
    @Param() params: DeleteProductImageParamsDto,
    @Req() req: RequestModel,
  ): Promise<boolean> {
    const productImage = await this.productImageService.getProductImageById(
      params.productImageId,
    );

    return await this.productImageService.deleteProductImage(
      productImage,
      req.user.userId,
    );
  }

  @Delete('product/:productId/product-image/delete-all')
  async deleteProductImagesByProductId(
    @Param() params: GetProductImagesByProductIdParamsDto,
    @Req() req: RequestModel,
  ): Promise<boolean> {
    const product = await this.productService.getProductById(params.productId);

    return await this.productImageService.deleteProductImagesByProductId(
      product,
      req.user.userId,
    );
  }
}
