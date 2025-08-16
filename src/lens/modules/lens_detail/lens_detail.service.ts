import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { LensDetailEntity } from './entities/lens_detail.entity';
import { LensDetailModel } from './models/lens_detail.model';
import { LensDetailDto } from './dtos/lens_detail.dto';

@Injectable()
export class LensDetailService {
  constructor(
    @InjectRepository(LensDetailEntity)
    private readonly lensDetailRepository: Repository<LensDetailEntity>,
  ) {}

  async findAll(): Promise<LensDetailModel[]> {
    const lensDetails = await this.lensDetailRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    return lensDetails.map((detail) => detail.toModel());
  }

  async findById(id: number): Promise<LensDetailModel> {
    const lensDetail = await this.lensDetailRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lensDetail) {
      throw new HttpException('Lens detail not found', HttpStatus.NOT_FOUND);
    }

    return lensDetail.toModel();
  }

  async findByLensId(lensId: number): Promise<LensDetailModel[]> {
    const lensDetails = await this.lensDetailRepository.find({
      where: { lensId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    return lensDetails.map((detail) => detail.toModel());
  }

  async createLensDetail(
    lensId: number,
    lensType: string,
    hasAxisCorrection: boolean,
    isNonPrescription: boolean,
    reqUserId: number,
    lensThicknessId?: number,
    lensQualityId?: number,
    tintId?: number,
  ): Promise<LensDetailModel> {
    const entity = new LensDetailEntity();
    entity.lensId = lensId;
    entity.lensType = lensType;
    entity.hasAxisCorrection = hasAxisCorrection;
    entity.isNonPrescription = isNonPrescription;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedLensDetail = await this.lensDetailRepository.save(entity);
    return savedLensDetail.toModel();
  }

  async updateLensDetail(
    lensDetail: LensDetailModel,
    lensId: number | undefined,
    lensThicknessId: number | undefined,
    lensQualityId: number | undefined,
    tintId: number | undefined,
    powerSphereLeft: number | undefined,
    powerSphereRight: number | undefined,
    powerCylinderLeft: number | undefined,
    powerCylinderRight: number | undefined,
    axisLeft: number | undefined,
    axisRight: number | undefined,
    pdLeft: number | undefined,
    pdRight: number | undefined,
    prescriptionDate: Date | undefined,
    hasAxisCorrection: boolean | undefined,
    reqUserId: number,
  ): Promise<LensDetailModel> {
    await this.lensDetailRepository.update(
      { id: lensDetail.id },
      {
        lensId,
        lensThicknessId,
        lensQualityId,
        tintId,
        powerSphereLeft,
        powerSphereRight,
        powerCylinderLeft,
        powerCylinderRight,
        axisLeft,
        axisRight,
        pdLeft,
        pdRight,
        prescriptionDate,
        hasAxisCorrection,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );
    return this.findById(lensDetail.id);
  }

  async deleteLensDetail(id: number, reqUserId: number): Promise<boolean> {
    const lensDetail = await this.lensDetailRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lensDetail) {
      throw new HttpException('Lens detail not found', HttpStatus.NOT_FOUND);
    }

    await this.lensDetailRepository.update(
      { id },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async calculateLensPrice(lensDetailId: number): Promise<number> {
    const lensDetail = await this.findById(lensDetailId);

    let totalPrice = 0;

    // TODO: Implement price calculation by fetching from related tables
    // This would require joining with lens_thickness, lens_quality, and tint tables
    // For now, return 0 as prices are stored in separate tables

    return totalPrice;
  }
}
