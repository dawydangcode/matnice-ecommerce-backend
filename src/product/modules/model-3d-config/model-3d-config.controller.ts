import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Req,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Model3dConfigService } from './model-3d-config.service';
import { Request } from 'express';
import { RequestModel } from 'src/common/models/request.model';
import {
  CreateModel3dConfigBodyDto,
  DeleteModel3dConfigParamsDto,
  GetModel3dConfigByIdParamsDto,
  UpdateModel3dConfigBodyDto,
  UpdateModel3dConfigParamsDto,
} from './dtos/model-3d-config.dto';

@ApiTags('Model 3D Configurations')
@Controller('api/v1')
export class Model3dConfigController {
  constructor(private readonly model3dConfigService: Model3dConfigService) {}

  @Get('model-3d-config/list')
  async getModel3dConfigs() {
    return await this.model3dConfigService.getModel3dConfigs();
  }

  @Get('model-3d-config/:model3dConfigId/detail')
  async getByModel3dConfigId(@Param() params: GetModel3dConfigByIdParamsDto) {
    return await this.model3dConfigService.getModel3dConfigById(
      params.model3dConfigId,
    );
  }

  // @Get('model-3d-config/:modelId/model/')
  // async getByModelId(@Param() params: GetModel3dConfigByIdParamsDto) {
  //   return await this.model3dConfigService.getModel3dConfigByModelId(
  //     params.model3dConfigId,
  //   );
  // }

  @Post('/model-3d-config/create')
  async createModel3dConfig(
    @Body() body: CreateModel3dConfigBodyDto,
    @Req() req: RequestModel,
  ) {
    return await this.model3dConfigService.createModel3dConfig(
      body.modelId,
      body.offsetX,
      body.offsetY,
      body.positionOffsetX,
      body.positionOffsetY,
      body.positionOffsetZ,
      body.initialScale,
      body.rotationSensitivity,
      body.yawLimit,
      body.pitchLimit,
      req.user.userId,
    );
  }

  @Put('model-3d-config/:model3dConfigId/update')
  async updateModel3dConfig(
    @Param() params: UpdateModel3dConfigParamsDto,
    @Body() body: UpdateModel3dConfigBodyDto,
    @Req() req: RequestModel,
  ) {
    const model3dConfig = await this.model3dConfigService.getModel3dConfigById(
      params.model3dConfigId,
    );
    await this.model3dConfigService.updateModel3dConfig(
      model3dConfig,
      body.modelId,
      body.offsetX,
      body.offsetY,
      body.positionOffsetX,
      body.positionOffsetY,
      body.positionOffsetZ,
      body.initialScale,
      body.rotationSensitivity,
      body.yawLimit,
      body.pitchLimit,
      req.user.userId,
    );
  }

  @Delete('model-3d-config/:model3dConfigId/delete')
  async remove(
    @Param() params: DeleteModel3dConfigParamsDto,
    @Req() req: RequestModel,
  ) {
    const model3dConfig = await this.model3dConfigService.getModel3dConfigById(
      params.model3dConfigId,
    );

    return await this.model3dConfigService.deleteModel3dConfig(
      model3dConfig,
      req.user.userId,
    );
  }
}
