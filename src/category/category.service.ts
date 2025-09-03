import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { In, IsNull, Like, Repository } from 'typeorm';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { CategoryModel } from './models/category.model';
import { PageList } from 'src/common/models/page-list.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getCategories(
    categoryIds: number[] | undefined,
    name: string | undefined,
    description: string | undefined,
    pagination: PaginationParamsModel | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<CategoryModel>> {
    const [categories, total] = await this.categoryRepository.findAndCount({
      where: {
        id: categoryIds ? In(categoryIds) : undefined,
        name: name ? Like(`%${name}%`) : undefined,
        description: description ? Like(`%${description}%`) : undefined,
        deletedAt: IsNull(),
      },
      relations: relations,
      ...pagination?.toQuery(),
    });

    return new PageList<CategoryModel>(
      total,
      categories.map((category: CategoryEntity) => category.toModel()),
    );
  }

  async getCategoryById(categoryId: number): Promise<CategoryModel> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
        deletedAt: IsNull(),
      },
    });

    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }

    return category.toModel();
  }

  async createCategory(
    name: string,
    description: string,
    reqUserId: number,
  ): Promise<CategoryModel> {
    const entity = new CategoryEntity();
    entity.name = name;
    entity.description = description;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    return await this.categoryRepository.save(entity);
  }

  async updateCategory(
    category: CategoryModel,
    name: string | undefined,
    description: string | undefined,
    reqUserId: number,
  ): Promise<CategoryModel> {
    await this.categoryRepository.update(
      { id: category.id, deletedAt: IsNull() },
      {
        name: name,
        description: description,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return this.getCategoryById(category.id);
  }

  async deleteCategory(
    category: CategoryModel,
    reqUserId: number,
  ): Promise<boolean> {
    await this.categoryRepository.update(
      { id: category.id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );
    return true;
  }
}
