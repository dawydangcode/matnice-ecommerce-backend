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
import { JwtAuthGuard } from 'src/middlewares/guards/jwt-auth.guard';
import { RequestModel } from 'src/common/models/request.model';
import {
  CreateProductColorBodyDto,
  UpdateProductColorBodyDto,
} from './dtos/product-color.dto';

@Controller('products/:productId/colors')
@UseGuards(JwtAuthGuard)
export class ProductColorController {
  constructor(private readonly productColorService: ProductColorService) {}

  @Get()
  async getProductColors(
    @Param('productId') productId: number,
    @Query() pagination: PaginationParamsModel,
  ) {
    return await this.productColorService.getProductColors(
      productId,
      pagination,
    );
  }

  @Get(':colorId')
  async getProductColor(@Param('colorId') colorId: number) {
    return await this.productColorService.getProductColorById(colorId);
  }

  @Post()
  async createProductColor(
    @Param() productId: number,
    @Body() body: CreateProductColorBodyDto,
    @Req() req: RequestModel,
  ) {
    return await this.productColorService.createProductColor(
      productId,
      body.colorName,
      req.user.userId,
    );
  }

  @Put(':colorId')
  async updateProductColor(
    @Param('colorId') colorId: number,
    @Body() body: UpdateProductColorBodyDto,
    @Req() req: RequestModel,
  ) {
    return await this.productColorService.updateProductColor(
      colorId,
      body.colorName,
      req.user.userId,
    );
  }

  @Delete(':colorId')
  async deleteProductColor(
    @Param('colorId') colorId: number,
    @Req() req: RequestModel,
  ) {
    return await this.productColorService.deleteProductColor(
      colorId,
      req.user.userId,
    );
  }
}
