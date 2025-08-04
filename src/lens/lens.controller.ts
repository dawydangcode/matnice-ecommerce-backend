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
} from './dtos/lens.dto';
import { RequestModel } from '../common/models/request.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { UpdateBrandBodyDto } from 'src/brand/dtos/brand.dto';
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
      undefined,
      undefined,
    );
  }

  @Get('lens/:lenId/detail')
  async findById(@Param('id') id: number) {
    return this.lensService.findLensById(Number(id));
  }

  @Post('lens/create')
  async create(@Body() body: CreateLensBodyDto, @Req() req: RequestModel) {
    return this.lensService.create(body.name, req.user.userId);
  }

  @Put('lens/:lensId/update')
  async update(
    @Param() params: UpdateLensParamsDto,
    @Body() body: UpdateBrandBodyDto,
    @Req() req: RequestModel,
  ) {
    const lens = await this.lensService.findLensById(params.lensId);
    return this.lensService.updateLens(lens, body.name, req.user.userId);
  }

  @Delete('lens/:lensId/delete')
  async delete(@Param() params: DeleteLensParamsDto, @Req() req: RequestModel) {
    const lens = await this.lensService.findLensById(params.lensId);

    return this.lensService.deleteLens(lens, req.user.userId);
  }
}
