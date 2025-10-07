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
  Res,
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
import {
  JwtAuthGuard,
  Public,
} from '../../../middlewares/guards/jwt-auth.guard';
import { Roles } from '../../../role/decorators/roles.decorator';
import { RoleType } from '../../../role/enum/role.enum';
import { AwsS3Service } from '../../../common/services/aws-s3.service';
import { Request, Response } from 'express';

@ApiTags('Product 3D Models')
@Controller('api/v1/product-3d-model')
export class Product3dModelController {
  constructor(
    private readonly product3dModelService: Product3dModelService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  @Post('upload')
  @Roles(RoleType.Admin)
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
  @UseGuards(JwtAuthGuard)
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

  @Get(':productId/active')
  @ApiOperation({ summary: 'Get active 3D model for product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active 3D model retrieved successfully',
  })
  async getActiveByProductId(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const models =
      await this.product3dModelService.getActiveByProductId(productId);
    return models && models.length > 0 ? models[0] : null;
  }

  @Get('serve/:productId')
  @Public()
  @ApiOperation({
    summary: 'Serve 3D model file for product (proxy to avoid CORS)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '3D model file served successfully',
  })
  async serveModel(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const models =
        await this.product3dModelService.getActiveByProductId(productId);

      if (!models || models.length === 0) {
        return res.status(404).json({ message: '3D model not found' });
      }

      const model = models[0]; // Get first active model

      if (!model.modelFilePath) {
        return res.status(404).json({ message: 'Model file path not found' });
      }

      // Get file from S3 using URL
      const fileBuffer = await this.awsS3Service.getFileByUrl(
        model.modelFilePath,
      );

      // Set appropriate headers
      const fileExt = model.modelFilePath.toLowerCase().split('.').pop();
      let mimeType = 'application/octet-stream';

      if (fileExt === 'glb') {
        mimeType = 'model/gltf-binary';
      } else if (fileExt === 'gltf') {
        mimeType = 'model/gltf+json';
      } else if (fileExt === 'obj') {
        mimeType = 'application/octet-stream';
      }

      res.set({
        'Content-Type': mimeType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });

      return res.send(fileBuffer);
    } catch (error: any) {
      console.error('Error serving 3D model:', error);
      return res.status(500).json({
        message: 'Error serving 3D model',
        error: error.message,
      });
    }
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
