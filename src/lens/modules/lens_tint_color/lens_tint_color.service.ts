import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Like, In } from 'typeorm';
import { LensTintColorEntity } from './entities/lens_tint_color.entity';
import { LensTintColorModel } from './models/lens_tint_color.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';

@Injectable()
export class LensTintColorService {
  constructor(
    @InjectRepository(LensTintColorEntity)
    private readonly lensTintColorRepository: Repository<LensTintColorEntity>,
  ) {}

  async getLensTintColors(
    lensTintColorIds: number[] | undefined,
    lensVariantId: number | undefined,
    name: string | undefined,
    pagination: PaginationParamsModel | undefined,
    search: string | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<LensTintColorModel>> {
    const [lensTintColors, total] =
      await this.lensTintColorRepository.findAndCount({
        where: {
          id: lensTintColorIds ? In(lensTintColorIds) : undefined,
          lensVariantId: lensVariantId,
          name: search ? Like(`%${search}%`) : name,
          deletedAt: IsNull(),
        },
        relations: relations,
        ...pagination?.toQuery(),
      });

    return new PageList<LensTintColorModel>(
      total,
      lensTintColors.map((tintColor: LensTintColorEntity) =>
        tintColor.toModel(),
      ),
    );
  }

  async getLensTintColorById(
    lensTintColorId: number,
  ): Promise<LensTintColorModel> {
    const lensTintColor = await this.lensTintColorRepository.findOne({
      where: { id: lensTintColorId, deletedAt: IsNull() },
    });

    if (!lensTintColor) {
      throw new HttpException(
        'Lens tint color not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return lensTintColor.toModel();
  }

  async createLensTintColor(
    lensVariantId: number,
    name: string,
    imageUrl: string,
    colorCode: string,
    reqUserId: number,
  ): Promise<LensTintColorModel> {
    const entity = new LensTintColorEntity();
    entity.lensVariantId = lensVariantId;
    entity.name = name;
    entity.imageUrl = imageUrl;
    entity.colorCode = colorCode;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedTintColor = await this.lensTintColorRepository.save(entity);
    return savedTintColor.toModel();
  }

  async updateLensTintColor(
    lensTintColor: LensTintColorModel,
    name: string | undefined,
    imageUrl: string | undefined,
    colorCode: string | undefined,
    reqUserId: number,
  ): Promise<LensTintColorModel> {
    await this.lensTintColorRepository.update(
      { id: lensTintColor.id, deletedAt: IsNull() },
      {
        name: name,
        imageUrl: imageUrl,
        colorCode: colorCode,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getLensTintColorById(lensTintColor.id);
  }

  async deleteLensTintColor(
    lensTintColor: LensTintColorModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.lensTintColorRepository.update(
      { id: lensTintColor.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }
}
