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
import { RequestModel } from '../../../common/models/request.model';
import {
  CreateLensDetailBodyDto,
  UpdateLensDetailBodyDto,
  UpdateLensDetailParamsDto,
} from './dtos/lens_detail.dto';

@Controller('lens-details')
export class LensDetailController {
  constructor(private readonly lensDetailService: LensDetailService) {}

  @Get()
  async findAll() {
    return this.lensDetailService.findAll();
  }

  @Get(':id')
  async findById(@Param() params: number) {
    return this.lensDetailService.findById(Number(params));
  }

  @Get('lens/:lensId')
  async findByLensId(@Param() params: number) {
    return this.lensDetailService.findByLensId(Number(params));
  }

  @Post()
  async create(
    @Body() body: CreateLensDetailBodyDto,
    @Req() req: RequestModel,
  ) {
    return this.lensDetailService.createLensDetail(
      body.lensId,
      body.lensType,
      body.hasAxisCorrection,
      body.isNonPrescription,
      req.user.userId,
      body.lensThicknessId,
      body.lensQualityId,
      body.tintId,
    );
  }

  @Patch(':id')
  async update(
    @Param() params: UpdateLensDetailParamsDto,
    @Body() updateLensDetailDto: UpdateLensDetailBodyDto,
    @Req() req: RequestModel,
  ) {
    const lensDetail = await this.lensDetailService.findById(
      Number(params.lensDetailId),
    );
    return this.lensDetailService.updateLensDetail(
      lensDetail,
      updateLensDetailDto.lensId,
      updateLensDetailDto.lensThicknessId,
      updateLensDetailDto.lensQualityId,
      updateLensDetailDto.tintId,
      updateLensDetailDto.powerSphereLeft,
      updateLensDetailDto.powerSphereRight,
      updateLensDetailDto.powerCylinderLeft,
      updateLensDetailDto.powerCylinderRight,
      updateLensDetailDto.axisLeft,
      updateLensDetailDto.axisRight,
      updateLensDetailDto.pdLeft,
      updateLensDetailDto.pdRight,
      updateLensDetailDto.prescriptionDate,
      updateLensDetailDto.hasAxisCorrection,
      req.user.userId,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req: RequestModel) {
    return this.lensDetailService.deleteLensDetail(Number(id), req.user.userId);
  }

  @Get(':id/price')
  async calculatePrice(@Param('id') id: number) {
    const price = await this.lensDetailService.calculateLensPrice(Number(id));
    return { price };
  }
}
