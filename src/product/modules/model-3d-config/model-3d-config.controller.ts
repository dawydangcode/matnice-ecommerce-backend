import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Model3dConfigService } from './model-3d-config.service';
import {
  CreateModel3dConfigDto,
  UpdateModel3dConfigDto,
  Model3dConfigQueryDto,
} from './dtos/model-3d-config.dto';
import { JwtAuthGuard } from '../../../middlewares/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Model 3D Configurations')
@Controller('model-3d-config')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class Model3dConfigController {
  constructor(private readonly model3dConfigService: Model3dConfigService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new 3D model configuration' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Configuration created successfully',
  })
  async create(@Body() createDto: CreateModel3dConfigDto, @Req() req: Request) {
    const userId = (req.user as any)?.id;
    return await this.model3dConfigService.create(
      createDto.modelId,
      createDto.offsetX,
      createDto.offsetY,
      createDto.positionOffsetX,
      createDto.positionOffsetY,
      createDto.positionOffsetZ,
      createDto.initialScale,
      createDto.rotationSensitivity,
      createDto.yawLimit,
      createDto.pitchLimit,
      userId,
    );
  }

  @Get('model/:modelId')
  @ApiOperation({ summary: 'Get configuration by model ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuration details',
  })
  async findByModelId(@Param('modelId', ParseIntPipe) modelId: number) {
    return await this.model3dConfigService.findByModelId(modelId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get configuration by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuration details',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.model3dConfigService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update 3D model configuration' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuration updated successfully',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateModel3dConfigDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.id;
    return await this.model3dConfigService.update(
      id,
      updateDto.offsetX,
      updateDto.offsetY,
      updateDto.positionOffsetX,
      updateDto.positionOffsetY,
      updateDto.positionOffsetZ,
      updateDto.initialScale,
      updateDto.rotationSensitivity,
      updateDto.yawLimit,
      updateDto.pitchLimit,
      userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete 3D model configuration' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuration deleted successfully',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.model3dConfigService.delete(id);
  }
}
