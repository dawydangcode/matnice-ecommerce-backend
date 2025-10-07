import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductColorService } from './product-color.service';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { RequestModel } from 'src/common/models/request.model';
import {
  CreateProductColorBodyDto,
  DeleteProductColorParamsDto,
  GetProductColorByIdParamsDto,
  UpdateProductColorBodyDto,
  UpdateProductColorParamsDto,
} from './dtos/product-color.dto';
import { DeleteProductDetailParamsDto } from '../product-detail/dtos/product-detail.dto';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';

@Controller('api/v1/')
export class ProductColorController {
  constructor(private readonly productColorService: ProductColorService) {}

  @Get('product-color/list')
  @Public()
  async getProductColors(
    @Param('productId') productId: number,
    @Query() pagination: PaginationParamsModel,
  ) {
    return await this.productColorService.getProductColors(
      productId,
      pagination,
    );
  }

  @Get('/product-color/:colorId/detail')
  @Public()
  async getProductColor(@Param() params: GetProductColorByIdParamsDto) {
    return await this.productColorService.getProductColorById(
      params.productColorId,
    );
  }

  @Post('product-color/create')
  @Roles(RoleType.Admin)
  async createProductColor(
    @Body() body: CreateProductColorBodyDto,
    @Req() req: RequestModel,
  ) {
    return await this.productColorService.createProductColor(
      body.productId,
      body.colorName,
      body.productVariantName,
      body.productNumber,
      body.stock,
      body.isThumbnail,
      req.user.userId,
    );
  }

  @Put('product-color/:productColorId/update')
  @Roles(RoleType.Admin)
  async updateProductColor(
    @Param() params: UpdateProductColorParamsDto,
    @Body() body: UpdateProductColorBodyDto,
    @Req() req: RequestModel,
  ) {
    const productColor = await this.productColorService.getProductColorById(
      params.productColorId,
    );

    return await this.productColorService.updateProductColor(
      productColor,
      body.colorName,
      body.productVariantName,
      body.productNumber,
      body.stock,
      body.isThumbnail,
      req.user.userId,
    );
  }

  @Delete('product-color/:productColorId/delete')
  @Roles(RoleType.Admin)
  async deleteProductColor(
    @Param() params: DeleteProductColorParamsDto,
    @Req() req: RequestModel,
  ) {
    const productColor = await this.productColorService.getProductColorById(
      params.productColorId,
    );

    return await this.productColorService.deleteProductColor(
      productColor,
      req.user.userId,
    );
  }

  @Get('product-color/:productId/product')
  @Public()
  async getProductColorByProductId(@Param('productId') productId: number) {
    return await this.productColorService.getProductColorByProductId(productId);
  }
}
