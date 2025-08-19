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
import { LensTintService } from './lens_tint.service';
import {
  CreateLensTintDto,
  UpdateLensTintDto,
  LensTintParamsDto,
} from './dtos/lens_tint.dto';
import { RequestModel } from 'src/common/models/request.model';
import { LensTintModel } from './models/lens_tint.model';
import { TintColorModel } from './models/tint_color.model';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';

@Controller('api/v1')
@ApiTags('Lens / Lens Tint')
@Roles(RoleType.Admin, RoleType.Employee)
export class LensTintController {
  constructor(private readonly lensTintService: LensTintService) {}

  // Lens Tint Endpoints
  @Get('lens-tint/list')
  @ApiOperation({ summary: 'Get all lens tints' })
  @ApiOkResponse({
    description: 'List of lens tints retrieved successfully',
  })
  async findAllLensTints(): Promise<LensTintModel[]> {
    return await this.lensTintService.findAllLensTints();
  }

  @Get('lens-tint/:lensTintId')
  @ApiOperation({ summary: 'Get lens tint by ID' })
  @ApiParam({
    name: 'lensTintId',
    description: 'Lens tint ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Lens tint retrieved successfully',
  })
  async findLensTintById(
    @Param() params: LensTintParamsDto,
  ): Promise<LensTintModel> {
    return await this.lensTintService.findLensTintById(params.lensTintId);
  }

  @Post('lens-tint/create')
  @ApiOperation({ summary: 'Create a new lens tint' })
  @ApiCreatedResponse({
    description: 'Lens tint created successfully',
  })
  async createLensTint(
    @Body() createLensTintDto: CreateLensTintDto,
    @Req() req: RequestModel,
  ): Promise<LensTintModel> {
    return await this.lensTintService.createLensTint(
      createLensTintDto,
      req.user.userId,
    );
  }

  @Put('lens-tint/:lensTintId')
  @ApiOperation({ summary: 'Update lens tint' })
  @ApiParam({
    name: 'lensTintId',
    description: 'Lens tint ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Lens tint updated successfully',
  })
  async updateLensTint(
    @Param() params: LensTintParamsDto,
    @Body() updateLensTintDto: UpdateLensTintDto,
    @Req() req: RequestModel,
  ): Promise<LensTintModel> {
    return await this.lensTintService.updateLensTint(
      params.lensTintId,
      updateLensTintDto,
      req.user.userId,
    );
  }

  @Delete('lens-tint/:lensTintId')
  @ApiOperation({ summary: 'Delete lens tint' })
  @ApiParam({
    name: 'lensTintId',
    description: 'Lens tint ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Lens tint deleted successfully',
  })
  async deleteLensTint(
    @Param() params: LensTintParamsDto,
    @Req() req: RequestModel,
  ): Promise<{ success: boolean }> {
    const result = await this.lensTintService.deleteLensTint(
      params.lensTintId,
      req.user.userId,
    );
    return { success: result };
  }

  // Tint Color Endpoints
  @Get('lens-tint/:lensTintId/colors')
  @ApiOperation({ summary: 'Get all colors for a specific lens tint' })
  @ApiParam({
    name: 'lensTintId',
    description: 'Lens tint ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Tint colors retrieved successfully',
  })
  async findTintColorsByTintId(
    @Param() params: LensTintParamsDto,
  ): Promise<TintColorModel[]> {
    return await this.lensTintService.findTintColorsByTintId(params.lensTintId);
  }
}
