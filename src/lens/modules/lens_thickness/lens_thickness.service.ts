import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Like, In } from 'typeorm';
import { LensThicknessEntity } from './entities/lens_thickness.entity';
import { LensThicknessModel } from './models/lens_thickness.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';

export interface LensThicknessResponse {
  data: LensThicknessModel[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class LensThicknessService {
  constructor(
    @InjectRepository(LensThicknessEntity)
    private readonly lensThicknessRepository: Repository<LensThicknessEntity>,
  ) {}

  async getLensThicknesses(
    lensThicknessIds: number[] | undefined,
    name: string | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    isActive: boolean | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<LensThicknessModel>> {
    const [lensThicknesses, total] =
      await this.lensThicknessRepository.findAndCount({
        where: {
          id: lensThicknessIds ? In(lensThicknessIds) : undefined,
          name: search ? Like(`%${search}%`) : name,
          isActive: isActive,
          deletedAt: IsNull(),
        },
        relations: relations,
        ...pagination?.toQuery(),
      });

    return new PageList<LensThicknessModel>(
      total,
      lensThicknesses.map((thickness: LensThicknessEntity) =>
        thickness.toModel(),
      ),
    );
  }

  async getLensThicknessById(
    lensThicknessId: number,
  ): Promise<LensThicknessModel> {
    const lensThickness = await this.lensThicknessRepository.findOne({
      where: { id: lensThicknessId, deletedAt: IsNull() },
    });

    if (!lensThickness) {
      throw new HttpException('Lens thickness not found', HttpStatus.NOT_FOUND);
    }

    return lensThickness.toModel();
  }

  async createLensThickness(
    name: string,
    description: string,
    thickness: number,
    unit: string,
    isActive: boolean,
    reqUserId: number,
  ): Promise<LensThicknessModel> {
    const entity = new LensThicknessEntity();
    entity.name = name;
    entity.description = description;
    entity.thickness = thickness;
    entity.unit = unit;
    entity.isActive = isActive;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedThickness = await this.lensThicknessRepository.save(entity);
    return savedThickness.toModel();
  }

  async updateLensThickness(
    lensThickness: LensThicknessModel,
    name: string | undefined,
    description: string | undefined,
    thickness: number | undefined,
    unit: string | undefined,
    isActive: boolean | undefined,
    reqUserId: number,
  ): Promise<LensThicknessModel> {
    await this.lensThicknessRepository.update(
      { id: lensThickness.id, deletedAt: IsNull() },
      {
        name: name,
        description: description,
        thickness: thickness,
        unit: unit,
        isActive: isActive,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getLensThicknessById(lensThickness.id);
  }

  async deleteLensThickness(
    lensThickness: LensThicknessModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.lensThicknessRepository.update(
      { id: lensThickness.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
