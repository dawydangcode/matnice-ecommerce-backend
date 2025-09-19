import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { LensCategoryService } from './lens_category.service';
import {
  CreateLensCategoryBodyDto,
  GetLensCategoryByLensIdParamsDto,
  LensCategoryFilterDto,
} from './dtos/lens_category.dto';
import { RequestModel } from 'src/common/models/request.model';
import { GetCategoriesQueryDto } from 'src/category/dtos/category.dto';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';

@ApiTags('Lens Category')
@Controller('api/v1/')
@Roles(RoleType.Admin)
export class LensCategoryController {
  constructor(private readonly lensCategoryService: LensCategoryService) {}

  @Get('lens-category/list')
  async getLensCategories(@Query() query: GetCategoriesQueryDto) {
    return this.lensCategoryService.getLensCategories(
      undefined,
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      undefined,
    );
  }

  @Public()
  @Get('lens-category/:lensCategoryLensId')
  async getLensCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.lensCategoryService.findOne(id);
  }

  @Get('lens/:lensId')
  async getLenCategoryByLensId(
    @Param() params: GetLensCategoryByLensIdParamsDto,
  ) {
    return this.lensCategoryService.findByLensId(params.lensId);
  }

  @Post('lens-category/create')
  async createLensCategory(
    @Body() body: CreateLensCategoryBodyDto,
    @Req() req: RequestModel,
  ) {
    return this.lensCategoryService.createLensCategory(
      body.lensId,
      body.categoryLensId,
      req.user.userId,
    );
  }

  @Delete('lens-category/:lenscategoryLensId/delete')
  async deleteLensCategory(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestModel,
  ) {
    return this.lensCategoryService.remove(id, req.user.userId);
  }

  // New endpoint for frontend navigation dropdown - matches what frontend expects
  @Get('lens-categories')
  @Public()
  async getLensCategoriesForNavigation() {
    const result = await this.lensCategoryService.getLensCategories(
      undefined,
      undefined,
      undefined,
      new PaginationParamsModel(1, 100), // Get first 100 categories
      undefined,
    );
    return result.data;
  }
}
