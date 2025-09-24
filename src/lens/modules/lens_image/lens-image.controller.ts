import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  Response,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { JwtAuthGuard } from 'src/middlewares/guards/jwt-auth.guard';
import { LensImageService } from './lens-image.service';
import {
  CreateLensImageDto,
  UpdateLensImageDto,
  LensImageListDto,
  LensImageResponseDto,
} from './dtos/lens-image.dto';

@ApiTags('Lens Images')
@Controller('api/v1/lens-images')
@UseGuards(JwtAuthGuard)
export class LensImageController {
  constructor(private readonly lensImageService: LensImageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lens image' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Lens image created successfully',
    type: LensImageResponseDto,
  })
  async createLensImage(
    @Body() createLensImageDto: CreateLensImageDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id;
      const result = await this.lensImageService.createLensImage(
        createLensImageDto,
        userId,
      );

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Lens image created successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a lens image' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lens image updated successfully',
    type: LensImageResponseDto,
  })
  async updateLensImage(
    @Param('id') id: number,
    @Body() updateLensImageDto: UpdateLensImageDto,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id;
      const result = await this.lensImageService.updateLensImage(
        id,
        updateLensImageDto,
        userId,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Lens image updated successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lens image' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lens image deleted successfully',
  })
  async deleteLensImage(
    @Param('id') id: number,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user?.id;
      await this.lensImageService.deleteLensImage(id, userId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Lens image deleted successfully',
      });
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lens image by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lens image retrieved successfully',
    type: LensImageResponseDto,
  })
  async getLensImageById(
    @Param('id') id: number,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.lensImageService.getLensImageById(id);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Lens image retrieved successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get list of lens images' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lens images retrieved successfully',
    type: [LensImageResponseDto],
  })
  async getLensImages(
    @Query() params: LensImageListDto,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.lensImageService.getLensImages(params);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Lens images retrieved successfully',
        data: result.data,
        total: result.total,
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: result.total,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('lens/:lensId')
  @ApiOperation({ summary: 'Get all images for a specific lens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lens images retrieved successfully',
    type: [LensImageResponseDto],
  })
  async getImagesForLens(
    @Param('lensId') lensId: number,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.lensImageService.getImagesForLens(lensId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Lens images retrieved successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('lens/:lensId/primary')
  @ApiOperation({ summary: 'Get primary image for a lens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Primary lens image retrieved successfully',
    type: LensImageResponseDto,
  })
  async getPrimaryImageForLens(
    @Param('lensId') lensId: number,
    @Response() res: ExpressResponse,
  ) {
    try {
      const result = await this.lensImageService.getPrimaryImageForLens(lensId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: result
          ? 'Primary lens image retrieved successfully'
          : 'No primary image found for this lens',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a lens image file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Lens image file upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
        lensId: {
          type: 'number',
          description: 'ID of the lens',
        },
        imageOrder: {
          type: 'string',
          description: 'Image order (a, b, c, d, e)',
          enum: ['a', 'b', 'c', 'd', 'e'],
        },
      },
      required: ['file', 'lensId'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadLensImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('lensId') lensId: number,
    @Body('imageOrder') imageOrder: string | undefined,
    @Request() req: any,
    @Response() res: ExpressResponse,
  ) {
    try {
      if (!file) {
        return res!.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No file provided',
        });
      }

      const userId = req.user?.id;
      const result = await this.lensImageService.uploadLensImage(
        file,
        Number(lensId),
        imageOrder,
        userId,
      );

      return res!.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Lens image uploaded successfully',
        data: {
          imageUrl: result.imageUrl,
          lensImage: result.lensImage,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
