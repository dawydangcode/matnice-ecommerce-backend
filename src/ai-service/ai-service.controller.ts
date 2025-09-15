import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  Query,
  Param,
  BadRequestException,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiSecurity,
} from '@nestjs/swagger';
import { AIServiceService } from './ai-service.service';
import { JwtAuthGuard } from '../middlewares/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import {
  AnalyzeFaceRequestDto,
  AnalyzeFaceResponseDto,
  GetAnalysisRequestDto,
  GetAnalysisResponseDto,
  GetAnalysisHistoryRequestDto,
  GetAnalysisHistoryResponseDto,
  ErrorResponseDto,
} from './dtos/ai-analysis.dto';

@ApiTags('AI Face Analysis')
@Controller('api/v1/ai')
export class AIServiceController {
  constructor(private readonly aiService: AIServiceService) {}

  @Post('analyze-face')
  @Public() // Allow anonymous access for face analysis
  @ApiOperation({ summary: 'Analyze face for gender and skin tone detection' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Face analysis started successfully',
    type: AnalyzeFaceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid image or parameters',
    type: ErrorResponseDto,
  })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
          return cb(
            new BadRequestException('Only JPEG and PNG images are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async analyzeFace(
    @UploadedFile() file: Express.Multer.File,
    @Body() requestDto: AnalyzeFaceRequestDto,
  ): Promise<AnalyzeFaceResponseDto> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    try {
      const result = await this.aiService.analyzeFace(file.buffer, requestDto);

      return {
        success: true,
        sessionId: result.sessionId.toString(),
        message: 'Face analysis started successfully',
        data: result.analysis,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Analysis failed: ${errorMessage}`);
    }
  }

  @Get('analysis/:sessionId/result/')
  @Public() // Allow anonymous access to get results by session
  @ApiOperation({
    summary: 'Get face analysis results by session ID',
    parameters: [
      {
        name: 'sessionId',
        in: 'path',
        description: 'Session ID to get analysis results',
        required: true,
        schema: { type: 'integer', minimum: 1 },
      },
    ],
  })
  @ApiResponse({
    status: 200,
    description: 'Analysis results retrieved successfully',
    type: GetAnalysisResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Session not found',
    type: ErrorResponseDto,
  })
  async getAnalysisResult(
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ): Promise<GetAnalysisResponseDto> {
    try {
      const result = await this.aiService.getAnalysisResult(sessionId);

      return {
        success: true,
        data: result,
        message: 'Analysis results retrieved successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to get analysis: ${errorMessage}`);
    }
  }

  @Get('analysis/history')
  @UseGuards(JwtAuthGuard) // Require authentication for history
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Get user face analysis history' })
  @ApiResponse({
    status: 200,
    description: 'Analysis history retrieved successfully',
    type: GetAnalysisHistoryResponseDto,
  })
  async getAnalysisHistory(
    @Query() query: GetAnalysisHistoryRequestDto,
    @Req() req: any,
  ): Promise<GetAnalysisHistoryResponseDto> {
    try {
      // Use user ID from JWT if not provided in query
      const requestDto = {
        ...query,
        userId: query.userId || req.user?.userId,
      };

      const result = await this.aiService.getAnalysisHistory(requestDto);

      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'Analysis history retrieved successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Failed to get analysis history: ${errorMessage}`,
      );
    }
  }

  @Post('analysis/cleanup')
  @UseGuards(JwtAuthGuard) // Admin only
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Cleanup old analysis records (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Cleanup completed successfully',
  })
  async cleanupOldAnalyses(@Body() body: { daysOld?: number }): Promise<any> {
    try {
      await this.aiService.cleanupOldAnalyses(body.daysOld || 30);

      return {
        success: true,
        message: 'Old analysis records cleaned up successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to cleanup: ${errorMessage}`);
    }
  }
}
