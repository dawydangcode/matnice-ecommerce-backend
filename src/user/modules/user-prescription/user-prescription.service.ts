import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPrescriptionEntity } from './entities/user-prescription.entity';
import { In, IsNull, Repository } from 'typeorm';
import { PageList } from 'src/common/models/page-list.model';
import { UserPrescriptionModel } from './models/user-prescription.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';

@Injectable()
export class UserPrescriptionService {
  constructor(
    @InjectRepository(UserPrescriptionEntity)
    private readonly userPrescriptionRepository: Repository<UserPrescriptionEntity>,
  ) {}

  async getUserPrescriptions(
    prescriptionIds: number[] | undefined,
    userId: number | undefined,
    pagination: PaginationParamsModel | undefined,
  ): Promise<PageList<UserPrescriptionModel>> {
    const [prescriptions, total] =
      await this.userPrescriptionRepository.findAndCount({
        where: {
          id: prescriptionIds ? In(prescriptionIds) : undefined,
          userId: userId,
          deletedAt: IsNull(),
        },
        order: {
          isDefault: 'DESC',
          createdAt: 'DESC',
        },
        ...pagination?.toQuery(),
      });

    return new PageList<UserPrescriptionModel>(
      total,
      prescriptions.map((prescription: UserPrescriptionEntity) =>
        prescription.toModel(),
      ),
    );
  }

  async getUserPrescriptionById(
    prescriptionId: number,
  ): Promise<UserPrescriptionModel> {
    const prescription = await this.userPrescriptionRepository.findOne({
      where: {
        id: prescriptionId,
        deletedAt: IsNull(),
      },
    });
    if (!prescription) {
      throw new HttpException('Prescription not found', HttpStatus.NOT_FOUND);
    }

    return prescription.toModel();
  }

  async createUserPrescription(
    userId: number,
    rightEyeSph: number,
    rightEyeCyl: number,
    rightEyeAxis: number,
    rightEyeAdd: number | undefined,
    leftEyeSph: number,
    leftEyeCyl: number,
    leftEyeAxis: number,
    leftEyeAdd: number | undefined,
    pdRight: number,
    pdLeft: number,
    isDefault: boolean | undefined,
    notes: string | undefined,
    reqUserId: number,
  ): Promise<UserPrescriptionModel> {
    // If this is set as default, unset any existing default prescription
    if (isDefault) {
      await this.userPrescriptionRepository.update(
        {
          userId: userId,
          isDefault: true,
          deletedAt: IsNull(),
        },
        {
          isDefault: false,
          updatedAt: new Date(),
          updatedBy: reqUserId,
        },
      );
    }

    const entity = new UserPrescriptionEntity();
    entity.userId = userId;
    entity.rightEyeSph = rightEyeSph;
    entity.rightEyeCyl = rightEyeCyl;
    entity.rightEyeAxis = rightEyeAxis;
    entity.rightEyeAdd = rightEyeAdd ?? null;
    entity.leftEyeSph = leftEyeSph;
    entity.leftEyeCyl = leftEyeCyl;
    entity.leftEyeAxis = leftEyeAxis;
    entity.leftEyeAdd = leftEyeAdd ?? null;
    entity.pdRight = pdRight;
    entity.pdLeft = pdLeft;
    entity.isDefault = isDefault ?? false;
    entity.notes = notes ?? null;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const newPrescription = await this.userPrescriptionRepository.save(entity);
    return await this.getUserPrescriptionById(newPrescription.id);
  }

  async updateUserPrescription(
    prescription: UserPrescriptionModel,
    rightEyeSph: number | undefined,
    rightEyeCyl: number | undefined,
    rightEyeAxis: number | undefined,
    rightEyeAdd: number | undefined,
    leftEyeSph: number | undefined,
    leftEyeCyl: number | undefined,
    leftEyeAxis: number | undefined,
    leftEyeAdd: number | undefined,
    pdRight: number | undefined,
    pdLeft: number | undefined,
    isDefault: boolean | undefined,
    notes: string | undefined,
    reqUserId: number | undefined,
  ): Promise<UserPrescriptionModel> {
    // If this is set as default, unset any existing default prescription
    if (isDefault && !prescription.isDefault) {
      await this.userPrescriptionRepository.update(
        {
          userId: prescription.userId,
          isDefault: true,
          deletedAt: IsNull(),
        },
        {
          isDefault: false,
          updatedAt: new Date(),
          updatedBy: reqUserId,
        },
      );
    }

    await this.userPrescriptionRepository.update(
      {
        id: prescription.id,
        deletedAt: IsNull(),
      },
      {
        rightEyeSph: rightEyeSph,
        rightEyeCyl: rightEyeCyl,
        rightEyeAxis: rightEyeAxis,
        rightEyeAdd: rightEyeAdd,
        leftEyeSph: leftEyeSph,
        leftEyeCyl: leftEyeCyl,
        leftEyeAxis: leftEyeAxis,
        leftEyeAdd: leftEyeAdd,
        pdRight: pdRight,
        pdLeft: pdLeft,
        isDefault: isDefault,
        notes: notes,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getUserPrescriptionById(prescription.id);
  }

  async deleteUserPrescription(
    prescription: UserPrescriptionModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.userPrescriptionRepository.update(
      {
        id: prescription.id,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );
    return true;
  }

  async getDefaultPrescription(
    userId: number,
  ): Promise<UserPrescriptionModel | null> {
    const prescription = await this.userPrescriptionRepository.findOne({
      where: {
        userId: userId,
        isDefault: true,
        deletedAt: IsNull(),
      },
    });

    return prescription ? prescription.toModel() : null;
  }
}
