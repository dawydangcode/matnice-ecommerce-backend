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
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import {
  CategoryCreateBodyDto,
  GetCategoriesQueryDto,
  GetCategoryByIdParamsDto,
} from './dtos/category.dto';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { RequestModel } from 'src/common/models/request.model';

@Controller('api/v1/')
@ApiTags('Category')
@Roles(RoleType.Admin)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('category/list')
  async getCategoryList(@Query() query: GetCategoriesQueryDto) {
    return await this.categoryService.getCategories(
      undefined,
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      undefined,
    );
  }

  @Get('category/:categoryId/details')
  async getCategoryById(@Param() params: GetCategoryByIdParamsDto) {
    return await this.categoryService.getCategoryById(params.categoryId);
  }

  @Post('category/create')
  async createCategory(
    @Req() req: RequestModel,
    @Body() body: CategoryCreateBodyDto,
  ) {
    return await this.categoryService.createCategory(
      body.name,
      body.description,
      req.user.userId,
    );
  }

  @Put('category/:categoryId/update')
  async updateCategory(
    @Param() params: GetCategoryByIdParamsDto,
    @Body() body: CategoryCreateBodyDto,
    @Req() req: RequestModel,
  ) {
    const category = await this.categoryService.getCategoryById(
      params.categoryId,
    );

    return await this.categoryService.updateCategory(
      category,
      body.name,
      body.description,
      req.user.userId,
    );
  }

  @Delete('category/:categoryId/delete')
  async deleteCategory(
    @Param() params: GetCategoryByIdParamsDto,
    @Req() req: RequestModel,
  ) {
    const category = await this.categoryService.getCategoryById(
      params.categoryId,
    );

    return await this.categoryService.deleteCategory(category, req.user.userId);
  }
}
