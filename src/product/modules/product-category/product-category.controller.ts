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
import { ProductCategoryService } from './product-category.service';
import { RequestModel } from 'src/common/models/request.model';
import { ProductCategoryModel } from './models/product-category.model';
import {
  CreateProductCategoryDto,
  UpdateProductCategoriesDto,
  ProductCategoryQueryDto,
} from './dtos/product-category.dto';

@ApiTags('Product Category')
@Controller('api/v1/product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Get('list')
  async getProductCategories(
    @Query() query: ProductCategoryQueryDto,
  ): Promise<ProductCategoryModel[]> {
    return await this.productCategoryService.getProductCategories(
      query.productId,
      query.categoryId,
    );
  }

  @Get('product/:productId/categories')
  async getCategoriesByProduct(
    @Param('productId') productId: number,
  ): Promise<number[]> {
    return await this.productCategoryService.getCategoriesByProductId(
      productId,
    );
  }

  @Get('category/:categoryId/products')
  async getProductsByCategory(
    @Param('categoryId') categoryId: number,
  ): Promise<number[]> {
    return await this.productCategoryService.getProductsByCategoryId(
      categoryId,
    );
  }

  @Post('create')
  async createProductCategory(
    @Req() req: RequestModel,
    @Body() body: CreateProductCategoryDto,
  ): Promise<ProductCategoryModel> {
    return await this.productCategoryService.createProductCategory(
      body.productId,
      body.categoryId,
      req.user.userId,
    );
  }

  @Put('product/:productId/categories')
  async updateProductCategories(
    @Req() req: RequestModel,
    @Param('productId') productId: number,
    @Body() body: UpdateProductCategoriesDto,
  ): Promise<ProductCategoryModel[]> {
    return await this.productCategoryService.updateProductCategories(
      productId,
      body.categoryIds,
      req.user.userId,
    );
  }

  @Delete('product/:productId/category/:categoryId')
  async deleteProductCategory(
    @Req() req: RequestModel,
    @Param('productId') productId: number,
    @Param('categoryId') categoryId: number,
  ): Promise<boolean> {
    return await this.productCategoryService.deleteProductCategory(
      productId,
      categoryId,
      req.user.userId,
    );
  }

  @Get('product/:productId/category/:categoryId/validate')
  async validateProductCategory(
    @Param('productId') productId: number,
    @Param('categoryId') categoryId: number,
  ): Promise<{ exists: boolean }> {
    const exists = await this.productCategoryService.validateProductCategory(
      productId,
      categoryId,
    );
    return { exists };
  }
}
