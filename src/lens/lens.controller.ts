import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { LensService } from './lens.service';
import {
  CreateLensBodyDto,
  DeleteLensParamsDto,
  GetLensesQueryDto,
  UpdateLensParamsDto,
  UpdateLensBodyDto,
} from './dtos/lens.dto';
import { RequestModel } from '../common/models/request.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1')
@ApiTags('Lens')
export class LensController {
  constructor(private readonly lensService: LensService) {}

  @Get('lens/list')
  async getLenses(@Query() query: GetLensesQueryDto) {
    return this.lensService.getLenses(
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      query.q,
      undefined,
    );
  }

  @Get('lens/:lenId/detail')
  async getLensById(@Param('id') id: number) {
    return this.lensService.getLensById(Number(id));
  }

  @Post('lens/create')
  async createLens(@Body() body: CreateLensBodyDto, @Req() req: RequestModel) {
    return this.lensService.createLens(
      body.name,
      body.description,
      req.user.userId,
    );
  }

  @Put('lens/:lensId/update')
  async updateLens(
    @Param() params: UpdateLensParamsDto,
    @Body() body: UpdateLensBodyDto,
    @Req() req: RequestModel,
  ) {
    const lens = await this.lensService.getLensById(params.lensId);
    return this.lensService.updateLens(
      lens,
      body.name,
      body.description,
      req.user.userId,
    );
  }

  @Delete('lens/:lensId/delete')
  async deleteLens(
    @Param() params: DeleteLensParamsDto,
    @Req() req: RequestModel,
  ) {
    const lens = await this.lensService.getLensById(params.lensId);

    return this.lensService.deleteLens(lens, req.user.userId);
  }
}
