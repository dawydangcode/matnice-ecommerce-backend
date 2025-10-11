import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import {
  AddToWishlistBodyDto,
  CheckWishlistParamsDto,
  GetWishlistQueryDto,
  RemoveFromWishlistParamsDto,
} from './dtos/wishlist-item.dto';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { RequestModel } from 'src/common/models/request.model';

@Controller('api/v1/wishlist')
@ApiTags('Wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @Roles(RoleType.Admin, RoleType.Employee, RoleType.User)
  @ApiOperation({ summary: 'Get user wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist retrieved successfully' })
  async getWishlist(
    @Req() req: RequestModel,
    @Query() query: GetWishlistQueryDto,
  ) {
    const pagination =
      query.page && query.limit
        ? new PaginationParamsModel(query.page, query.limit)
        : undefined;

    return await this.wishlistService.getWishlist(
      req.user.userId,
      query.itemType,
      pagination,
    );
  }

  @Post('add')
  @Roles(RoleType.Admin, RoleType.Employee, RoleType.User)
  @ApiOperation({ summary: 'Add item to wishlist' })
  @ApiResponse({
    status: 201,
    description: 'Item added to wishlist successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input' })
  @ApiResponse({ status: 409, description: 'Item already exists in wishlist' })
  async addToWishlist(
    @Req() req: RequestModel,
    @Body() body: AddToWishlistBodyDto,
  ) {
    return await this.wishlistService.addToWishlist(
      req.user.userId,
      body.itemType,
      body.productId,
      body.lensId,
      body.selectedColorId,
      req.user.userId,
    );
  }

  @Delete(':id')
  @Roles(RoleType.Admin, RoleType.Employee, RoleType.User)
  @ApiOperation({ summary: 'Remove item from wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from wishlist successfully',
  })
  @ApiResponse({ status: 400, description: 'Wishlist item not found' })
  async removeFromWishlist(
    @Req() req: RequestModel,
    @Param() params: RemoveFromWishlistParamsDto,
  ) {
    return await this.wishlistService.removeFromWishlist(
      req.user.userId,
      params.id,
      req.user.userId,
    );
  }

  @Get('check/:itemType/:itemId')
  @Roles(RoleType.Admin, RoleType.Employee, RoleType.User)
  @ApiOperation({ summary: 'Check if item is in wishlist' })
  @ApiResponse({ status: 200, description: 'Check result returned' })
  async checkItemInWishlist(
    @Req() req: RequestModel,
    @Param() params: CheckWishlistParamsDto,
  ) {
    const isInWishlist = await this.wishlistService.checkItemInWishlist(
      req.user.userId,
      params.itemType,
      params.itemId,
    );

    return {
      isInWishlist,
      itemType: params.itemType,
      itemId: params.itemId,
    };
  }

  @Get('count')
  @Roles(RoleType.Admin, RoleType.Employee, RoleType.User)
  @ApiOperation({ summary: 'Get wishlist items count' })
  @ApiResponse({
    status: 200,
    description: 'Wishlist count retrieved successfully',
  })
  async getWishlistCount(@Req() req: RequestModel) {
    const count = await this.wishlistService.getWishlistCount(req.user.userId);

    return {
      count,
      userId: req.user.userId,
    };
  }
}
