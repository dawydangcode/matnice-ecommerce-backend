import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { LensThicknessTintService } from './lens_thickness_tint.service';
import {
  CreateLensThicknessTintDto,
  CreateBulkLensThicknessTintDto,
  CreateTintThicknessCompatibilityDto,
  UpdateLensThicknessTintDto,
  LensThicknessTintParamsDto,
  LensThicknessParamsDto,
  TintParamsDto,
} from './dtos/lens_thickness_tint.dto';
import { RequestModel } from 'src/common/models/request.model';
import { LensThicknessTintModel } from './models/lens_thickness_tint.model';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';

@Controller('api/v1')
@ApiTags('Lens / Thickness-Tint Compatibility')
@Roles(RoleType.Admin, RoleType.Employee)
export class LensThicknessTintController {
  constructor(
    private readonly lensThicknessTintService: LensThicknessTintService,
  ) {}

  @Get('lens-thickness-tint/list')
  @ApiOperation({ summary: 'Get all thickness-tint relationships' })
  @ApiOkResponse({
    description: 'List of thickness-tint relationships retrieved successfully',
  })
  async findAll(): Promise<LensThicknessTintModel[]> {
    return await this.lensThicknessTintService.findAll();
  }

  @Get('lens-thickness-tint/:lensThicknessTintId')
  @ApiOperation({ summary: 'Get thickness-tint relationship by ID' })
  @ApiParam({
    name: 'lensThicknessTintId',
    description: 'Thickness-tint relationship ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Thickness-tint relationship retrieved successfully',
  })
  async findById(
    @Param() params: LensThicknessTintParamsDto,
  ): Promise<LensThicknessTintModel> {
    return await this.lensThicknessTintService.findById(
      params.lensThicknessTintId,
    );
  }

  @Get('lens-thickness/:lensThicknessId/compatible-tints')
  @ApiOperation({ summary: 'Get compatible tints for a lens thickness' })
  @ApiParam({
    name: 'lensThicknessId',
    description: 'Lens thickness ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Compatible tints retrieved successfully',
  })
  async getCompatibleTints(
    @Param() params: LensThicknessParamsDto,
  ): Promise<any[]> {
    return await this.lensThicknessTintService.getCompatibleTintsForThickness(
      params.lensThicknessId,
    );
  }

  @Get('lens-tint/:tintId/compatible-thicknesses')
  @ApiOperation({ summary: 'Get compatible thicknesses for a tint' })
  @ApiParam({
    name: 'tintId',
    description: 'Tint ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Compatible thicknesses retrieved successfully',
  })
  async getCompatibleThicknesses(
    @Param() params: TintParamsDto,
  ): Promise<any[]> {
    return await this.lensThicknessTintService.getCompatibleThicknessesForTint(
      params.tintId,
    );
  }

  @Get('lens-thickness/:lensThicknessId/tint-relationships')
  @ApiOperation({ summary: 'Get all tint relationships for a thickness' })
  @ApiParam({
    name: 'lensThicknessId',
    description: 'Lens thickness ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Tint relationships retrieved successfully',
  })
  async findByThicknessId(
    @Param() params: LensThicknessParamsDto,
  ): Promise<LensThicknessTintModel[]> {
    return await this.lensThicknessTintService.findByThicknessId(
      params.lensThicknessId,
    );
  }

  @Get('lens-tint/:tintId/thickness-relationships')
  @ApiOperation({ summary: 'Get all thickness relationships for a tint' })
  @ApiParam({
    name: 'tintId',
    description: 'Tint ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Thickness relationships retrieved successfully',
  })
  async findByTintId(
    @Param() params: TintParamsDto,
  ): Promise<LensThicknessTintModel[]> {
    return await this.lensThicknessTintService.findByTintId(params.tintId);
  }

  @Get('lens-thickness-tint/compatibility-matrix')
  @ApiOperation({ summary: 'Get full compatibility matrix' })
  @ApiOkResponse({
    description: 'Compatibility matrix retrieved successfully',
  })
  async getCompatibilityMatrix(): Promise<any> {
    return await this.lensThicknessTintService.getCompatibilityMatrix();
  }

  @Post('lens-thickness-tint/create')
  @ApiOperation({ summary: 'Create a thickness-tint relationship' })
  @ApiCreatedResponse({
    description: 'Thickness-tint relationship created successfully',
  })
  async create(
    @Body() createDto: CreateLensThicknessTintDto,
    @Req() req: RequestModel,
  ): Promise<LensThicknessTintModel> {
    return await this.lensThicknessTintService.create(
      createDto,
      req.user.userId,
    );
  }

  @Post('lens-thickness/:lensThicknessId/add-tints')
  @ApiOperation({ summary: 'Add multiple tints to a thickness (bulk)' })
  @ApiParam({
    name: 'lensThicknessId',
    description: 'Lens thickness ID',
    example: 1,
  })
  @ApiCreatedResponse({
    description: 'Bulk tint relationships created successfully',
  })
  async createBulkForThickness(
    @Param() params: LensThicknessParamsDto,
    @Body() createBulkDto: { tintIds: number[] },
    @Req() req: RequestModel,
  ): Promise<LensThicknessTintModel[]> {
    const bulkDto: CreateBulkLensThicknessTintDto = {
      lensThicknessId: params.lensThicknessId,
      tintIds: createBulkDto.tintIds,
    };
    return await this.lensThicknessTintService.createBulkForThickness(
      bulkDto,
      req.user.userId,
    );
  }

  @Post('lens-tint/:tintId/add-thicknesses')
  @ApiOperation({ summary: 'Add multiple thicknesses to a tint (bulk)' })
  @ApiParam({
    name: 'tintId',
    description: 'Tint ID',
    example: 1,
  })
  @ApiCreatedResponse({
    description: 'Bulk thickness relationships created successfully',
  })
  async createTintCompatibility(
    @Param() params: TintParamsDto,
    @Body() createDto: { lensThicknessIds: number[] },
    @Req() req: RequestModel,
  ): Promise<LensThicknessTintModel[]> {
    const compatibilityDto: CreateTintThicknessCompatibilityDto = {
      tintId: params.tintId,
      lensThicknessIds: createDto.lensThicknessIds,
    };
    return await this.lensThicknessTintService.createTintCompatibility(
      compatibilityDto,
      req.user.userId,
    );
  }

  @Put('lens-thickness-tint/:lensThicknessTintId')
  @ApiOperation({ summary: 'Update thickness-tint relationship' })
  @ApiParam({
    name: 'lensThicknessTintId',
    description: 'Thickness-tint relationship ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Thickness-tint relationship updated successfully',
  })
  async update(
    @Param() params: LensThicknessTintParamsDto,
    @Body() updateDto: UpdateLensThicknessTintDto,
    @Req() req: RequestModel,
  ): Promise<LensThicknessTintModel> {
    return await this.lensThicknessTintService.update(
      params.lensThicknessTintId,
      updateDto,
      req.user.userId,
    );
  }

  @Delete('lens-thickness-tint/:lensThicknessTintId')
  @ApiOperation({ summary: 'Delete thickness-tint relationship' })
  @ApiParam({
    name: 'lensThicknessTintId',
    description: 'Thickness-tint relationship ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Thickness-tint relationship deleted successfully',
  })
  async delete(
    @Param() params: LensThicknessTintParamsDto,
    @Req() req: RequestModel,
  ): Promise<{ success: boolean }> {
    const result = await this.lensThicknessTintService.delete(
      params.lensThicknessTintId,
      req.user.userId,
    );
    return { success: result };
  }

  @Delete('lens-thickness/:lensThicknessId/remove-all-tints')
  @ApiOperation({ summary: 'Remove all tint relationships from a thickness' })
  @ApiParam({
    name: 'lensThicknessId',
    description: 'Lens thickness ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'All tint relationships removed successfully',
  })
  async removeAllTintsFromThickness(
    @Param() params: LensThicknessParamsDto,
    @Req() req: RequestModel,
  ): Promise<{ success: boolean }> {
    const result =
      await this.lensThicknessTintService.removeAllTintsFromThickness(
        params.lensThicknessId,
        req.user.userId,
      );
    return { success: result };
  }

  @Delete('lens-tint/:tintId/remove-all-thicknesses')
  @ApiOperation({ summary: 'Remove all thickness relationships from a tint' })
  @ApiParam({
    name: 'tintId',
    description: 'Tint ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'All thickness relationships removed successfully',
  })
  async removeAllThicknessesFromTint(
    @Param() params: TintParamsDto,
    @Req() req: RequestModel,
  ): Promise<{ success: boolean }> {
    const result =
      await this.lensThicknessTintService.removeAllThicknessesFromTint(
        params.tintId,
        req.user.userId,
      );
    return { success: result };
  }
}
