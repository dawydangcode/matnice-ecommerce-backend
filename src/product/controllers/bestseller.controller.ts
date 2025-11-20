import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BestsellerService } from '../services/bestseller.service';
import {
  GetBestsellersQueryDto,
  CreateBestsellerDto,
  UpdateBestsellerDto,
  BestsellerParamsDto,
  SyncSalesDataDto,
} from '../dtos/bestseller.dto';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { RequestModel } from 'src/common/models/request.model';

@Controller('api/v1/bestsellers')
@ApiTags('Bestsellers')
export class BestsellerController {
  constructor(private readonly bestsellerService: BestsellerService) {}

  /**
   * Public endpoint: Get bestsellers for homepage
   */
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get bestsellers (public)' })
  async getBestsellers(@Query() query: GetBestsellersQueryDto) {
    return await this.bestsellerService.getBestsellers(
      query.limit,
      query.pinnedOnly,
    );
  }

  /**
   * Admin endpoint: Get all bestsellers with details
   */
  @Get('admin/all')
  @Roles(RoleType.Admin, RoleType.Employee)
  @ApiOperation({ summary: 'Get all bestsellers (admin)' })
  async getAllBestsellers() {
    return await this.bestsellerService.getAllBestsellers();
  }

  /**
   * Admin endpoint: Create a new bestseller
   */
  @Post('admin')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Create bestseller (admin)' })
  async createBestseller(
    @Req() req: RequestModel,
    @Body() body: CreateBestsellerDto,
  ) {
    return await this.bestsellerService.createBestseller(
      body.productId,
      body.isPinned || false,
      body.customPriority,
      body.displayOrder,
      body.notes,
      req.user.userId,
    );
  }

  /**
   * Admin endpoint: Update bestseller
   */
  @Put('admin/:id')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Update bestseller (admin)' })
  async updateBestseller(
    @Req() req: RequestModel,
    @Param() params: BestsellerParamsDto,
    @Body() body: UpdateBestsellerDto,
  ) {
    return await this.bestsellerService.updateBestseller(
      params.id,
      body,
      req.user.userId,
    );
  }

  /**
   * Admin endpoint: Delete bestseller
   */
  @Delete('admin/:id')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Delete bestseller (admin)' })
  async deleteBestseller(@Param() params: BestsellerParamsDto) {
    await this.bestsellerService.deleteBestseller(params.id);
    return { message: 'Bestseller deleted successfully' };
  }

  /**
   * Admin endpoint: Sync sales data (manual trigger)
   */
  @Post('admin/sync-sales')
  @Roles(RoleType.Admin)
  @ApiOperation({ summary: 'Sync sales data (admin)' })
  async syncSalesData(@Body() body: SyncSalesDataDto) {
    await this.bestsellerService.syncSalesData(body.days || 30);
    return { message: 'Sales data sync initiated' };
  }
}
