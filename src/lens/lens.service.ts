import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';
import { LensEntity } from './entities/lens.entity';
import { LensModel } from './models/lens.model';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { LensType } from './enum/lens.type';
import { LensStatusType } from './enum/lens-status.type';

@Injectable()
export class LensService {
  constructor(
    @InjectRepository(LensEntity)
    private readonly lensRepository: Repository<LensEntity>,
  ) {}
  async getLenses(
    lensIds: number[] | undefined,
    name: string | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<LensModel>> {
    const whereCondition: any = {
      deletedAt: IsNull(),
    };

    if (lensIds) {
      whereCondition.id = In(lensIds);
    }

    if (search) {
      whereCondition.name = Like(`%${search}%`);
    } else if (name) {
      whereCondition.name = name;
    }

    const [lenses, total] = await this.lensRepository.findAndCount({
      where: whereCondition,
      relations: relations,
      ...pagination?.toQuery(),
    });

    return new PageList<LensModel>(
      total,
      lenses.map((lens: LensEntity) => lens.toModel()),
    );
  }

  async getLensById(id: number): Promise<LensModel> {
    const lens = await this.lensRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!lens) {
      throw new HttpException('Lens not found', HttpStatus.NOT_FOUND);
    }

    return lens.toModel();
  }

  async createLens(
    name: string,
    brandId: number,
    origin: string,
    lensType: LensType,
    status: LensStatusType,
    description: string | undefined,
    reqUserId: number,
  ): Promise<LensModel> {
    const entity = new LensEntity();
    entity.name = name;
    entity.brandId = brandId;
    entity.origin = origin;
    entity.lensType = lensType;
    entity.status = status;
    entity.description = description;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    return await this.lensRepository.save(entity);
  }

  async updateLens(
    lens: LensModel,
    name: string | undefined,
    brandId: number | undefined,
    origin: string | undefined,
    lensType: LensType | undefined,
    status: LensStatusType | undefined,
    description: string | undefined,
    reqUserId: number,
  ): Promise<LensModel> {
    await this.lensRepository.update(
      { id: lens.id, deletedAt: IsNull() },
      {
        name: name,
        brandId: brandId,
        origin: origin,
        lensType: lensType,
        status: status,
        description: description,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return this.getLensById(lens.id);
  }

  async deleteLens(lens: LensModel, reqUserId: number): Promise<boolean> {
    await this.lensRepository.update(
      { id: lens.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async checkLensExists(lens: LensModel): Promise<boolean> {
    const count = await this.lensRepository.count({
      where: { id: lens.id, deletedAt: IsNull() },
    });
    return count > 0;
  }
}
