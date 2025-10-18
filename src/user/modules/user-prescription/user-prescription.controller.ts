import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UserPrescriptionService } from './user-prescription.service';
import {
  CreateUserPrescriptionBodyDto,
  DeleteUserPrescriptionParamsDto,
  GetUserPrescriptionParamsDto,
  GetUserPrescriptionsQueryDto,
  UpdateUserPrescriptionBodyDto,
  UpdateUserPrescriptionParamsDto,
} from './dtos/user-prescription.dto';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { RequestModel } from 'src/common/models/request.model';

@Controller('api/v1/user-prescription')
export class UserPrescriptionController {
  constructor(
    private readonly userPrescriptionService: UserPrescriptionService,
  ) {}

  @Get('list')
  async getUserPrescriptions(
    @Query() query: GetUserPrescriptionsQueryDto,
    @Req() req: RequestModel,
  ) {
    // If userId is not provided in query, use the logged-in user's ID
    const userId = query.userId || req.user.userId;

    return await this.userPrescriptionService.getUserPrescriptions(
      undefined,
      userId,
      new PaginationParamsModel(query.page, query.limit),
    );
  }

  @Get('default')
  async getDefaultPrescription(@Req() req: RequestModel) {
    return await this.userPrescriptionService.getDefaultPrescription(
      req.user.userId,
    );
  }

  @Get(':prescriptionId/detail')
  async getPrescriptionById(@Param() params: GetUserPrescriptionParamsDto) {
    return await this.userPrescriptionService.getUserPrescriptionById(
      params.prescriptionId,
    );
  }

  @Post('create')
  async createPrescription(
    @Req() req: RequestModel,
    @Body() body: CreateUserPrescriptionBodyDto,
  ) {
    return await this.userPrescriptionService.createUserPrescription(
      req.user.userId,
      body.rightEyeSph,
      body.rightEyeCyl,
      body.rightEyeAxis,
      body.rightEyeAdd,
      body.leftEyeSph,
      body.leftEyeCyl,
      body.leftEyeAxis,
      body.leftEyeAdd,
      body.pdRight,
      body.pdLeft,
      body.isDefault,
      body.notes,
      req.user.userId,
    );
  }

  @Put(':prescriptionId/update')
  async updatePrescription(
    @Req() req: RequestModel,
    @Param() params: UpdateUserPrescriptionParamsDto,
    @Body() body: UpdateUserPrescriptionBodyDto,
  ) {
    const prescription =
      await this.userPrescriptionService.getUserPrescriptionById(
        params.prescriptionId,
      );
    return await this.userPrescriptionService.updateUserPrescription(
      prescription,
      body.rightEyeSph,
      body.rightEyeCyl,
      body.rightEyeAxis,
      body.rightEyeAdd,
      body.leftEyeSph,
      body.leftEyeCyl,
      body.leftEyeAxis,
      body.leftEyeAdd,
      body.pdRight,
      body.pdLeft,
      body.isDefault,
      body.notes,
      req.user.userId,
    );
  }

  @Put(':prescriptionId/set-default')
  async setDefaultPrescription(
    @Req() req: RequestModel,
    @Param() params: UpdateUserPrescriptionParamsDto,
  ) {
    const prescription =
      await this.userPrescriptionService.getUserPrescriptionById(
        params.prescriptionId,
      );
    return await this.userPrescriptionService.updateUserPrescription(
      prescription,
      prescription.rightEyeSph,
      prescription.rightEyeCyl,
      prescription.rightEyeAxis,
      prescription.rightEyeAdd,
      prescription.leftEyeSph,
      prescription.leftEyeCyl,
      prescription.leftEyeAxis,
      prescription.leftEyeAdd,
      prescription.pdRight,
      prescription.pdLeft,
      true, // Set as default
      prescription.notes,
      req.user.userId,
    );
  }

  @Delete(':prescriptionId/delete')
  async deletePrescription(
    @Req() req: RequestModel,
    @Param() params: DeleteUserPrescriptionParamsDto,
  ) {
    const prescription =
      await this.userPrescriptionService.getUserPrescriptionById(
        params.prescriptionId,
      );
    return await this.userPrescriptionService.deleteUserPrescription(
      prescription,
      req.user.userId,
    );
  }
}
