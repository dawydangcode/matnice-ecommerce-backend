import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { LensThicknessEntity } from './entities/lens_thickness.entity';
import { LensThicknessModel } from './models/lens_thickness.model';

@Injectable()
export class LensThicknessService {
  constructor(
    @InjectRepository(LensThicknessEntity)
    private readonly lensThicknessRepository: Repository<LensThicknessEntity>,
  ) {}

  async getLensThickness(): Promise<LensThicknessModel[]> {
    return this.lensThicknessRepository.find({
      where: { deletedAt: IsNull() },
    });
  }

  async getLensThicknessById(
    lenThicknessId: number,
  ): Promise<LensThicknessModel> {
    const entity = await this.lensThicknessRepository.findOne({
      where: { id: lenThicknessId, deletedAt: IsNull() },
    });
    if (!entity) {
      throw new Error(`Lens thickness with ID ${lenThicknessId} not found`);
    }

    return entity.toModel();
  }

  async createLensThickness(
    name: string,
    indexValue: number,
    price: number,
    description: string,
    reqUserId: number,
  ): Promise<LensThicknessModel> {
    const entity = new LensThicknessEntity();
    entity.name = name;
    entity.indexValue = indexValue;
    entity.price = price;
    entity.description = description;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    return this.lensThicknessRepository.save(entity);
  }

  async updateLensThickness(
    lensThickness: LensThicknessModel,
    name: string | undefined,
    indexValue: number | undefined,
    price: number | undefined,
    description: string | undefined,
    reqUserId: number,
  ): Promise<LensThicknessModel> {
    await this.lensThicknessRepository.update(
      { id: lensThickness.id, deletedAt: IsNull() },
      {
        name: name,
        indexValue: indexValue,
        price: price,
        description: description,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return this.getLensThicknessById(lensThickness.id);
  }

  async deleteLensThickness(lensThickness: LensThicknessModel): Promise<true> {
    await this.lensThicknessRepository.update(
      { id: lensThickness.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: lensThickness.updatedBy,
      },
    );

    return true;
  }
}
