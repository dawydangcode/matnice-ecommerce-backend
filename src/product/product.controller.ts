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
import { ProductSchedulerService } from './services/product-scheduler.service';

@Controller('api/v1/')
@ApiTags('Product')
@Roles(RoleType.Admin)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productSchedulerService: ProductSchedulerService,
  ) {}

  @Get('products/list')
  async getProducts(@Query() query: GetProductsQueryDto) {
    return await this.productService.getProducts(
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      undefined,
      ['brand', 'productDetail', 'productColors'],
    );
  }

  @Get('product/:productId/detail')
  async getProductById(@Param() params: GetProductByIdParamsDto) {
    return await this.productService.getProductById(params.productId);
  }

  @Get('product/:productId/with-categories')
  async getProductWithCategories(@Param() params: GetProductByIdParamsDto) {
    return await this.productService.getProductWithCategories(params.productId);
  }

  @Post('product/create')
  async createProduct(
    @Req() req: RequestModel,
    @Body() body: CreateProductBodyDto,
  ) {
    return await this.productService.createProduct(
      body.productName,
      body.productType,
      body.brandId,
      body.gender,
      body.price,
      body.description,
      body.isSustainable,
      body.isNew,
      body.isBoutique,
      body.categoryIds,
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
      body.brandId,
      body.gender,
      body.price,
      body.description,
      body.isSustainable,
      body.isNew,
      body.isBoutique,
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

  @Post('products/update-expired-new')
  async updateExpiredNewProducts() {
    const count = await this.productService.updateExpiredNewProducts();
    return {
      message: `Updated ${count} expired products`,
      updatedCount: count,
    };
  }

  @Get('products/expiring-soon')
  async getProductsExpiringSoon() {
    return await this.productService.getProductsExpiringSoon();
  }

  @Post('products/run-scheduler-now')
  async runSchedulerNow() {
    const result =
      await this.productSchedulerService.runExpiredProductsUpdateNow();
    return {
      message: 'Scheduler executed successfully',
      ...result,
    };
  }
}
