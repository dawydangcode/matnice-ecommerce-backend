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
import { BrandService } from './brand.service';
import {
  CreateBrandBodyDto,
  DeleteBrandParamsDto,
  GetBrandByIdParamsDto,
  GetBrandsQueryDto,
  UpdateBrandBodyDto,
  UpdateBrandParamsDto,
} from './dtos/brand.dto';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { RequestModel } from 'src/common/models/request.model';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';

@Controller('api/v1')
@ApiTags('Brand')
@Roles(RoleType.Admin)
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('brand/list')
  async getBrands(@Query() query: GetBrandsQueryDto) {
    return await this.brandService.getBrands(
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      undefined,
      undefined,
    );
  }

  @Get('brand/:brandId/detail')
  async getBrandById(@Param() params: GetBrandByIdParamsDto) {
    return await this.brandService.getBrandById(params.brandId);
  }

  @Post('brand/create')
  async createBrand(
    @Req() req: RequestModel,
    @Body() body: CreateBrandBodyDto,
  ) {
    return await this.brandService.createBrand(
      body.name,
      body.description,
      req.user.userId,
    );
  }

  @Put('brand/:brandId/update')
  async updateBrand(
    @Req() req: RequestModel,
    @Param() params: UpdateBrandParamsDto,
    @Body() body: UpdateBrandBodyDto,
  ) {
    const brand = await this.brandService.getBrandById(params.brandId);
    return await this.brandService.updateBrand(
      brand,
      body.name,
      body.description,
      req.user.userId,
    );
  }

  @Delete('brand/:brandId/delete')
  async deleteBrand(
    @Req() req: RequestModel,
    @Param() params: DeleteBrandParamsDto,
  ) {
    const brand = await this.brandService.getBrandById(params.brandId);
    return await this.brandService.deleteBrand(brand, req.user.userId);
  }

  @Public()
  @Get('brand/getBrandsForFilter')
  async getBrandsForFilter() {
    return await this.brandService.getBrandsForFilter();
  }
}
