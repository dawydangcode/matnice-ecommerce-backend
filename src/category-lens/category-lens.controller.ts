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
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { RequestModel } from 'src/common/models/request.model';
import { CategoryLensService } from './category-lens.service';
import {
  CreateCategoryLensBodyDto,
  DeleteCategoryLensParamsDto,
  GetCategoriesLensQueryDto,
  GetCategoryLensByIdParamsDto,
} from './dtos/category-lens.dto';

@Controller('api/v1/')
@ApiTags('Category Lens')
@Roles(RoleType.Admin)
export class CategoryLensController {
  constructor(private readonly categoryLensService: CategoryLensService) {}

  @Get('category-lens/list')
  async getCategoryLensList(@Query() query: GetCategoriesLensQueryDto) {
    return await this.categoryLensService.getCategoriesLens(
      undefined,
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      undefined,
    );
  }

  @Get('category-lens/:categoryLensId/details')
  async getCategoryLensById(@Param() params: GetCategoryLensByIdParamsDto) {
    return await this.categoryLensService.getCategoryLensById(
      params.categoryLensId,
    );
  }

  @Post('category-lens/create')
  async createCategoryLens(
    @Req() req: RequestModel,
    @Body() body: CreateCategoryLensBodyDto,
  ) {
    return await this.categoryLensService.createCategoryLens(
      body.name,
      body.description,
      req.user.userId,
    );
  }

  @Put('category-lens/:categoryLensId/update')
  async updateCategory(
    @Param() params: GetCategoryLensByIdParamsDto,
    @Body() body: CreateCategoryLensBodyDto,
    @Req() req: RequestModel,
  ) {
    const categoryLens = await this.categoryLensService.getCategoryLensById(
      params.categoryLensId,
    );

    return await this.categoryLensService.updateCategoryLens(
      categoryLens,
      body.name,
      body.description,
      req.user.userId,
    );
  }

  @Delete('category-lens/:categoryLensId/delete')
  async deleteCategory(
    @Param() params: DeleteCategoryLensParamsDto,
    @Req() req: RequestModel,
  ) {
    const categoryLens = await this.categoryLensService.getCategoryLensById(
      params.categoryLensId,
    );

    return await this.categoryLensService.deleteCategoryLens(
      categoryLens,
      req.user.userId,
    );
  }
}
