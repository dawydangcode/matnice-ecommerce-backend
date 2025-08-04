import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { LensDetailService } from './lens_detail.service';
import {
  CreateLensDetailDto,
  UpdateLensDetailDto,
} from './dtos/lens_detail.dto';
import { RequestModel } from '../../../common/models/request.model';

@Controller('lens-details')
export class LensDetailController {
  constructor(private readonly lensDetailService: LensDetailService) {}

  @Get()
  async findAll() {
    return this.lensDetailService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.lensDetailService.findById(Number(id));
  }

  @Get('lens/:lensId')
  async findByLensId(@Param('lensId') lensId: number) {
    return this.lensDetailService.findByLensId(Number(lensId));
  }

  @Post()
  async create(
    @Body() createLensDetailDto: CreateLensDetailDto,
    @Req() req: RequestModel,
  ) {
    return this.lensDetailService.create(createLensDetailDto, req.user.userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLensDetailDto: UpdateLensDetailDto,
    @Req() req: RequestModel,
  ) {
    return this.lensDetailService.update(
      Number(id),
      updateLensDetailDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req: RequestModel) {
    return this.lensDetailService.delete(Number(id), req.user.userId);
  }

  @Get(':id/price')
  async calculatePrice(@Param('id') id: number) {
    const price = await this.lensDetailService.calculateLensPrice(Number(id));
    return { price };
  }
}
