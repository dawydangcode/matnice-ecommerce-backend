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
import {
  LensCoatingService,
  LensCoatingResponse,
} from './lens_coating.service';
import { LensCoatingModel } from './models/lens_coating.model';
import {
  CreateLensCoatingBodyDto,
  DeleteLensCoatingParamsDto,
  GetLensCoatingParamsDto,
  GetLensCoatingsQueryDto,
  UpdateLensCoatingBodyDto,
  UpdateLensCoatingParamsDto,
} from './dtos/lens_coating.dto';
import { RequestModel } from '../../../common/models/request.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { LensService } from 'src/lens/lens.service';

@ApiTags('Lens Coating')
@Controller('api/v1/')
@Roles(RoleType.Admin)
export class LensCoatingController {
  constructor(
    private readonly lensCoatingService: LensCoatingService,
    private readonly lensService: LensService,
  ) {}

  @Get('lens-coating/list')
  async findAll(@Query() query: GetLensCoatingsQueryDto) {
    return await this.lensCoatingService.getLensCoatings(
      undefined,
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      query.q,
      undefined,
    );
  }

  @Get('lens-coating/:lensCoatingId/detail')
  async getLensCoatingById(
    @Param() params: GetLensCoatingParamsDto,
  ): Promise<LensCoatingModel> {
    return await this.lensCoatingService.getLensCoatingById(
      params.lensCoatingId,
    );
  }

  @Post('lens-coating/create')
  async create(
    @Body() body: CreateLensCoatingBodyDto,
    @Req() req: RequestModel,
  ): Promise<LensCoatingModel> {
    const lens = await this.lensService.getLensById(body.lensId);
    return await this.lensCoatingService.createLensCoating(
      lens,
      body.name,
      body.price,
      body.description,
      req.user.userId,
    );
  }

  @Put('lens-coating/:lensCoatingId/update')
  async updateLensCoating(
    @Param() params: UpdateLensCoatingParamsDto,
    @Body() body: UpdateLensCoatingBodyDto,
    @Req() req: RequestModel,
  ): Promise<LensCoatingModel> {
    const lensCoating = await this.lensCoatingService.getLensCoatingById(
      params.lensCoatingId,
    );
    return await this.lensCoatingService.updateLensCoating(
      lensCoating,
      body.lensId,
      body.name,
      body.price,
      body.description,
      req.user.userId,
    );
  }

  @Delete('lens-coating/:lensCoatingId/delete')
  async delete(
    @Param() params: DeleteLensCoatingParamsDto,
    @Req() req: RequestModel,
  ) {
    const lensCoating = await this.lensCoatingService.getLensCoatingById(
      params.lensCoatingId,
    );
    return await this.lensCoatingService.deleteLensCoating(
      lensCoating,
      req.user.userId,
    );
  }
}
