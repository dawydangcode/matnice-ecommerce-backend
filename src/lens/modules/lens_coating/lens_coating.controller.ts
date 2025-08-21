import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  LensCoatingService,
  LensCoatingResponse,
} from './lens_coating.service';
import { LensCoatingModel } from './models/lens_coating.model';
import {
  CreateLensCoatingDto,
  UpdateLensCoatingDto,
  LensCoatingFiltersDto,
  LensCoatingParamsDto,
} from './dtos/lens_coating.dto';
import { RequestModel } from '../../../common/models/request.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';

@ApiTags('Lens Coating')
@Controller('api/v1/lens-coating')
@Roles(RoleType.Admin)
export class LensCoatingController {
  constructor(private readonly lensCoatingService: LensCoatingService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get all lens coatings with pagination and search' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'anti-reflective' })
  @ApiResponse({
    status: 200,
    description: 'List of lens coatings retrieved successfully',
  })
  async findAll(
    @Query() filters: LensCoatingFiltersDto,
  ): Promise<LensCoatingResponse> {
    return await this.lensCoatingService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lens coating by ID' })
  @ApiParam({ name: 'id', description: 'Lens coating ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Lens coating retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Lens coating not found' })
  async findById(
    @Param() params: LensCoatingParamsDto,
  ): Promise<LensCoatingModel> {
    return await this.lensCoatingService.findById(params.id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new lens coating' })
  @ApiResponse({
    status: 201,
    description: 'Lens coating created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Coating with this name already exists',
  })
  async create(
    @Body() createDto: CreateLensCoatingDto,
    @Req() req: RequestModel,
  ): Promise<LensCoatingModel> {
    return await this.lensCoatingService.create(createDto, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lens coating by ID' })
  @ApiParam({ name: 'id', description: 'Lens coating ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Lens coating updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Lens coating not found' })
  @ApiResponse({
    status: 409,
    description: 'Coating with this name already exists',
  })
  async update(
    @Param() params: LensCoatingParamsDto,
    @Body() updateDto: UpdateLensCoatingDto,
    @Req() req: RequestModel,
  ): Promise<LensCoatingModel> {
    return await this.lensCoatingService.update(
      params.id,
      updateDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lens coating by ID (soft delete)' })
  @ApiParam({ name: 'id', description: 'Lens coating ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Lens coating deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Lens coating not found' })
  async delete(
    @Param() params: LensCoatingParamsDto,
    @Req() req: RequestModel,
  ): Promise<{ success: boolean }> {
    const success = await this.lensCoatingService.delete(
      params.id,
      req.user.userId,
    );
    return { success };
  }
}
