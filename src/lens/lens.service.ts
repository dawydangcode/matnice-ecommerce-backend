import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';
import { LensEntity } from './entities/lens.entity';
import { LensModel } from './models/lens.model';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { LensType } from './enum/lens.type';
import { LensStatusType } from './enum/lens-status.type';
import { LensFullDetailsResponseDto } from './dtos/lens-full-details.dto';

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

  async getLensFullDetails(
    lensId: number,
    include: string[] = ['variants', 'coatings', 'images', 'categories'],
  ): Promise<LensFullDetailsResponseDto> {
    // Lấy lens basic info
    const lens = await this.lensRepository.findOne({
      where: { id: lensId, deletedAt: IsNull() },
    });

    if (!lens) {
      throw new HttpException('Lens not found', HttpStatus.NOT_FOUND);
    }

    // Lấy brand lens info
    const brandLensQuery = await this.lensRepository.query(
      `SELECT id, name, description FROM brand_lens WHERE id = ? AND deleted_at IS NULL`,
      [lens.brandId],
    );

    const brandLens = brandLensQuery[0] || { id: 0, name: '', description: '' };

    const result: LensFullDetailsResponseDto = {
      lens: {
        id: lens.id,
        name: lens.name,
        origin: lens.origin,
        lensType: lens.lensType,
        status: lens.status,
        description: lens.description || '',
        createdAt: lens.createdAt,
        brandLens: {
          id: brandLens.id,
          name: brandLens.name,
          description: brandLens.description,
        },
      },
    };

    // Lấy categories nếu được yêu cầu
    if (include.includes('categories')) {
      const categories = await this.lensRepository.query(
        `SELECT cl.id, cl.name, cl.description FROM category_lens cl INNER JOIN lens_category lc ON cl.id = lc.category_lens_id WHERE lc.lens_id = ? AND lc.deleted_at IS NULL`,
        [lensId],
      );

      result.categories = categories;
    }

    // Lấy variants với tất cả thông tin chi tiết nếu được yêu cầu
    if (include.includes('variants')) {
      const variants = await this.lensRepository.query(
        `SELECT lv.id, lv.lens_thickness_id as lensThicknessId, lv.design, lv.material, lv.price, lv.stock, lt.id as thickness_id, lt.name as thickness_name, lt.index_value as thickness_indexValue, lt.price as thickness_price, lt.description as thickness_description FROM lens_variant lv LEFT JOIN lens_thickness lt ON lv.lens_thickness_id = lt.id WHERE lv.lens_id = ? AND lv.deleted_at IS NULL`,
        [lensId],
      );

      // Lấy refraction ranges và tint colors cho mỗi variant
      for (const variant of variants) {
        const refractionRanges = await this.lensRepository.query(
          `SELECT id, refraction_type as refractionType, min_value as minValue, max_value as maximumValue, step_value as stepValue FROM lens_refraction_range WHERE lens_variant_id = ? AND deleted_at IS NULL`,
          [variant.id],
        );

        const tintColors = await this.lensRepository.query(
          `SELECT id, name, image_url as imageUrl, color_code as colorCode FROM lens_tint_color WHERE lens_variant_id = ? AND deleted_at IS NULL`,
          [variant.id],
        );

        variant.refractionRanges = refractionRanges;
        variant.tintColors = tintColors;
        variant.lensThickness = {
          id: variant.thickness_id,
          name: variant.thickness_name,
          indexValue: variant.thickness_indexValue,
          price: variant.thickness_price,
          description: variant.thickness_description,
        };

        // Cleanup temporary fields
        delete variant.thickness_id;
        delete variant.thickness_name;
        delete variant.thickness_indexValue;
        delete variant.thickness_price;
        delete variant.thickness_description;
      }

      result.variants = variants;
    }

    // Lấy coatings nếu được yêu cầu
    if (include.includes('coatings')) {
      const coatings = await this.lensRepository.query(
        `SELECT id, name, price, description FROM lens_coating WHERE lens_id = ? AND deleted_at IS NULL`,
        [lensId],
      );

      result.coatings = coatings;
    }

    // Lấy images nếu được yêu cầu
    if (include.includes('images')) {
      const images = await this.lensRepository.query(
        `SELECT id, image_url as imageUrl, image_order as imageOrder, is_thumbnail as isThumbnail FROM lens_image WHERE lens_id = ? AND deleted_at IS NULL ORDER BY image_order`,
        [lensId],
      );

      result.images = images.map((img: any) => ({
        ...img,
        isThumbnail: Boolean(img.isThumbnail),
      }));
    }

    // Tính toán summary statistics nếu có variants
    if (result.variants && result.variants.length > 0) {
      const prices = result.variants.map((v) => v.price).filter((p) => p > 0);
      const stocks = result.variants.map((v) => v.stock);

      result.summary = {
        totalVariants: result.variants.length,
        totalCoatings: result.coatings?.length || 0,
        totalImages: result.images?.length || 0,
        priceRange: {
          min: prices.length > 0 ? Math.min(...prices) : 0,
          max: prices.length > 0 ? Math.max(...prices) : 0,
        },
        availableStock: stocks.reduce((sum, stock) => sum + stock, 0),
      };
    }

    return result;
  }
}
