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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LensThicknessService } from './lens_thickness.service';
import { LensThicknessModel } from './models/lens_thickness.model';
import {
  CreateLensThicknessBodyDto,
  DeleteLensThicknessParamsDto,
  GetLensThicknessParamsDto,
  GetLensThicknessesQueryDto,
  UpdateLensThicknessBodyDto,
  UpdateLensThicknessParamsDto,
} from './dtos/lens_thickness.dto';
import { RequestModel } from '../../../common/models/request.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';

@ApiTags('Lens Thickness')
@Controller('api/v1/')
@Roles(RoleType.Admin)
export class LensThicknessController {
  constructor(private readonly lensThicknessService: LensThicknessService) {}

  @Get('lens-thickness/list')
  async findAll(@Query() query: GetLensThicknessesQueryDto) {
    return await this.lensThicknessService.getLensThicknesses(
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      query.q,
      undefined,
    );
  }

  @Get('lens-thickness/:lensThicknessId')
  async findOne(
    @Param() params: GetLensThicknessParamsDto,
  ): Promise<LensThicknessModel> {
    return await this.lensThicknessService.getLensThicknessById(
      params.lensThicknessId,
    );
  }

  @Post('lens-thickness')
  async create(
    @Body() body: CreateLensThicknessBodyDto,
    @Req() req: RequestModel,
  ): Promise<LensThicknessModel> {
    return await this.lensThicknessService.createLensThickness(
      body.name,
      body.description,
      body.indexValue,
      body.price,
      req.user.userId,
    );
  }

  @Put('lens-thickness/:lensThicknessId')
  async update(
    @Param() params: UpdateLensThicknessParamsDto,
    @Body() body: UpdateLensThicknessBodyDto,
    @Req() req: RequestModel,
  ): Promise<LensThicknessModel> {
    const lensThickness = await this.lensThicknessService.getLensThicknessById(
      params.lensThicknessId,
    );

    return await this.lensThicknessService.updateLensThickness(
      lensThickness,
      body.name,
      body.description,
      body.indexValue,
      body.price,
      req.user.userId,
    );
  }

  @Delete('lens-thickness/:lensThicknessId')
  async remove(
    @Param() params: DeleteLensThicknessParamsDto,
    @Req() req: RequestModel,
  ): Promise<boolean> {
    const lensThickness = await this.lensThicknessService.getLensThicknessById(
      params.lensThicknessId,
    );

    const success = await this.lensThicknessService.deleteLensThickness(
      lensThickness,
      req.user.userId,
    );

    return true;
  }
}
