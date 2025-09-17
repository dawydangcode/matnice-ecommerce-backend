import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { PageList } from 'src/common/models/page-list.model';
import { CategoryLensEntity } from './entities/category-lens.entity';
import { CategoryLensModel } from './models/category-lens.model';

@Injectable()
export class CategoryLensService {
  constructor(
    @InjectRepository(CategoryLensEntity)
    private readonly categoryLensRepository: Repository<CategoryLensEntity>,
  ) {}

  async getCategoriesLens(
    categoryIds: number[] | undefined,
    name: string | undefined,
    description: string | undefined,
    pagination: PaginationParamsModel | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<CategoryLensModel>> {
    const [categoriesLens, total] =
      await this.categoryLensRepository.findAndCount({
        where: {
          id: categoryIds ? In(categoryIds) : undefined,
          name: name ? Like(`%${name}%`) : undefined,
          description: description ? Like(`%${description}%`) : undefined,
          deletedAt: IsNull(),
        },
        relations: relations,
        ...pagination?.toQuery(),
      });

    return new PageList<CategoryLensModel>(
      total,
      categoriesLens.map((categoryLens: CategoryLensEntity) =>
        categoryLens.toModel(),
      ),
    );
  }

  async getCategoryLensById(
    categoryLensId: number,
  ): Promise<CategoryLensModel> {
    const categoryLens = await this.categoryLensRepository.findOne({
      where: {
        id: categoryLensId,
        deletedAt: IsNull(),
      },
    });

    if (!categoryLens) {
      throw new Error(`Category with ID ${categoryLensId} not found`);
    }

    return categoryLens.toModel();
  }

  async createCategoryLens(
    name: string,
    description: string,
    reqUserId: number,
  ): Promise<CategoryLensModel> {
    const entity = new CategoryLensEntity();
    entity.name = name;
    entity.description = description;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    return await this.categoryLensRepository.save(entity);
  }

  async updateCategoryLens(
    categoryLens: CategoryLensModel,
    name: string | undefined,
    description: string | undefined,
    reqUserId: number,
  ): Promise<CategoryLensModel> {
    await this.categoryLensRepository.update(
      { id: categoryLens.id, deletedAt: IsNull() },
      {
        name: name,
        description: description,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return this.getCategoryLensById(categoryLens.id);
  }

  async deleteCategoryLens(
    categoryLens: CategoryLensModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.categoryLensRepository.update(
      { id: categoryLens.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );
    return true;
  }
}
