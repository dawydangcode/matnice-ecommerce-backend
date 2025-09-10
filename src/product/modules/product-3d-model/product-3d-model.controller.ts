import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { Product3dModelService } from './product-3d-model.service';
import {
  CreateProduct3dModelDto,
  UpdateProduct3dModelDto,
  Product3dModelQueryDto,
} from './dtos/product-3d-model.dto';
import { JwtAuthGuard } from '../../../middlewares/guards/jwt-auth.guard';
import { AwsS3Service } from '../../../common/services/aws-s3.service';
import { Request } from 'express';

@ApiTags('Product 3D Models')
@Controller('product-3d-model')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class Product3dModelController {
  constructor(
    private readonly product3dModelService: Product3dModelService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload 3D model files to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Files uploaded successfully',
  })
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { productId: string; folderName?: string },
  ) {
    const productId = parseInt(body.productId);
    const folderName = body.folderName || `product-${productId}-3d-models`;

    const uploadResults: any[] = [];

    for (const file of files) {
      const allowedTypes = [
        'model/gltf-binary', // .glb
        'model/gltf+json', // .gltf
        'application/octet-stream', // .obj, .mtl (generic)
        'text/plain', // .mtl files
        'image/jpeg', // textures
        'image/png', // textures
        'image/webp', // textures
      ];

      // Validate file type based on extension
      const fileExt = file.originalname.toLowerCase().split('.').pop();
      const validExts = [
        'glb',
        'gltf',
        'obj',
        'mtl',
        'jpg',
        'jpeg',
        'png',
        'webp',
      ];

      if (!validExts.includes(fileExt || '')) {
        throw new Error(`Unsupported file type: ${fileExt}`);
      }

      const fileName = `${Date.now()}-${file.originalname}`;
      const mimeType = file.mimetype || 'application/octet-stream';

      try {
        const fileUrl = await this.awsS3Service.uploadFile(
          file.buffer,
          fileName,
          mimeType,
          folderName,
          false, // Don't overwrite
        );

        uploadResults.push({
          originalName: file.originalname,
          fileName,
          url: fileUrl,
          size: file.size,
          mimeType,
          fileType: fileExt,
        });
      } catch (error: any) {
        console.error(`Failed to upload ${file.originalname}:`, error);
        throw new Error(
          `Failed to upload ${file.originalname}: ${error.message}`,
        );
      }
    }

    return {
      message: 'Files uploaded successfully',
      files: uploadResults,
      folderName,
      productId,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new 3D model for a product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '3D model created successfully',
  })
  async create(
    @Body() createDto: CreateProduct3dModelDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.id;
    const result = await this.product3dModelService.createProduct3dModel(
      createDto.productId,
      createDto.modelName,
      createDto.modelFilePath,
      createDto.modelType as any,
      createDto.mtlFilePath || '',
      createDto.textureBasePath || '',
      createDto.configJson || '',
      createDto.isActive ?? true,
      userId,
    );
    return result.toModel();
  }

  @Get()
  @ApiOperation({ summary: 'Get all 3D models' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all 3D models',
  })
  async findAll() {
    return await this.product3dModelService.getProduct3dModels();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get 3D model for a specific product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '3D model for the product',
  })
  async findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    return await this.product3dModelService.getProduct3dModelByProductId(
      productId,
    );
  }

  @Get('product/:productId/active')
  @ApiOperation({ summary: 'Get active 3D models for a specific product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active 3D models for the product',
  })
  async findActiveByProductId(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return await this.product3dModelService.getActiveByProductId(productId);
  }

  @Get('type/:modelType')
  @ApiOperation({ summary: 'Get all 3D models by type' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of 3D models by type',
  })
  async findByModelType(@Param('modelType') modelType: string) {
    return await this.product3dModelService.findByModelType(modelType as any);
  }

  @Get('stats/storage')
  @ApiOperation({ summary: 'Get storage statistics for 3D models' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Storage statistics' })
  async getStorageStats() {
    return await this.product3dModelService.getStorageStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific 3D model by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '3D model details',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.product3dModelService.getProduct3dModel(id);
    return result.toModel();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a 3D model' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '3D model updated successfully',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProduct3dModelDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.id;
    const model = await this.product3dModelService.getProduct3dModel(id);
    const modelData = model.toModel();

    return await this.product3dModelService.updateProduct3dModel(
      modelData,
      updateDto.modelName || modelData.modelName,
      updateDto.modelFilePath || modelData.modelFilePath,
      (updateDto.modelType as any) || modelData.modelType,
      updateDto.mtlFilePath || modelData.mtlFilePath || '',
      updateDto.textureBasePath || modelData.textureBasePath || '',
      updateDto.configJson || modelData.configJson || '',
      updateDto.isActive ?? modelData.isActive,
      userId,
    );
  }

  @Patch(':id/set-active')
  @ApiOperation({ summary: 'Set a 3D model as active/inactive' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '3D model activity status updated',
  })
  async setActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isActive: boolean },
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.id;
    const model = await this.product3dModelService.getProduct3dModel(id);
    const modelData = model.toModel();

    return await this.product3dModelService.setActive(
      modelData,
      body.isActive,
      userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a 3D model' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '3D model deleted successfully',
  })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any)?.id;
    const model = await this.product3dModelService.getProduct3dModel(id);
    const modelData = model.toModel();

    return await this.product3dModelService.deleteProduct3dModel(
      modelData,
      userId,
    );
  }
}
