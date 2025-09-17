import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LensBrandService } from './lens_brand.service';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import {
  CreateLensBrandBodyDto,
  DeleteLensBrandParamsDto,
  GetLensBrandByIdParamsDto,
  GetLensBrandsQueryDto,
  UpdateLensBrandBodyDto,
  UpdateLensBrandParamsDto,
} from './dtos/lens-brand.dto';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { RequestModel } from 'src/common/models/request.model';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';

@Controller('api/v1/')
@ApiTags('Lens Brand')
export class LensBrandController {
  constructor(private readonly lensBrandService: LensBrandService) {}

  @Get('lens-brand/list')
  @Roles(RoleType.Admin)
  async getBrands(@Query() query: GetLensBrandsQueryDto) {
    return await this.lensBrandService.getLensBrands(
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      undefined,
      undefined,
    );
  }

  @Get('lens-brand/:lensBrandId/detail')
  @Roles(RoleType.Admin)
  async getBrandById(@Param() params: GetLensBrandByIdParamsDto) {
    return await this.lensBrandService.getLensBrandById(params.lensBrandId);
  }

  @Post('lens-brand/create')
  @Roles(RoleType.Admin)
  async createLensBrand(
    @Req() req: RequestModel,
    @Body() body: CreateLensBrandBodyDto,
  ) {
    return await this.lensBrandService.createLensBrand(
      body.name,
      body.description,
      req.user.userId,
    );
  }

  @Put('lens-brand/:lensBrandId/update')
  @Roles(RoleType.Admin)
  async updateLensBrand(
    @Req() req: RequestModel,
    @Param() params: UpdateLensBrandParamsDto,
    @Body() body: UpdateLensBrandBodyDto,
  ) {
    const brand = await this.lensBrandService.getLensBrandById(
      params.lensBrandId,
    );
    return await this.lensBrandService.updateLensBrand(
      brand,
      body.name,
      body.description,
      req.user.userId,
    );
  }

  @Delete('lens-brand/:LensBrandId/delete')
  @Roles(RoleType.Admin)
  async deleteLensBrand(
    @Req() req: RequestModel,
    @Param() params: DeleteLensBrandParamsDto,
  ) {
    const brand = await this.lensBrandService.getLensBrandById(
      params.lensBrandId,
    );
    return await this.lensBrandService.deleteBrand(brand, req.user.userId);
  }

  @Public()
  @Get('lens-brand/getLensBrandsForFilter')
  async getBrandsForFilter() {
    return await this.lensBrandService.getLensBrandsForFilter();
  }
}
