import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { LensThicknessService } from './lens_thickness.service';
import { LensThicknessEntity } from './entities/lens_thickness.entity';
import {
  CreateLensThicknessBodyDto,
  DeleteLensThicknessParamsDto,
  GetLensThicknessByIdParamsDto,
  UpdateLensThicknessBodyDto,
  UpdateLensThicknessParamsDto,
} from './dtos/lens_thickness.dto';
import { RequestModel } from 'src/common/models/request.model';
import { DeleteLensParamsDto } from 'src/lens/dtos/lens.dto';

@ApiTags('Lens Thickness')
@Controller('api/v1/')
export class LensThicknessController {
  constructor(private readonly lensThicknessService: LensThicknessService) {}

  @Get('lens-thickness/list')
  async getLensThickness() {
    return this.lensThicknessService.getLensThickness();
  }

  @Get('lens-thickness/:lenThicknessId')
  async findById(@Param() params: GetLensThicknessByIdParamsDto) {
    return this.lensThicknessService.getLensThicknessById(
      params.lenThicknessId,
    );
  }

  @Post('lens-thickness/create')
  async createLensThickness(
    @Req() req: RequestModel,
    @Body() body: CreateLensThicknessBodyDto,
  ) {
    return this.lensThicknessService.createLensThickness(
      body.name,
      body.indexValue,
      body.price,
      body.description,
      req.user.userId,
    );
  }

  @Put('lens-thickness/:lensThicknessId/update')
  async updateLensThickness(
    @Param() params: UpdateLensThicknessParamsDto,
    @Body() body: UpdateLensThicknessBodyDto,
    @Req() req: RequestModel,
  ) {
    const lensThickness = await this.lensThicknessService.getLensThicknessById(
      params.lenThicknessId,
    );

    return this.lensThicknessService.updateLensThickness(
      lensThickness,
      body.name,
      body.indexValue,
      body.price,
      body.description,
      req.user.userId,
    );
  }

  @Delete('lens-thickness/:lensThicknessId/delete')
  async delete(@Param() params: DeleteLensThicknessParamsDto) {
    const lensThickness = await this.lensThicknessService.getLensThicknessById(
      params.lenThicknessId,
    );

    return true;
  }
}
