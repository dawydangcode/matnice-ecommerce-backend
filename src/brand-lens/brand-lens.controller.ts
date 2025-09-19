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
  CreateBrandLensBodyDto,
  DeleteBrandParamsDto,
  GetBrandLensByIdParamsDto,
  GetBrandsLensQueryDto,
  UpdateBrandBodyDto,
  UpdateBrandLensParamsDto,
} from './dtos/brand-lens.dto';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { RequestModel } from 'src/common/models/request.model';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';
import { BrandLensService } from './brand-lens.service';

@Controller('api/v1')
@ApiTags('Brand Lens')
export class BrandLensController {
  constructor(private readonly brandLensService: BrandLensService) {}

  @Get('brand-lens/list')
  @Roles(RoleType.Admin)
  async getBrandsLens(@Query() query: GetBrandsLensQueryDto) {
    return await this.brandLensService.getBrandsLens(
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      undefined,
      undefined,
    );
  }

  @Get('brand-lens/:brandLensId/detail')
  @Roles(RoleType.Admin)
  async getBrandById(@Param() params: GetBrandLensByIdParamsDto) {
    return await this.brandLensService.getBrandLensById(params.brandLensId);
  }

  @Post('brand-lens/create')
  @Roles(RoleType.Admin)
  async createBrandLens(
    @Req() req: RequestModel,
    @Body() body: CreateBrandLensBodyDto,
  ) {
    return await this.brandLensService.createBrandLens(
      body.name,
      body.description,
      req.user.userId,
    );
  }

  @Put('brand-lens/:brandLensId/update')
  @Roles(RoleType.Admin)
  async updateBrand(
    @Req() req: RequestModel,
    @Param() params: UpdateBrandLensParamsDto,
    @Body() body: UpdateBrandBodyDto,
  ) {
    const brandLens = await this.brandLensService.getBrandLensById(
      params.brandLensId,
    );
    return await this.brandLensService.updateBrandLens(
      brandLens,
      body.name,
      body.description,
      req.user.userId,
    );
  }

  @Delete('brand-lens/:brandLensId/delete')
  @Roles(RoleType.Admin)
  async deleteBrand(
    @Req() req: RequestModel,
    @Param() params: DeleteBrandParamsDto,
  ) {
    const brandLens = await this.brandLensService.getBrandLensById(
      params.brandLensId,
    );

    return await this.brandLensService.deleteBrand(brandLens, req.user.userId);
  }

  @Public()
  @Get('brand-lens/getBrandsForFilter')
  async getBrandsForFilter() {
    return await this.brandLensService.getBrandsLensForFilter();
  }

  // New endpoint for frontend navigation dropdown
  @Get('brand-lens')
  @Public()
  async getBrandLens() {
    const result = await this.brandLensService.getBrandsLens(
      undefined,
      new PaginationParamsModel(1, 100), // Get first 100 brands
      undefined,
      undefined,
    );
    return result.data;
  }
}
