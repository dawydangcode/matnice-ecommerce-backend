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
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';

@ApiTags('Product Category')
@Controller('api/v1/product-category')
export class ProductCategoryController {
  @Get('product/:productId/categories/details')
  @Public()
  async getCategoriesWithDetailsByProduct(
    @Param('productId') productId: number,
  ): Promise<any[]> {
    return await this.productCategoryService.getCategoriesWithDetailsByProductId(
      productId,
    );
  }
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Get('list')
  @Public()
  async getProductCategories(
    @Query() query: ProductCategoryQueryDto,
  ): Promise<ProductCategoryModel[]> {
    return await this.productCategoryService.getProductCategories(
      query.productId,
      query.categoryId,
    );
  }

  @Get('product/:productId/categories')
  @Public()
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
  @Roles(RoleType.Admin)
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
  @Roles(RoleType.Admin)
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
  @Roles(RoleType.Admin)
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
  ): Promise<boolean> {
    await this.productCategoryService.validateProductCategory(
      productId,
      categoryId,
    );

    return true;
  }
}
