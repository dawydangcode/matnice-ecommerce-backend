import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { LensUpgradeService } from './lens_upgrade.service';
import {
  CreateLensUpgradeDto,
  UpdateLensUpgradeDto,
} from './dtos/lens_upgrade.dto';
import { RequestModel } from '../../../common/models/request.model';

@Controller('lens-upgrades')
export class LensUpgradeController {
  constructor(private readonly lensUpgradeService: LensUpgradeService) {}

  @Get()
  async findAll() {
    return this.lensUpgradeService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.lensUpgradeService.findById(Number(id));
  }

  @Get('name/:upgradeName')
  async findByName(@Param('upgradeName') upgradeName: string) {
    return this.lensUpgradeService.findByName(upgradeName);
  }

  @Post()
  async create(
    @Body() createLensUpgradeDto: CreateLensUpgradeDto,
    @Req() req: RequestModel,
  ) {
    return this.lensUpgradeService.create(
      createLensUpgradeDto,
      req.user.userId,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLensUpgradeDto: UpdateLensUpgradeDto,
    @Req() req: RequestModel,
  ) {
    return this.lensUpgradeService.update(
      Number(id),
      updateLensUpgradeDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req: RequestModel) {
    return this.lensUpgradeService.delete(Number(id), req.user.userId);
  }

  @Post('calculate-price')
  async calculatePrice(@Body() body: { upgradeIds: number[] }) {
    const totalPrice = await this.lensUpgradeService.calculateUpgradesPrice(
      body.upgradeIds,
    );
    return { totalPrice };
  }

  @Get('bulk/:ids')
  async getUpgradesByIds(@Param('ids') ids: string) {
    const upgradeIds = ids.split(',').map((id) => Number(id.trim()));
    return this.lensUpgradeService.getUpgradesByIds(upgradeIds);
  }
}
