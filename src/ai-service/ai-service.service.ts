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
  GetAnalysisHistoryRequestDto,
  FaceAnalysisResultDto,
} from './dtos/ai-analysis.dto';
import { AnalysisStatusType } from './enum/analysis-status.type';
import { GenderDetectedType } from './enum/detected-gender.type';
import { SkinColorDetectedType } from './enum/detect-skin-color.type';
import { FaceShapeType } from './enum/detect-face-shape.type';

@Injectable()
export class AIServiceService {
  private readonly logger = new Logger(AIServiceService.name);
  private readonly pythonPath = this.getPythonPath();
  // Point to the ai-models folder in the project root, not in dist
  private readonly aiModelsPath = path.resolve(process.cwd(), 'ai-models');

  private getPythonPath(): string {
    // 1. Check environment variable
    if (process.env.PYTHON_PATH) {
      return process.env.PYTHON_PATH;
    }

    // 2. Check common venv locations
    const projectRoot = process.cwd();
    const possiblePaths = [
      '/opt/venv/bin/python', // Docker container
      path.join(projectRoot, '.venv', 'bin', 'python'), // Local venv
      path.join(projectRoot, 'venv', 'bin', 'python'), // Alternative local venv
      'python3', // System Python (fallback)
    ];

    for (const pythonPath of possiblePaths) {
      if (fs.existsSync(pythonPath)) {
        this.logger.log(`Using Python: ${pythonPath}`);
        return pythonPath;
      }
    }

    // 3. Fallback to system python3
    this.logger.warn('No venv found, using system python3');
    return 'python3';
  }

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
      this.logger.error(`Failed to start face analysis:`, error);
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

    const model = analysis.toModel();
    const result = model.toPublicResult();

    // Add signed URL for accessing the image
    if (analysis.imageS3Key) {
      try {
        result.s3Url = await this.s3Service.getSignedUrl(analysis.imageS3Key);
      } catch (error) {
        this.logger.warn('Failed to generate signed URL:', error);
      }
    }

    return result;
  }

  /**
   * Get analysis history for user
   */
  async getAnalysisHistory(requestDto: GetAnalysisHistoryRequestDto) {
    const { userId, page = 1, limit = 10 } = requestDto;

    const queryBuilder = this.faceAnalysisRepository
      .createQueryBuilder('analysis')
      .where('analysis.deletedAt IS NULL')
      .andWhere('analysis.AnalysisStatusType = :status', {
        status: 'completed',
      });

    if (userId) {
      queryBuilder.andWhere('analysis.userId = :userId', { userId });
    }

    const [analyses, total] = await queryBuilder
      .orderBy('analysis.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data = analyses.map((analysis) => {
      const model = analysis.toModel();
      const publicResult = model.toPublicResult();
      return {
        id: model.id,
        sessionId: model.sessionId,
        analysis: publicResult.analysis,
        createdAt: model.createdAt || new Date(),
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
      await this.updateAnalysisStatus(
        analysisId,
        AnalysisStatusType.PROCESSING,
      );

      // Run AI analysis
      const [genderResult, skinToneResult, faceShapeResult] = await Promise.all(
        [
          this.analyzeGender(imageUrl),
          this.analyzeSkinTone(imageUrl),
          this.analyzeFaceShape(imageUrl),
        ],
      );

      const processingTime = Date.now() - startTime;

      // Debug logging
      this.logger.debug(`Gender result: ${JSON.stringify(genderResult)}`);
      this.logger.debug(`Skin tone result: ${JSON.stringify(skinToneResult)}`);
      this.logger.debug(
        `Face shape result: ${JSON.stringify(faceShapeResult)}`,
      );

      // Update with results
      await this.updateAnalysisResults(analysisId, {
        genderResult,
        skinToneResult,
        faceShapeResult,
        processingTime,
        status: AnalysisStatusType.COMPLETED,
      });

      this.logger.log(
        `Face analysis completed for ID ${analysisId} in ${processingTime}ms`,
      );
    } catch (error) {
      this.logger.error(`Face analysis failed for ID ${analysisId}:`, error);
      await this.updateAnalysisResults(analysisId, {
        status: AnalysisStatusType.FAILED,
        // errorMessage: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
      });
    }
  }

  /**
   * Analyze gender using AI model
   */
  private async analyzeGender(imageUrl: string): Promise<{
    gender: GenderDetectedType;
    confidence: number;
  }> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(
        this.aiModelsPath,
        'gender-ai-package/gender_classifier.py',
      );

      // Debug log để kiểm tra đường dẫn
      this.logger.debug(`Gender AI script path: ${scriptPath}`);
      this.logger.debug(`File exists: ${fs.existsSync(scriptPath)}`);

      const modelPath = path.join(
        this.aiModelsPath,
        'gender-ai-package/gender_best.pt',
      );
      const command = `${this.pythonPath} "${scriptPath}" --source "${imageUrl}" --model "${modelPath}" --json 2>/dev/null`;

      // Debug log
      this.logger.debug(`Executing command: ${command}`);

      const process = spawn('bash', ['-c', command]);

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
            // Parse only the last line as JSON (ignore log messages)
            const lines = output.trim().split('\n');
            const jsonLine = lines[lines.length - 1];
            const result = JSON.parse(jsonLine);
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
    skinTone: SkinColorDetectedType;
    confidence: number;
  }> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(
        this.aiModelsPath,
        'skincolor-ai-model/face_skin_analyzer.py',
      );
      const modelPath = path.join(
        this.aiModelsPath,
        'skincolor-ai-model/runs/train20/weights/best.pt',
      );
      const command = `${this.pythonPath} "${scriptPath}" --source "${imageUrl}" --model "${modelPath}" --json 2>/dev/null`;
      const process = spawn('bash', ['-c', command]);

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
            // Parse only the last line as JSON (ignore log messages)
            const lines = output.trim().split('\n');
            const jsonLine = lines[lines.length - 1];
            const result = JSON.parse(jsonLine);
            if (result.error) {
              reject(new Error(`Skin tone analysis error: ${result.error}`));
              return;
            }
            resolve({
              skinTone: result.skin_type || 'unknown',
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
   * Analyze face shape using AI model
   */
  private async analyzeFaceShape(imageUrl: string): Promise<{
    faceShape: FaceShapeType;
    confidence: number;
  }> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(
        this.aiModelsPath,
        'faceshape-ai-package',
        'faceshape_classifier.py',
      );

      // Use same approach as gender analysis - pass model path and use --image parameter
      const modelPath = path.join(
        this.aiModelsPath,
        'faceshape-ai-package/faceshape_best.pt',
      );
      const command = `${this.pythonPath} "${scriptPath}" --image "${imageUrl}" --model "${modelPath}" --confidence 0.5 --json 2>/dev/null`;
      const process = spawn('bash', ['-c', command]);

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
            // Parse only the last line as JSON (ignore log messages)
            const lines = output.trim().split('\n');
            const jsonLine = lines[lines.length - 1];
            const result = JSON.parse(jsonLine);
            if (result.error) {
              reject(new Error(`Face shape analysis error: ${result.error}`));
              return;
            }

            // Map the predicted class to FaceShapeType enum
            let faceShape: FaceShapeType;
            const predictedClass = result.predicted_class?.toLowerCase();
            switch (predictedClass) {
              case 'heart':
                faceShape = FaceShapeType.HEART;
                break;
              case 'oblong':
                faceShape = FaceShapeType.OBLONG;
                break;
              case 'oval':
                faceShape = FaceShapeType.OVAL;
                break;
              case 'round':
                faceShape = FaceShapeType.ROUND;
                break;
              case 'square':
                faceShape = FaceShapeType.SQUARE;
                break;
              default:
                faceShape = FaceShapeType.OVAL; // Default fallback
            }

            resolve({
              faceShape,
              confidence: result.confidence || 0,
            });
          } catch (e) {
            reject(
              new Error(
                `Failed to parse face shape analysis result: ${output}`,
              ),
            );
          }
        } else {
          reject(new Error(`Face shape analysis process failed: ${error}`));
        }
      });

      // Set timeout for analysis
      setTimeout(() => {
        process.kill();
        reject(new Error('Face shape analysis timeout'));
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
      await this.s3Service.uploadFile(imageBuffer, s3Key, 'image/jpeg');
      // Return simple S3 URL instead of signed URL to avoid DB column length issues
      const bucketName = process.env.AWS_S3_BUCKET_NAME || 'testbucket21045081';
      const region = process.env.AWS_REGION || 'ap-southeast-2';
      return `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
    } catch (error) {
      this.logger.error('Failed to upload image to S3:', error);
      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  /**
   * Create initial analysis record
   */
  private async createAnalysisRecord(
    sessionId: number,
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
      AnalysisStatusType: AnalysisStatusType.PENDING,
      analysisMetadata: imageInfo,
    });

    return await this.faceAnalysisRepository.save(analysis);
  }

  /**
   * Update analysis status
   */
  private async updateAnalysisStatus(
    analysisId: number,
    status: AnalysisStatusType,
  ): Promise<void> {
    await this.faceAnalysisRepository.update(analysisId, {
      AnalysisStatusType: status,
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
      faceShapeResult?: { faceShape: string; confidence: number };
      processingTime?: number;
      status?: string;
      // errorMessage?: string;
    },
  ): Promise<void> {
    const updateData: any = {};

    if (data.genderResult) {
      updateData.detectedGender = data.genderResult.gender;
      updateData.genderConfidence = data.genderResult.confidence;
    }

    if (data.skinToneResult) {
      updateData.detectedSkinColor = data.skinToneResult.skinTone;
      updateData.SkinColorConfidence = data.skinToneResult.confidence;
    }

    if (data.faceShapeResult) {
      updateData.detectedFaceShape = data.faceShapeResult.faceShape;
      updateData.faceShapeConfidence = data.faceShapeResult.confidence;
    }

    if (data.processingTime) {
      updateData.processingTimeMs = data.processingTime;
    }

    if (data.status) {
      updateData.AnalysisStatusType = data.status;
    }

    // if (data.errorMessage) {
    //   updateData.errorMessage = data.errorMessage;
    // }

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
