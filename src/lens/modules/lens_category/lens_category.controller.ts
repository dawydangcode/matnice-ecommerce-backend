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

@ApiTags('Lens Category')
@Controller('api/v1/')
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

  @Get('lens-category/:lensCategoryId')
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
      body.categoryId,
      req.user.userId,
    );
  }

  @Delete('lens-category/:lensCategoryId/delete')
  async deleteLensCategory(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestModel,
  ) {
    return this.lensCategoryService.remove(id, req.user.userId);
  }
}
