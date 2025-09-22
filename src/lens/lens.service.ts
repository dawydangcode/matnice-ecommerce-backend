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

  // New method for getting lens cards with full info for frontend
  async getLensCards(
    pagination?: PaginationParamsModel,
    search?: string,
    brandLensIds?: number[],
    categoryLensIds?: number[],
    lensTypes?: LensType[],
    minPrice?: number,
    maxPrice?: number,
    sortBy: 'price' | 'name' | 'newest' = 'newest',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    const offset = pagination ? (pagination.page - 1) * pagination.limit : 0;
    const limit = pagination?.limit || 20;

    // Ensure limit and offset are numbers
    const numericLimit = Number(limit);
    const numericOffset = Number(offset);

    let query = `
      SELECT 
        l.id,
        l.name,
        l.description,
        l.lens_type as lensType,
        l.origin,
        bl.id as brandLensId,
        bl.name as brandLensName,
        bl.description as brandLensDescription,
        cl.id as categoryLensId,
        cl.name as categoryLensName,
        cl.description as categoryLensDescription,
        MIN(lv.price) as basePrice
      FROM lens l
      LEFT JOIN brand_lens bl ON l.brand_lens_id = bl.id AND bl.deleted_at IS NULL
      LEFT JOIN lens_category lcat ON l.id = lcat.lens_id AND lcat.deleted_at IS NULL
      LEFT JOIN category_lens cl ON lcat.category_lens_id = cl.id AND cl.deleted_at IS NULL
      LEFT JOIN lens_variant lv ON l.id = lv.lens_id AND lv.deleted_at IS NULL
      WHERE l.deleted_at IS NULL
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND l.name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (brandLensIds && brandLensIds.length > 0) {
      query += ` AND bl.id IN (${brandLensIds.map(() => '?').join(',')})`;
      params.push(...brandLensIds);
    }

    if (categoryLensIds && categoryLensIds.length > 0) {
      query += ` AND cl.id IN (${categoryLensIds.map(() => '?').join(',')})`;
      params.push(...categoryLensIds);
    }

    if (lensTypes && lensTypes.length > 0) {
      query += ` AND l.lens_type IN (${lensTypes.map(() => '?').join(',')})`;
      params.push(...lensTypes);
    }

    query += ` GROUP BY l.id, l.name, l.description, l.lens_type, l.origin, bl.id, bl.name, bl.description, cl.id, cl.name, cl.description`;

    if (minPrice !== undefined || maxPrice !== undefined) {
      query += ` HAVING 1=1`;
      if (minPrice !== undefined) {
        query += ` AND basePrice >= ?`;
        params.push(minPrice);
      }
      if (maxPrice !== undefined) {
        query += ` AND basePrice <= ?`;
        params.push(maxPrice);
      }
    }

    // Sorting
    if (sortBy === 'price') {
      query += ` ORDER BY basePrice ${sortOrder}`;
    } else if (sortBy === 'name') {
      query += ` ORDER BY l.name ${sortOrder}`;
    } else {
      query += ` ORDER BY l.created_at ${sortOrder}`;
    }

    // Pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(numericLimit, numericOffset);

    const lenses = await this.lensRepository.query(query, params);

    // Count total
    let countQuery = `
      SELECT COUNT(DISTINCT l.id) as total
      FROM lens l
      LEFT JOIN brand_lens bl ON l.brand_lens_id = bl.id AND bl.deleted_at IS NULL
      LEFT JOIN lens_category lcat ON l.id = lcat.lens_id AND lcat.deleted_at IS NULL
      LEFT JOIN category_lens cl ON lcat.category_lens_id = cl.id AND cl.deleted_at IS NULL
      LEFT JOIN lens_variant lv ON l.id = lv.lens_id AND lv.deleted_at IS NULL
      WHERE l.deleted_at IS NULL
    `;

    const countParams: any[] = [];

    if (search) {
      countQuery += ` AND l.name LIKE ?`;
      countParams.push(`%${search}%`);
    }

    if (brandLensIds && brandLensIds.length > 0) {
      countQuery += ` AND bl.id IN (${brandLensIds.map(() => '?').join(',')})`;
      countParams.push(...brandLensIds);
    }

    if (categoryLensIds && categoryLensIds.length > 0) {
      countQuery += ` AND cl.id IN (${categoryLensIds.map(() => '?').join(',')})`;
      countParams.push(...categoryLensIds);
    }

    if (lensTypes && lensTypes.length > 0) {
      countQuery += ` AND l.lens_type IN (${lensTypes.map(() => '?').join(',')})`;
      countParams.push(...lensTypes);
    }

    const countResult = await this.lensRepository.query(
      countQuery,
      countParams,
    );
    const total = countResult[0]?.total || 0;

    // Get images for each lens
    for (const lens of lenses) {
      const images = await this.lensRepository.query(
        `SELECT id, image_url as imageUrl, image_order as imageOrder, is_thumbnail as isThumbnail 
         FROM lens_image 
         WHERE lens_id = ? AND deleted_at IS NULL 
         ORDER BY image_order, id`,
        [lens.id],
      );
      lens.images = images;
    }

    // Transform data
    const lensCards = lenses.map((lens) => ({
      id: lens.id,
      name: lens.name,
      description: lens.description,
      type: lens.lensType,
      basePrice: lens.basePrice || 0,
      images: lens.images || [],
      brandLens: lens.brandLensId
        ? {
            id: lens.brandLensId,
            name: lens.brandLensName,
          }
        : undefined,
      categoryLens: lens.categoryLensId
        ? {
            id: lens.categoryLensId,
            name: lens.categoryLensName,
          }
        : undefined,
    }));

    return {
      data: lensCards,
      total: parseInt(total),
      page: pagination?.page || 1,
      limit: numericLimit,
      totalPages: Math.ceil(total / numericLimit),
    };
  }

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

  // New method to filter lenses by prescription values
  async filterLensesByPrescription(
    prescriptionData: {
      sphereLeft?: number;
      sphereRight?: number;
      cylinderLeft?: number;
      cylinderRight?: number;
      addLeft?: number;
      addRight?: number;
    },
    pagination?: PaginationParamsModel,
  ) {
    const offset = pagination ? (pagination.page - 1) * pagination.limit : 0;
    const limit = pagination?.limit || 20;

    // Collect all prescription values that need to be checked
    const prescriptionValues: Array<{ type: string; value: number }> = [];

    if (prescriptionData.sphereLeft !== undefined) {
      prescriptionValues.push({
        type: 'SPHERICAL',
        value: prescriptionData.sphereLeft,
      });
    }
    if (prescriptionData.sphereRight !== undefined) {
      prescriptionValues.push({
        type: 'SPHERICAL',
        value: prescriptionData.sphereRight,
      });
    }
    if (prescriptionData.cylinderLeft !== undefined) {
      prescriptionValues.push({
        type: 'CYLINDRICAL',
        value: prescriptionData.cylinderLeft,
      });
    }
    if (prescriptionData.cylinderRight !== undefined) {
      prescriptionValues.push({
        type: 'CYLINDRICAL',
        value: prescriptionData.cylinderRight,
      });
    }
    if (prescriptionData.addLeft !== undefined) {
      prescriptionValues.push({
        type: 'ADDITIONAL',
        value: prescriptionData.addLeft,
      });
    }
    if (prescriptionData.addRight !== undefined) {
      prescriptionValues.push({
        type: 'ADDITIONAL',
        value: prescriptionData.addRight,
      });
    }

    // If no prescription values provided, return all lenses
    if (prescriptionValues.length === 0) {
      const query = `
        SELECT DISTINCT
          l.id,
          l.name,
          l.description,
          l.lens_type as lensType,
          l.origin,
          l.status,
          bl.id as brandLensId,
          bl.name as brandLensName,
          bl.description as brandLensDescription,
          MIN(lv.price) as basePrice,
          li.image_url as imageUrl,
          li.image_order as imageOrder,
          li.is_thumbnail as isThumbnail
        FROM lens l
        LEFT JOIN brand_lens bl ON l.brand_lens_id = bl.id AND bl.deleted_at IS NULL
        LEFT JOIN lens_variant lv ON l.id = lv.lens_id AND lv.deleted_at IS NULL
        LEFT JOIN lens_image li ON l.id = li.lens_id AND li.deleted_at IS NULL AND li.is_thumbnail = 1
        WHERE l.deleted_at IS NULL 
          AND l.status = 'IN_STOCK'
        GROUP BY l.id, l.name, l.description, l.lens_type, l.origin, l.status, 
                 bl.id, bl.name, bl.description, li.image_url, li.image_order, li.is_thumbnail
        ORDER BY l.created_at DESC
        LIMIT ${Number(limit)} OFFSET ${Number(offset)}
      `;

      const lenses = await this.lensRepository.query(query);
      const countQuery = `
        SELECT COUNT(DISTINCT l.id) as total
        FROM lens l
        WHERE l.deleted_at IS NULL AND l.status = 'IN_STOCK'
      `;
      const totalResult = await this.lensRepository.query(countQuery);
      const total = totalResult[0]?.total || 0;

      const formattedLenses = lenses.map((lens: any) => ({
        id: lens.id,
        name: lens.name,
        description: lens.description,
        lensType: lens.lensType,
        origin: lens.origin,
        status: lens.status,
        basePrice: Number(lens.basePrice) || 0,
        brandLens: lens.brandLensId
          ? {
              id: lens.brandLensId,
              name: lens.brandLensName,
              description: lens.brandLensDescription,
            }
          : null,
        imageUrl: lens.imageUrl,
        imageOrder: lens.imageOrder,
        isThumbnail: Boolean(lens.isThumbnail),
      }));

      return {
        data: formattedLenses,
        meta: {
          total: Number(total),
          page: pagination?.page || 1,
          limit: pagination?.limit || 20,
          totalPages: Math.ceil(Number(total) / (pagination?.limit || 20)),
        },
      };
    }

    // Build query to find lenses that can accommodate ALL prescription values
    // We need to ensure that for each prescription value, there exists a corresponding refraction range
    let query = `
      SELECT DISTINCT
        l.id,
        l.name,
        l.description,
        l.lens_type as lensType,
        l.origin,
        l.status,
        bl.id as brandLensId,
        bl.name as brandLensName,
        bl.description as brandLensDescription,
        MIN(lv.price) as basePrice,
        li.image_url as imageUrl,
        li.image_order as imageOrder,
        li.is_thumbnail as isThumbnail
      FROM lens l
      LEFT JOIN brand_lens bl ON l.brand_lens_id = bl.id AND bl.deleted_at IS NULL
      LEFT JOIN lens_variant lv ON l.id = lv.lens_id AND lv.deleted_at IS NULL
      LEFT JOIN lens_image li ON l.id = li.lens_id AND li.deleted_at IS NULL AND li.is_thumbnail = 1
      WHERE l.deleted_at IS NULL 
        AND l.status = 'IN_STOCK'
    `;

    // For each prescription value, we need to ensure there's a compatible range
    const subqueryConditions: string[] = [];
    const params: any[] = [];

    prescriptionValues.forEach((prescription, index) => {
      const subquery = `
        EXISTS (
          SELECT 1 
          FROM lens_variant lv${index}
          JOIN lens_refraction_range lrr${index} ON lv${index}.id = lrr${index}.lens_variant_id
          WHERE lv${index}.lens_id = l.id 
            AND lv${index}.deleted_at IS NULL
            AND lrr${index}.deleted_at IS NULL
            AND lrr${index}.refraction_type = ?
            AND ? BETWEEN lrr${index}.min_value AND lrr${index}.max_value
        )
      `;
      subqueryConditions.push(subquery);
      params.push(prescription.type, prescription.value);
    });

    if (subqueryConditions.length > 0) {
      query += ` AND ${subqueryConditions.join(' AND ')}`;
    }

    query += ` 
      GROUP BY l.id, l.name, l.description, l.lens_type, l.origin, l.status, 
               bl.id, bl.name, bl.description, li.image_url, li.image_order, li.is_thumbnail
      ORDER BY l.created_at DESC
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `;

    // Execute the query
    const lenses = await this.lensRepository.query(query, params);

    // Count total for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT l.id) as total
      FROM lens l
      WHERE l.deleted_at IS NULL 
        AND l.status = 'IN_STOCK'
    `;

    if (subqueryConditions.length > 0) {
      countQuery += ` AND ${subqueryConditions.join(' AND ')}`;
    }

    const totalResult = await this.lensRepository.query(countQuery, params);
    const total = totalResult[0]?.total || 0;

    // Format the results
    const formattedLenses = lenses.map((lens: any) => ({
      id: lens.id,
      name: lens.name,
      description: lens.description,
      lensType: lens.lensType,
      origin: lens.origin,
      status: lens.status,
      basePrice: Number(lens.basePrice) || 0,
      brandLens: lens.brandLensId
        ? {
            id: lens.brandLensId,
            name: lens.brandLensName,
            description: lens.brandLensDescription,
          }
        : null,
      imageUrl: lens.imageUrl,
      imageOrder: lens.imageOrder,
      isThumbnail: Boolean(lens.isThumbnail),
    }));

    return {
      data: formattedLenses,
      meta: {
        total: Number(total),
        page: pagination?.page || 1,
        limit: pagination?.limit || 20,
        totalPages: Math.ceil(Number(total) / (pagination?.limit || 20)),
      },
    };
  }
}
