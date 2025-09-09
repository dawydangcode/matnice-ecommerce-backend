import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductImageService } from './product-image.service';
import {
  CreateProductImageBodyDto,
  DeleteProductImageParamsDto,
  GetProductImageParamsDto,
  GetProductImagesByProductIdParamsDto,
  GetProductImagesQueryDto,
  UpdateProductImageBodyDto,
  UpdateProductImageParamsDto,
  UploadProductImageParamsDto,
} from './dtos/product-image.dto';
import { RequestModel } from 'src/common/models/request.model';
import { ProductImageModel } from './models/product-image.model';
import { PageList } from 'src/common/models/page-list.model';
import { PaginationParamsModel } from 'src/common/models/pagination-params.model';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';

@Controller('api/v1')
@ApiTags('Product / Product Image')
@Roles(RoleType.Admin, RoleType.Employee)
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Get('product-image/list')
  async getProductImages(
    @Query() query: GetProductImagesQueryDto,
  ): Promise<PageList<ProductImageModel>> {
    return await this.productImageService.getProductImages(
      undefined,
      undefined,
      new PaginationParamsModel(query.page, query.limit),
      undefined,
      undefined,
    );
  }

  @Get('product/:productId/product-image/list')
  async getProductImagesByProductId(
    @Param() params: GetProductImagesByProductIdParamsDto,
    @Query() query: GetProductImagesQueryDto,
  ): Promise<PageList<ProductImageModel>> {
    return await this.productImageService.getProductImagesByProductId(
      params.productId,
      new PaginationParamsModel(query.page, query.limit),
    );
  }

  @Get('product-image/:productImageId/detail')
  async getProductImageById(
    @Param() params: GetProductImageParamsDto,
  ): Promise<ProductImageModel> {
    return await this.productImageService.getProductImageById(
      params.productImageId,
    );
  }

  @Post('product-image/create')
  @ApiOperation({ summary: 'Create new product image' })
  @ApiCreatedResponse({
    description: 'Product image created successfully',
  })
  async createProductImage(
    @Req() req: RequestModel,
    @Body() body: CreateProductImageBodyDto,
  ): Promise<ProductImageModel> {
    return await this.productImageService.createProductImage(
      body.productId,
      body.imageUrl,
      req.user.userId,
    );
  }

  @Post('product-image/upload-temporary')
  @UseInterceptors(FilesInterceptor('images', 10)) // Support multiple files with field name 'images'
  @ApiOperation({ summary: 'Upload temporary product image files' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'Temporary product images uploaded successfully',
  })
  async uploadTemporaryProductImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: RequestModel,
  ): Promise<{ imageUrls: string[] }> {
    if (!files || files.length === 0) {
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    const imageUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new HttpException(
          `File ${file.originalname}: Only JPEG, PNG, JPG and WebP files are allowed`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new HttpException(
          `File ${file.originalname}: File size cannot exceed 5MB`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const imageUrl = await this.productImageService.uploadTemporaryImage(
        file,
        req.user.userId,
      );
      imageUrls.push(imageUrl);
    }

    return { imageUrls };
  }

  @Post('product-image/upload-temporary-multiple')
  @UseInterceptors(FilesInterceptor('images', 10)) // Allow up to 10 files with field name 'images'
  @ApiOperation({ summary: 'Upload multiple temporary product image files' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'Temporary product images uploaded successfully',
  })
  async uploadTemporaryProductImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: RequestModel,
  ): Promise<{ imageUrls: string[] }> {
    if (!files || files.length === 0) {
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    const imageUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new HttpException(
          `File ${file.originalname}: Only JPEG, PNG, JPG and WebP files are allowed`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new HttpException(
          `File ${file.originalname}: File size cannot exceed 5MB`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const imageUrl = await this.productImageService.uploadTemporaryImage(
        file,
        req.user.userId,
      );
      imageUrls.push(imageUrl);
    }

    return { imageUrls };
  }

  @Post('product/:productId/image/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload product image file' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'Product image uploaded successfully',
  })
  async uploadProductImage(
    @Param() params: UploadProductImageParamsDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestModel,
  ): Promise<ProductImageModel> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new HttpException(
        'Only JPEG, PNG, JPG and WebP files are allowed',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new HttpException(
        'File size cannot exceed 5MB',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.productImageService.uploadProductImage(
      params.productId,
      file,
      req.user.userId,
    );
  }

  @Put('product-image/:productImageId/update')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update product image' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Product image updated successfully',
  })
  async updateProductImage(
    @Param() params: UpdateProductImageParamsDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestModel,
  ): Promise<ProductImageModel> {
    const productImage = await this.productImageService.getProductImageById(
      params.productImageId,
    );

    return await this.productImageService.updateProductImage(
      productImage,
      file,
      req.user.userId,
    );
  }

  @Delete('product-image/:productImageId/delete')
  async deleteProductImage(
    @Param() params: DeleteProductImageParamsDto,
    @Req() req: RequestModel,
  ): Promise<boolean> {
    const productImage = await this.productImageService.getProductImageById(
      params.productImageId,
    );

    return await this.productImageService.deleteProductImage(
      productImage,
      req.user.userId,
    );
  }

  @Delete('product/:productId/product-image/delete-all')
  async deleteProductImagesByProductId(
    @Param() params: GetProductImagesByProductIdParamsDto,
    @Req() req: RequestModel,
  ): Promise<boolean> {
    return await this.productImageService.deleteProductImagesByProductId(
      params.productId,
      req.user.userId,
    );
  }

  // ========== PRODUCT COLOR IMAGE ENDPOINTS ==========

  @Post('product/:productId/color/:colorId/image/upload')
  @ApiOperation({ summary: 'Upload single product color image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductColorImage(
    @Param('productId') productId: number,
    @Param('colorId') colorId: number,
    @Body('productNumber') productNumber: string,
    @Body('imageOrder') imageOrder: 'a' | 'b' | 'c' | 'd' | 'e',
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestModel,
  ): Promise<ProductImageModel> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    if (!productNumber) {
      throw new HttpException(
        'Product number is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!imageOrder) {
      throw new HttpException(
        'Image order is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.productImageService.uploadProductColorImage(
      productId,
      colorId,
      productNumber,
      file,
      imageOrder,
      req.user.userId,
    );
  }

  @Get('product/:productId/color/:colorId/images')
  @ApiOperation({ summary: 'Get all images for a product color' })
  async getProductColorImages(
    @Param('productId') productId: number,
    @Param('colorId') colorId: number,
  ): Promise<ProductImageModel[]> {
    return await this.productImageService.getProductImagesByColorId(
      productId,
      colorId,
    );
  }

  @Get('product/:productId/thumbnails')
  @ApiOperation({ summary: 'Get thumbnail images for product' })
  async getProductThumbnailImages(
    @Param('productId') productId: number,
  ): Promise<ProductImageModel[]> {
    return await this.productImageService.getProductThumbnailImages(productId);
  }

  @Get('product/:productId/images/grouped-by-color')
  @ApiOperation({ summary: 'Get all product images grouped by color' })
  async getProductImagesGroupedByColor(
    @Param('productId') productId: number,
  ): Promise<Record<string, ProductImageModel[]>> {
    const groupedImages =
      await this.productImageService.getProductImagesGroupedByColor(productId);

    // Convert Map to Record for JSON serialization
    const result: Record<string, ProductImageModel[]> = {};
    groupedImages.forEach((images, colorId) => {
      result[colorId.toString()] = images;
    });

    return result;
  }

  @Delete('product/:productId/color/:colorId/image/:imageOrder')
  @ApiOperation({ summary: 'Delete product color image by order' })
  async deleteProductColorImage(
    @Param('productId') productId: number,
    @Param('colorId') colorId: number,
    @Param('imageOrder') imageOrder: 'a' | 'b' | 'c' | 'd' | 'e',
    @Req() req: RequestModel,
  ): Promise<boolean> {
    return await this.productImageService.deleteProductColorImage(
      productId,
      colorId,
      imageOrder,
      req.user.userId,
    );
  }

  @Delete('product/:productId/color/:colorId/images')
  @ApiOperation({ summary: 'Delete all images for a product color' })
  async deleteProductColorImages(
    @Param('productId') productId: number,
    @Param('colorId') colorId: number,
    @Req() req: RequestModel,
  ): Promise<boolean> {
    return await this.productImageService.deleteProductColorImages(
      productId,
      colorId,
      req.user.userId,
    );
  }
}
