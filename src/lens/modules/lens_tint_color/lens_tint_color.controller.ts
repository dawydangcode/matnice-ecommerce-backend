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
import { LensTintColorService } from './lens_tint_color.service';
import { LensTintColorModel } from './models/lens_tint_color.model';
import {
  CreateLensTintColorBodyDto,
  DeleteLensTintColorParamsDto,
  GetLensTintColorParamsDto,
  GetLensTintColorsQueryDto,
  UpdateLensTintColorBodyDto,
  UpdateLensTintColorParamsDto,
} from './dtos/lens_tint_color.dto';
import { RequestModel } from '../../../common/models/request.model';
import { RoleType } from 'src/role/enum/role.enum';
import { Roles } from 'src/role/decorators/roles.decorator';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';

@ApiTags('Lens Tint Color')
@Controller('api/v1/')
@Roles(RoleType.Admin)
export class LensTintColorController {
  constructor(private readonly lensTintColorService: LensTintColorService) {}

  @Get('lens-tint-colors/list')
  async findAll(@Query() query: GetLensTintColorsQueryDto) {
    return await this.lensTintColorService.getLensTintColors(
      undefined,
      query.lensVariantId,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      query.q,
      undefined,
    );
  }

  @Get('lens-tint-color/:lensTintColorId')
  async findOne(
    @Param() params: GetLensTintColorParamsDto,
  ): Promise<LensTintColorModel> {
    return await this.lensTintColorService.getLensTintColorById(
      params.lensTintColorId,
    );
  }

  @Post('lens-tint-color')
  async create(
    @Body() body: CreateLensTintColorBodyDto,
    @Req() req: RequestModel,
  ): Promise<LensTintColorModel> {
    return await this.lensTintColorService.createLensTintColor(
      body.lensVariantId,
      body.name,
      body.imageUrl,
      body.colorCode,
      req.user.userId,
    );
  }

  @Put('lens-tint-color/:lensTintColorId')
  async update(
    @Param() params: UpdateLensTintColorParamsDto,
    @Body() body: UpdateLensTintColorBodyDto,
    @Req() req: RequestModel,
  ): Promise<LensTintColorModel> {
    const lensTintColor = await this.lensTintColorService.getLensTintColorById(
      params.lensTintColorId,
    );

    return await this.lensTintColorService.updateLensTintColor(
      lensTintColor,
      body.name,
      body.imageUrl,
      body.colorCode,
      req.user.userId,
    );
  }

  @Delete('lens-tint-color/:lensTintColorId')
  async remove(
    @Param() params: DeleteLensTintColorParamsDto,
    @Req() req: RequestModel,
  ): Promise<boolean> {
    const lensTintColor = await this.lensTintColorService.getLensTintColorById(
      params.lensTintColorId,
    );

    return await this.lensTintColorService.deleteLensTintColor(
      lensTintColor,
      req.user.userId,
    );
  }
}
