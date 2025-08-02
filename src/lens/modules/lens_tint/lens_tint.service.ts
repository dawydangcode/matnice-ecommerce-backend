import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { LensTintEntity } from './entities/lens_tint.entity';
import { TintColorEntity } from './entities/tint_color.entity';
import { LensTintModel } from './models/lens_tint.model';
import { TintColorModel } from './models/tint_color.model';

@Injectable()
export class LensTintService {
  constructor(
    @InjectRepository(LensTintEntity)
    private readonly lensTintRepository: Repository<LensTintEntity>,
    @InjectRepository(TintColorEntity)
    private readonly tintColorRepository: Repository<TintColorEntity>,
  ) {}

  async findAllTints(): Promise<LensTintModel[]> {
    const tints = await this.lensTintRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    return tints.map((tint) => tint.toModel());
  }

  async findTintById(id: number): Promise<LensTintModel> {
    const tint = await this.lensTintRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!tint) {
      throw new HttpException('Lens tint not found', HttpStatus.NOT_FOUND);
    }

    return tint.toModel();
  }

  async findAllTintColors(): Promise<TintColorModel[]> {
    const colors = await this.tintColorRepository.find({
      where: { deleted_at: IsNull() },
      order: { created_at: 'DESC' },
    });

    return colors.map((color) => color.toModel());
  }

  async findTintColorsByTintId(tintId: number): Promise<TintColorModel[]> {
    const colors = await this.tintColorRepository.find({
      where: { tint_id: tintId, deleted_at: IsNull() },
      order: { created_at: 'DESC' },
    });

    return colors.map((color) => color.toModel());
  }
}
