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
        (SELECT cl.id FROM lens_category lcat 
         JOIN category_lens cl ON lcat.category_lens_id = cl.id 
         WHERE lcat.lens_id = l.id AND lcat.deleted_at IS NULL AND cl.deleted_at IS NULL 
         LIMIT 1) as categoryLensId,
        (SELECT cl.name FROM lens_category lcat 
         JOIN category_lens cl ON lcat.category_lens_id = cl.id 
         WHERE lcat.lens_id = l.id AND lcat.deleted_at IS NULL AND cl.deleted_at IS NULL 
         LIMIT 1) as categoryLensName,
        (SELECT cl.description FROM lens_category lcat 
         JOIN category_lens cl ON lcat.category_lens_id = cl.id 
         WHERE lcat.lens_id = l.id AND lcat.deleted_at IS NULL AND cl.deleted_at IS NULL 
         LIMIT 1) as categoryLensDescription,
        MIN(lv.price) as basePrice
      FROM lens l
      LEFT JOIN brand_lens bl ON l.brand_lens_id = bl.id AND bl.deleted_at IS NULL
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
      query += ` AND l.id IN (
        SELECT lcat.lens_id FROM lens_category lcat 
        JOIN category_lens cl ON lcat.category_lens_id = cl.id 
        WHERE cl.id IN (${categoryLensIds.map(() => '?').join(',')}) 
        AND lcat.deleted_at IS NULL AND cl.deleted_at IS NULL
      )`;
      params.push(...categoryLensIds);
    }

    if (lensTypes && lensTypes.length > 0) {
      query += ` AND l.lens_type IN (${lensTypes.map(() => '?').join(',')})`;
      params.push(...lensTypes);
    }

    query += ` GROUP BY l.id, l.name, l.description, l.lens_type, l.origin, bl.id, bl.name, bl.description`;

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

    // Debug: Check for duplicate lens IDs
    const lensIds = lenses.map((lens: any) => lens.id);
    const duplicateIds = lensIds.filter(
      (id: any, index: number) => lensIds.indexOf(id) !== index,
    );
    if (duplicateIds.length > 0) {
      console.log('Duplicate lens IDs found in query result:', duplicateIds);
      console.log('Query:', query);
      console.log('Params:', params);
      console.log('Full result:', lenses);
    }

    // Count total
    let countQuery = `
      SELECT COUNT(DISTINCT l.id) as total
      FROM lens l
      LEFT JOIN brand_lens bl ON l.brand_lens_id = bl.id AND bl.deleted_at IS NULL
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
      countQuery += ` AND l.id IN (
        SELECT lcat.lens_id FROM lens_category lcat 
        JOIN category_lens cl ON lcat.category_lens_id = cl.id 
        WHERE cl.id IN (${categoryLensIds.map(() => '?').join(',')}) 
        AND lcat.deleted_at IS NULL AND cl.deleted_at IS NULL
      )`;
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
      const variantPrices = result.variants
        .map((v) => v.price)
        .filter((p) => p > 0);
      const stocks = result.variants.map((v) => v.stock);

      // Tính khoảng giá đầy đủ
      let minPrice = 0;
      let maxPrice = 0;

      if (variantPrices.length > 0) {
        const minVariantPrice = Math.min(...variantPrices);
        const maxVariantPrice = Math.max(...variantPrices);

        // Giá coating
        const coatingPrices =
          result.coatings?.map((c) => Number(c.price)).filter((p) => p > 0) ||
          [];
        const minCoatingPrice =
          coatingPrices.length > 0 ? Math.min(...coatingPrices) : 0;
        const maxCoatingPrice =
          coatingPrices.length > 0 ? Math.max(...coatingPrices) : 0;

        // Tính khoảng giá cuối cùng
        minPrice = minVariantPrice; // Giá thấp nhất không cộng coating
        maxPrice = maxVariantPrice + maxCoatingPrice; // Giá cao nhất cộng coating cao nhất
      }

      result.summary = {
        totalVariants: result.variants.length,
        totalCoatings: result.coatings?.length || 0,
        totalImages: result.images?.length || 0,
        priceRange: {
          min: minPrice,
          max: maxPrice,
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
    lensType?: LensType,
  ) {
    const offset = pagination ? (pagination.page - 1) * pagination.limit : 0;
    const limit = pagination?.limit || 20;

    // Build the complex query to find lenses with compatible variants
    let baseQuery = `
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
      LEFT JOIN lens_refraction_range lrr ON lv.id = lrr.lens_variant_id AND lrr.deleted_at IS NULL
      LEFT JOIN lens_image li ON l.id = li.lens_id AND li.deleted_at IS NULL AND li.image_order = 'a'
      WHERE l.deleted_at IS NULL 
        AND l.status = 'IN_STOCK'
    `;

    const conditions: string[] = [];
    const params: any[] = [];

    // Add lens type filter if provided
    if (lensType) {
      baseQuery += ` AND l.lens_type = ?`;
      params.push(lensType);
    }

    // Check SPHERICAL values
    if (
      prescriptionData.sphereLeft !== undefined ||
      prescriptionData.sphereRight !== undefined
    ) {
      const sphereValues = [
        prescriptionData.sphereLeft,
        prescriptionData.sphereRight,
      ].filter((val) => val !== undefined);
      if (sphereValues.length > 0) {
        const sphereConditions = sphereValues.map((val) => {
          params.push(val, val);
          return `(lrr.refraction_type = 'SPHERICAL' AND ? BETWEEN lrr.min_value AND lrr.max_value)`;
        });
        conditions.push(`(${sphereConditions.join(' OR ')})`);
      }
    }

    // Check CYLINDRICAL values
    if (
      prescriptionData.cylinderLeft !== undefined ||
      prescriptionData.cylinderRight !== undefined
    ) {
      const cylinderValues = [
        prescriptionData.cylinderLeft,
        prescriptionData.cylinderRight,
      ].filter((val) => val !== undefined);
      if (cylinderValues.length > 0) {
        const cylinderConditions = cylinderValues.map((val) => {
          params.push(val, val);
          return `(lrr.refraction_type = 'CYLINDRICAL' AND ? BETWEEN lrr.min_value AND lrr.max_value)`;
        });
        conditions.push(`(${cylinderConditions.join(' OR ')})`);
      }
    }

    // Check ADD values
    if (
      prescriptionData.addLeft !== undefined ||
      prescriptionData.addRight !== undefined
    ) {
      const addValues = [
        prescriptionData.addLeft,
        prescriptionData.addRight,
      ].filter((val) => val !== undefined);
      if (addValues.length > 0) {
        const addConditions = addValues.map((val) => {
          params.push(val, val);
          return `(lrr.refraction_type = 'ADDITIONAL' AND ? BETWEEN lrr.min_value AND lrr.max_value)`;
        });
        conditions.push(`(${addConditions.join(' OR ')})`);
      }
    }

    // Build final query with conditions
    let query = baseQuery;
    if (conditions.length > 0) {
      query += ` AND (${conditions.join(' OR ')})`;
    }

    query += ` 
      GROUP BY l.id, l.name, l.description, l.lens_type, l.origin, l.status, 
               bl.id, bl.name, bl.description, li.image_url, li.image_order, li.is_thumbnail
      ORDER BY l.created_at DESC
    `;

    // Add pagination with direct values instead of parameters
    query += ` LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

    console.log('=== DEBUG FILTER LENSES BY PRESCRIPTION ===');
    console.log('Final query:', query);
    console.log('Query params:', params);
    console.log('Conditions:', conditions);

    // Execute the query with only WHERE condition parameters
    const lenses = await this.lensRepository.query(query, params);
    console.log('Query results count:', lenses.length);
    console.log('Query results:', lenses);

    // Count total for pagination (make sure to include lens type filter)
    let countQuery = `
      SELECT COUNT(DISTINCT l.id) as total
      FROM lens l
      LEFT JOIN lens_variant lv ON l.id = lv.lens_id AND lv.deleted_at IS NULL
      LEFT JOIN lens_refraction_range lrr ON lv.id = lrr.lens_variant_id AND lrr.deleted_at IS NULL
      WHERE l.deleted_at IS NULL 
        AND l.status = 'IN_STOCK'
    `;

    // Add lens type filter to count query as well
    if (lensType) {
      countQuery += ` AND l.lens_type = '${lensType}'`;
    }

    if (conditions.length > 0) {
      countQuery += ` AND (${conditions.join(' OR ')})`;
    }

    console.log('Count query:', countQuery);
    console.log('Count query params:', params);

    // Use the same parameters for count query
    const totalResult = await this.lensRepository.query(countQuery, params);
    const total = totalResult[0]?.total || 0;
    console.log('Total count result:', totalResult);

    // Format the results and calculate price ranges
    const formattedLenses = await Promise.all(
      lenses.map(async (lens: any) => {
        // Calculate price range for this lens
        const priceRange = await this.calculateLensPriceRange(lens.id);

        return {
          id: lens.id,
          name: lens.name,
          description: lens.description,
          lensType: lens.lensType,
          origin: lens.origin,
          status: lens.status,
          basePrice: Number(lens.basePrice) || 0,
          priceRange,
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
        };
      }),
    );

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

  private async calculateLensPriceRange(
    lensId: string,
  ): Promise<{ min: number; max: number }> {
    try {
      // Get variant prices
      const variantPrices = await this.lensRepository.query(
        `SELECT price FROM lens_variant WHERE lens_id = ? AND deleted_at IS NULL`,
        [lensId],
      );

      // Get coating prices
      const coatingPrices = await this.lensRepository.query(
        `SELECT price FROM lens_coating WHERE lens_id = ? AND deleted_at IS NULL`,
        [lensId],
      );

      const variants = variantPrices
        .map((v) => Number(v.price))
        .filter((p) => p > 0);
      const coatings = coatingPrices
        .map((c) => Number(c.price))
        .filter((p) => p > 0);

      if (variants.length === 0) {
        return { min: 0, max: 0 };
      }

      const minVariantPrice = Math.min(...variants);
      const maxVariantPrice = Math.max(...variants);
      const maxCoatingPrice = coatings.length > 0 ? Math.max(...coatings) : 0;

      return {
        min: minVariantPrice,
        max: maxVariantPrice + maxCoatingPrice,
      };
    } catch (error) {
      console.error(`Error calculating price range for lens ${lensId}:`, error);
      return { min: 0, max: 0 };
    }
  }
}
