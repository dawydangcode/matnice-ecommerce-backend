import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThan } from 'typeorm';
import { FaceAnalysisEntity } from './entities/face-analysis.entity';
import { FaceAnalysisModel } from './models/face-analysis.model';
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { AwsS3Service } from '../common/services/aws-s3.service';
import { SessionService } from '../common/services/session.service';
import {
  AnalyzeFaceRequestDto,
  GetAnalysisRequestDto,
  GetAnalysisHistoryRequestDto,
  FaceAnalysisResultDto,
} from './dtos/ai-analysis.dto';

@Injectable()
export class AIServiceService {
  private readonly logger = new Logger(AIServiceService.name);
  private readonly pythonPath = process.env.PYTHON_PATH || 'python3';
  private readonly aiModelsPath = path.join(__dirname, '../../ai-models');

  constructor(
    @InjectRepository(FaceAnalysisEntity)
    private readonly faceAnalysisRepository: Repository<FaceAnalysisEntity>,
    private readonly s3Service: AwsS3Service,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * Start face analysis process
   */
  async analyzeFace(
    imageBuffer: Buffer,
    requestDto: AnalyzeFaceRequestDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ sessionId: number; analysis?: FaceAnalysisResultDto }> {
    const startTime = Date.now();

    try {
      // 1. Create or get session
      let session;
      if (requestDto.sessionId) {
        session = await this.sessionService.getActiveSession(
          requestDto.sessionId,
        );
        if (!session) {
          throw new BadRequestException('Invalid session ID');
        }
      } else if (requestDto.userId) {
        // Create session for registered user
        session = await this.sessionService.createUserSession(
          requestDto.userId,
          'ai_analysis',
          userAgent,
          ipAddress,
        );
      } else {
        // Create anonymous session
        session = await this.sessionService.createAnonymousSession(
          userAgent,
          ipAddress,
        );
      }

      // 2. Validate image
      const imageInfo = await this.validateImage(imageBuffer);

      // 3. Upload image to S3
      const s3Key = `ai-analysis/${session.id}/${Date.now()}-analysis.jpg`;
      const imageUrl = await this.uploadImageToS3(imageBuffer, s3Key);

      // 4. Create database record
      const faceAnalysis = await this.createAnalysisRecord(
        session.id,
        session.userId,
        imageUrl,
        s3Key,
        imageInfo,
      );

      // 4. Start AI processing (async)
      this.processImageAsync(faceAnalysis.id, imageUrl, startTime);

      // 5. Return session info
      return {
        sessionId: session.id,
        // Return analysis immediately if processing is fast (for demo purposes)
      };
    } catch (error) {
      this.logger.error(
        `Failed to start face analysis for session ${session.id}:`,
        error,
      );
      throw new InternalServerErrorException('Failed to start face analysis');
    }
  }

  /**
   * Get analysis results by session ID
   */
  async getAnalysisResult(sessionId: number): Promise<FaceAnalysisResultDto> {
    const analysis = await this.faceAnalysisRepository.findOne({
      where: { sessionId, deletedAt: IsNull() },
    });

    if (!analysis) {
      throw new BadRequestException('Analysis session not found');
    }

    const model = new FaceAnalysisModel(analysis);
    return model.toPublicResult();
  }

  /**
   * Get analysis history for user
   */
  async getAnalysisHistory(requestDto: GetAnalysisHistoryRequestDto) {
    const { userId, page = 1, limit = 10 } = requestDto;

    const queryBuilder = this.faceAnalysisRepository
      .createQueryBuilder('analysis')
      .where('analysis.deletedAt IS NULL')
      .andWhere('analysis.analysisStatus = :status', { status: 'completed' });

    if (userId) {
      queryBuilder.andWhere('analysis.userId = :userId', { userId });
    }

    const [analyses, total] = await queryBuilder
      .orderBy('analysis.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data = analyses.map((analysis) => {
      const model = new FaceAnalysisModel(analysis);
      return {
        id: model.id,
        sessionId: model.sessionId,
        analysis: model.toPublicResult().analysis,
        createdAt: model.createdAt,
      };
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Process image with AI models (async)
   */
  private async processImageAsync(
    analysisId: number,
    imageUrl: string,
    startTime: number,
  ): Promise<void> {
    try {
      // Update status to processing
      await this.updateAnalysisStatus(analysisId, 'processing');

      // Run AI analysis
      const [genderResult, skinToneResult] = await Promise.all([
        this.analyzeGender(imageUrl),
        this.analyzeSkinTone(imageUrl),
      ]);

      const processingTime = Date.now() - startTime;

      // Update with results
      await this.updateAnalysisResults(analysisId, {
        genderResult,
        skinToneResult,
        processingTime,
        status: 'completed',
      });

      this.logger.log(
        `Face analysis completed for ID ${analysisId} in ${processingTime}ms`,
      );
    } catch (error) {
      this.logger.error(`Face analysis failed for ID ${analysisId}:`, error);
      await this.updateAnalysisResults(analysisId, {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
      });
    }
  }

  /**
   * Analyze gender using AI model
   */
  private async analyzeGender(imageUrl: string): Promise<{
    gender: 'male' | 'female' | 'unknown';
    confidence: number;
  }> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(
        this.aiModelsPath,
        'gender-ai-package/gender_classifier.py',
      );
      const process = spawn(this.pythonPath, [scriptPath, imageUrl]);

      let output = '';
      let error = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output.trim());
            if (result.error) {
              reject(new Error(`Gender analysis error: ${result.error}`));
              return;
            }
            resolve({
              gender: result.gender || 'unknown',
              confidence: result.confidence || 0,
            });
          } catch (e) {
            reject(
              new Error(`Failed to parse gender analysis result: ${output}`),
            );
          }
        } else {
          reject(new Error(`Gender analysis process failed: ${error}`));
        }
      });

      // Set timeout for analysis
      setTimeout(() => {
        process.kill();
        reject(new Error('Gender analysis timeout'));
      }, 30000); // 30 seconds timeout
    });
  }

  /**
   * Analyze skin tone using AI model
   */
  private async analyzeSkinTone(imageUrl: string): Promise<{
    skinTone: 'light' | 'medium' | 'dark' | 'unknown';
    confidence: number;
  }> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(
        this.aiModelsPath,
        'skincolor-ai-model/face_skin_analyzer.py',
      );
      const process = spawn(this.pythonPath, [scriptPath, imageUrl]);

      let output = '';
      let error = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output.trim());
            if (result.error) {
              reject(new Error(`Skin tone analysis error: ${result.error}`));
              return;
            }
            resolve({
              skinTone: result.skin_tone || 'unknown',
              confidence: result.confidence || 0,
            });
          } catch (e) {
            reject(
              new Error(`Failed to parse skin tone analysis result: ${output}`),
            );
          }
        } else {
          reject(new Error(`Skin tone analysis process failed: ${error}`));
        }
      });

      // Set timeout for analysis
      setTimeout(() => {
        process.kill();
        reject(new Error('Skin tone analysis timeout'));
      }, 30000); // 30 seconds timeout
    });
  }

  /**
   * Validate uploaded image
   */
  private async validateImage(imageBuffer: Buffer): Promise<{
    width?: number;
    height?: number;
    format?: string;
  }> {
    // Basic validation
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new BadRequestException('No image data provided');
    }

    if (imageBuffer.length > 10 * 1024 * 1024) {
      // 10MB limit
      throw new BadRequestException('Image file too large (max 10MB)');
    }

    // Check image signature (basic format validation)
    const signature = imageBuffer.slice(0, 4).toString('hex');
    const isJPEG = signature.startsWith('ffd8');
    const isPNG = signature === '89504e47';

    if (!isJPEG && !isPNG) {
      throw new BadRequestException('Only JPEG and PNG images are supported');
    }

    return {
      format: isJPEG ? 'jpeg' : 'png',
    };
  }

  /**
   * Upload image to S3
   */
  private async uploadImageToS3(
    imageBuffer: Buffer,
    s3Key: string,
  ): Promise<string> {
    try {
      await this.s3Service.uploadFile(s3Key, imageBuffer as any, 'image/jpeg');
      return await this.s3Service.getSignedUrl(s3Key);
    } catch (error) {
      this.logger.error('Failed to upload image to S3:', error);
      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  /**
   * Create initial analysis record
   */
  private async createAnalysisRecord(
    sessionId: string,
    userId?: number,
    imageUrl?: string,
    s3Key?: string,
    imageInfo?: any,
  ): Promise<FaceAnalysisEntity> {
    const analysis = this.faceAnalysisRepository.create({
      sessionId,
      userId,
      imageUrl,
      imageS3Key: s3Key,
      analysisStatus: 'pending',
      analysisMetadata: imageInfo,
    });

    return await this.faceAnalysisRepository.save(analysis);
  }

  /**
   * Update analysis status
   */
  private async updateAnalysisStatus(
    analysisId: number,
    status: 'pending' | 'processing' | 'completed' | 'failed',
  ): Promise<void> {
    await this.faceAnalysisRepository.update(analysisId, {
      analysisStatus: status,
    });
  }

  /**
   * Update analysis results
   */
  private async updateAnalysisResults(
    analysisId: number,
    data: {
      genderResult?: { gender: string; confidence: number };
      skinToneResult?: { skinTone: string; confidence: number };
      processingTime?: number;
      status?: string;
      errorMessage?: string;
    },
  ): Promise<void> {
    const updateData: any = {};

    if (data.genderResult) {
      updateData.detectedGender = data.genderResult.gender;
      updateData.genderConfidence = data.genderResult.confidence;
    }

    if (data.skinToneResult) {
      updateData.detectedSkinTone = data.skinToneResult.skinTone;
      updateData.skinToneConfidence = data.skinToneResult.confidence;
    }

    if (data.processingTime) {
      updateData.processingTimeMs = data.processingTime;
    }

    if (data.status) {
      updateData.analysisStatus = data.status;
    }

    if (data.errorMessage) {
      updateData.errorMessage = data.errorMessage;
    }

    await this.faceAnalysisRepository.update(analysisId, updateData);
  }

  /**
   * Clean up old analysis records (can be called by scheduler)
   */
  async cleanupOldAnalyses(daysOld: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const oldAnalyses = await this.faceAnalysisRepository.find({
      where: {
        createdAt: LessThan(cutoffDate),
        deletedAt: IsNull(),
      },
    });

    for (const analysis of oldAnalyses) {
      // Delete from S3
      if (analysis.imageS3Key) {
        try {
          await this.s3Service.deleteFile(analysis.imageS3Key);
        } catch (error) {
          this.logger.warn(
            `Failed to delete S3 file ${analysis.imageS3Key}:`,
            error,
          );
        }
      }

      // Soft delete from database
      analysis.deletedAt = new Date();
      await this.faceAnalysisRepository.save(analysis);
    }

    this.logger.log(`Cleaned up ${oldAnalyses.length} old analysis records`);
  }
}
