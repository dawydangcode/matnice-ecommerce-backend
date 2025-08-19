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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { TintColorService } from './tint_color.service';
import {
  CreateTintColorDto,
  UpdateTintColorDto,
  TintColorParamsDto,
  TintIdParamsDto,
} from './dtos/tint_color.dto';
import { RequestModel } from 'src/common/models/request.model';
import { TintColorModel } from './models/tint_color.model';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';

@Controller('api/v1')
@ApiTags('Lens / Tint Color')
@Roles(RoleType.Admin, RoleType.Employee)
export class TintColorController {
  constructor(private readonly tintColorService: TintColorService) {}

  @Get('tint-color/list')
  @ApiOperation({ summary: 'Get all tint colors' })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Items per page',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'tintId',
    description: 'Filter by tint ID',
    required: false,
    example: 1,
  })
  @ApiOkResponse({
    description: 'List of tint colors retrieved successfully',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('tintId') tintId?: number,
  ): Promise<
    | TintColorModel[]
    | {
        data: TintColorModel[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }
  > {
    if (page && limit) {
      return await this.tintColorService.findWithPagination(
        Number(page),
        Number(limit),
        tintId ? Number(tintId) : undefined,
      );
    }

    if (tintId) {
      return await this.tintColorService.findByTintId(Number(tintId));
    }

    return await this.tintColorService.findAll();
  }

  @Get('tint-color/:tintColorId')
  @ApiOperation({ summary: 'Get tint color by ID' })
  @ApiParam({
    name: 'tintColorId',
    description: 'Tint color ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Tint color retrieved successfully',
  })
  async findById(@Param() params: TintColorParamsDto): Promise<TintColorModel> {
    return await this.tintColorService.findById(params.tintColorId);
  }

  @Get('tint/:tintId/colors')
  @ApiOperation({ summary: 'Get all colors for a specific tint' })
  @ApiParam({
    name: 'tintId',
    description: 'Tint ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Tint colors retrieved successfully',
  })
  async findByTintId(
    @Param() params: TintIdParamsDto,
  ): Promise<TintColorModel[]> {
    return await this.tintColorService.findByTintId(params.tintId);
  }

  @Get('tint-color/search')
  @ApiOperation({ summary: 'Search tint colors by name' })
  @ApiQuery({
    name: 'q',
    description: 'Search term',
    required: true,
    example: 'grey',
  })
  @ApiOkResponse({
    description: 'Search results retrieved successfully',
  })
  async searchByName(
    @Query('q') searchTerm: string,
  ): Promise<TintColorModel[]> {
    return await this.tintColorService.searchByName(searchTerm);
  }

  @Post('tint-color/create')
  @ApiOperation({ summary: 'Create a new tint color' })
  @ApiCreatedResponse({
    description: 'Tint color created successfully',
  })
  async create(
    @Body() createTintColorDto: CreateTintColorDto,
    @Req() req: RequestModel,
  ): Promise<TintColorModel> {
    return await this.tintColorService.create(
      createTintColorDto,
      req.user.userId,
    );
  }

  @Put('tint-color/:tintColorId')
  @ApiOperation({ summary: 'Update tint color' })
  @ApiParam({
    name: 'tintColorId',
    description: 'Tint color ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Tint color updated successfully',
  })
  async update(
    @Param() params: TintColorParamsDto,
    @Body() updateTintColorDto: UpdateTintColorDto,
    @Req() req: RequestModel,
  ): Promise<TintColorModel> {
    return await this.tintColorService.update(
      params.tintColorId,
      updateTintColorDto,
      req.user.userId,
    );
  }

  @Delete('tint-color/:tintColorId')
  @ApiOperation({ summary: 'Delete tint color' })
  @ApiParam({
    name: 'tintColorId',
    description: 'Tint color ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Tint color deleted successfully',
  })
  async delete(
    @Param() params: TintColorParamsDto,
    @Req() req: RequestModel,
  ): Promise<{ success: boolean }> {
    const result = await this.tintColorService.delete(
      params.tintColorId,
      req.user.userId,
    );
    return { success: result };
  }

  @Post('tint-color/upload-image')
  @ApiOperation({ summary: 'Upload image for tint color' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const imageUrl = await this.tintColorService.uploadImage(file);
    return { imageUrl };
  }
}
