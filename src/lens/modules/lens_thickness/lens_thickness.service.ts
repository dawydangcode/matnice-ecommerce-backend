import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { LensThicknessEntity } from './entities/lens_thickness.entity';

@Injectable()
export class LensThicknessService {
  constructor(
    @InjectRepository(LensThicknessEntity)
    private readonly lensThicknessRepository: Repository<LensThicknessEntity>,
  ) {}

  async findAll(): Promise<LensThicknessEntity[]> {
    return this.lensThicknessRepository.find({
      where: { deletedAt: IsNull() },
    });
  }

  async findById(id: number): Promise<LensThicknessEntity | null> {
    return this.lensThicknessRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async create(
    data: Partial<LensThicknessEntity>,
  ): Promise<LensThicknessEntity> {
    const entity = this.lensThicknessRepository.create(data);
    return this.lensThicknessRepository.save(entity);
  }

  async update(
    id: number,
    data: Partial<LensThicknessEntity>,
  ): Promise<LensThicknessEntity | null> {
    await this.lensThicknessRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.lensThicknessRepository.softDelete(id);
  }
}
