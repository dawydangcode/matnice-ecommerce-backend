import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

  async findAll(): Promise<LensThicknessModel[]> {
    const thicknesses = await this.lensThicknessRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    return thicknesses.map((thickness) => thickness.toModel());
  }

  async findById(id: number): Promise<LensThicknessModel> {
    const thickness = await this.lensThicknessRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!thickness) {
      throw new HttpException('Lens thickness not found', HttpStatus.NOT_FOUND);
    }

    return thickness.toModel();
  }
}
