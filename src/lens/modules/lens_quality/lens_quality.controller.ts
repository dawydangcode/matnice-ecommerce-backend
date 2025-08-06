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
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { LensQualityService } from './lens_quality.service';
import {
  CreateLensQualityDto,
  UpdateLensQualityDto,
  LensQualityParamsDto,
} from './dtos/lens_quality.dto';
import { RequestModel } from 'src/common/models/request.model';
import { LensQualityModel } from './models/lens_quality.model';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';

@Controller('api/v1')
@ApiTags('Lens / Lens Quality')
@Roles(RoleType.Admin, RoleType.Employee)
export class LensQualityController {
  constructor(private readonly lensQualityService: LensQualityService) {}

  @Get('lens-quality/list')
  @ApiOperation({ summary: 'Get all lens qualities' })
  @ApiOkResponse({
    description: 'List of lens qualities retrieved successfully',
  })
  async findAll(): Promise<LensQualityModel[]> {
    return await this.lensQualityService.findAll();
  }

  @Get('lens-quality/:lensQualityId')
  @ApiOperation({ summary: 'Get lens quality by ID' })
  @ApiOkResponse({
    description: 'Lens quality retrieved successfully',
  })
  async findById(
    @Param() params: LensQualityParamsDto,
  ): Promise<LensQualityModel> {
    return await this.lensQualityService.findById(params.lensQualityId);
  }

  @Get('lens-quality/filter/features')
  @ApiOperation({ summary: 'Filter lens qualities by features' })
  @ApiQuery({ name: 'uvProtection', required: false, type: Boolean })
  @ApiQuery({ name: 'antiReflective', required: false, type: Boolean })
  @ApiQuery({ name: 'nightDayOptimization', required: false, type: Boolean })
  @ApiQuery({ name: 'freeFormTechnology', required: false, type: Boolean })
  @ApiOkResponse({
    description: 'Filtered lens qualities retrieved successfully',
  })
  async findByFeatures(
    @Query('uvProtection') uvProtection?: boolean,
    @Query('antiReflective') antiReflective?: boolean,
    @Query('nightDayOptimization') nightDayOptimization?: boolean,
    @Query('freeFormTechnology') freeFormTechnology?: boolean,
  ): Promise<LensQualityModel[]> {
    return await this.lensQualityService.findByFeatures(
      uvProtection,
      antiReflective,
      nightDayOptimization,
      freeFormTechnology,
    );
  }

  @Post('lens-quality/create')
  async create(
    @Body() createLensQualityDto: CreateLensQualityDto,
    @Req() req: RequestModel,
  ): Promise<LensQualityModel> {
    return await this.lensQualityService.create(
      createLensQualityDto,
      req.user.userId,
    );
  }

  @Put('lens-quality/:lensQualityId')
  @ApiOperation({ summary: 'Update lens quality' })
  @ApiOkResponse({
    description: 'Lens quality updated successfully',
  })
  async update(
    @Param() params: LensQualityParamsDto,
    @Body() updateLensQualityDto: UpdateLensQualityDto,
    @Req() req: RequestModel,
  ): Promise<LensQualityModel> {
    return await this.lensQualityService.update(
      params.lensQualityId,
      updateLensQualityDto,
      req.user.userId,
    );
  }

  @Delete('lens-quality/:lensQualityId')
  @ApiOperation({ summary: 'Delete lens quality' })
  @ApiOkResponse({
    description: 'Lens quality deleted successfully',
  })
  async delete(
    @Param() params: LensQualityParamsDto,
    @Req() req: RequestModel,
  ): Promise<{ success: boolean }> {
    const result = await this.lensQualityService.delete(
      params.lensQualityId,
      req.user.userId,
    );
    return { success: result };
  }
}
