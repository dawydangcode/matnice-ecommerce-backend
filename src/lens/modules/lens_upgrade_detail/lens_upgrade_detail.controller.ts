import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LensUpgradeDetailService } from './lens_upgrade_detail.service';
import { RequestModel } from 'src/common/models/request.model';
import {
  CreateLensUpgradeDetailDto,
  UpdateLensUpgradeDetailDto,
  GetLensUpgradeDetailParamsDto,
} from './dtos/lens_upgrade_detail.dto';
import { LensUpgradeDetailModel } from './models/lens_upgrade_detail.model';

@ApiTags('Lens / Lens Upgrade Detail')
@Controller('api/v1/lens-upgrade-detail')
export class LensUpgradeDetailController {
  constructor(
    private readonly lensUpgradeDetailService: LensUpgradeDetailService,
  ) {}

  @Get('list')
  async getAllLensUpgradeDetails(): Promise<LensUpgradeDetailModel[]> {
    return await this.lensUpgradeDetailService.getAllLensUpgradeDetails();
  }

  @Get(':lensUpgradeDetailId/detail')
  async getLensUpgradeDetailById(
    @Param() params: GetLensUpgradeDetailParamsDto,
  ): Promise<LensUpgradeDetailModel> {
    return await this.lensUpgradeDetailService.getLensUpgradeDetailById(
      params.lensUpgradeDetailId,
    );
  }

  @Post('create')
  async createLensUpgradeDetail(
    @Req() req: RequestModel,
    @Body() body: CreateLensUpgradeDetailDto,
  ): Promise<LensUpgradeDetailModel> {
    return await this.lensUpgradeDetailService.createLensUpgradeDetail(
      body.name,
      body.upgradeHardCoating || false,
      body.upgradeAntiReflection || false,
      body.upgradeUvProtection || false,
      body.upgradeBlueLight || false,
      body.upgradeLotusEffect || false,
      body.upgradeSmartFocus || false,
      body.upgradeTransition || false,
      body.upgradeProgressive || false,
      body.upgradeHardCoatingPrice || 0,
      body.upgradeAntiReflectionPrice || 0,
      body.upgradeUvProtectionPrice || 0,
      body.upgradeBluelightPrice || 0,
      body.upgradeLotusEffectPrice || 0,
      body.upgradeSmartFocusPrice || 0,
      body.upgradeTransitionPrice || 0,
      body.upgradeProgressivePrice || 0,
      body.totalUpgradesPrice || 0,
      body.description || null,
      req.user.userId,
    );
  }

  @Put(':lensUpgradeDetailId/update')
  async updateLensUpgradeDetail(
    @Req() req: RequestModel,
    @Param() params: GetLensUpgradeDetailParamsDto,
    @Body() body: UpdateLensUpgradeDetailDto,
  ): Promise<LensUpgradeDetailModel> {
    const upgradeDetail =
      await this.lensUpgradeDetailService.getLensUpgradeDetailById(
        params.lensUpgradeDetailId,
      );

    return await this.lensUpgradeDetailService.updateLensUpgradeDetail(
      upgradeDetail,
      body,
      req.user.userId,
    );
  }

  @Delete(':lensUpgradeDetailId/delete')
  async deleteLensUpgradeDetail(
    @Req() req: RequestModel,
    @Param() params: GetLensUpgradeDetailParamsDto,
  ): Promise<{ success: boolean }> {
    const upgradeDetail =
      await this.lensUpgradeDetailService.getLensUpgradeDetailById(
        params.lensUpgradeDetailId,
      );

    const result = await this.lensUpgradeDetailService.deleteLensUpgradeDetail(
      upgradeDetail,
      req.user.userId,
    );

    return { success: result };
  }
}
