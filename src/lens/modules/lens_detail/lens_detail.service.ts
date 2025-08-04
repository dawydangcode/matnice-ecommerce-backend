import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { LensDetailEntity } from './entities/lens_detail.entity';
import { LensDetailModel } from './models/lens_detail.model';
import {
  CreateLensDetailDto,
  UpdateLensDetailDto,
} from './dtos/lens_detail.dto';

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

  async create(
    createLensDetailDto: CreateLensDetailDto,
    reqUserId: number,
  ): Promise<LensDetailModel> {
    const entity = new LensDetailEntity();
    entity.lensId = createLensDetailDto.lensId;
    entity.lensType = createLensDetailDto.lensType || null;
    entity.thicknessIndex = createLensDetailDto.thicknessIndex || null;
    entity.thicknessPrice = createLensDetailDto.thicknessPrice || null;
    entity.qualityType = createLensDetailDto.qualityType || null;
    entity.qualityPrice = createLensDetailDto.qualityPrice || null;
    entity.tintType = createLensDetailDto.tintType || null;
    entity.tintPrice = createLensDetailDto.tintPrice || null;
    entity.powerSphereLeft = createLensDetailDto.powerSphereLeft || null;
    entity.powerSphereRight = createLensDetailDto.powerSphereRight || null;
    entity.powerCylinderLeft = createLensDetailDto.powerCylinderLeft || null;
    entity.powerCylinderRight = createLensDetailDto.powerCylinderRight || null;
    entity.axisLeft = createLensDetailDto.axisLeft || null;
    entity.axisRight = createLensDetailDto.axisRight || null;
    entity.pdLeft = createLensDetailDto.pdLeft || null;
    entity.pdRight = createLensDetailDto.pdRight || null;
    entity.prescriptionDate = createLensDetailDto.prescriptionDate
      ? new Date(createLensDetailDto.prescriptionDate)
      : null;
    entity.material = createLensDetailDto.material || null;
    entity.coating = createLensDetailDto.coating || null;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;
    entity.updatedAt = new Date();
    entity.updatedBy = reqUserId;

    const savedLensDetail = await this.lensDetailRepository.save(entity);
    return savedLensDetail.toModel();
  }

  async update(
    id: number,
    updateLensDetailDto: UpdateLensDetailDto,
    reqUserId: number,
  ): Promise<LensDetailModel> {
    const lensDetail = await this.lensDetailRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lensDetail) {
      throw new HttpException('Lens detail not found', HttpStatus.NOT_FOUND);
    }

    const updateData: any = {
      ...updateLensDetailDto,
      updatedAt: new Date(),
      updatedBy: reqUserId,
    };

    if (updateLensDetailDto.prescriptionDate) {
      updateData.prescriptionDate = new Date(
        updateLensDetailDto.prescriptionDate,
      );
    }

    await this.lensDetailRepository.update(
      { id, deletedAt: IsNull() },
      updateData,
    );

    return this.findById(id);
  }

  async delete(id: number, reqUserId: number): Promise<boolean> {
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

    if (lensDetail.thicknessPrice) {
      totalPrice += lensDetail.thicknessPrice;
    }

    if (lensDetail.qualityPrice) {
      totalPrice += lensDetail.qualityPrice;
    }

    if (lensDetail.tintPrice) {
      totalPrice += lensDetail.tintPrice;
    }

    return totalPrice;
  }
}
