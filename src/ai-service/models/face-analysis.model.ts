import { AnalysisStatusType } from '../enum/analysis-status.type';
import { SkinColorDetectedType } from '../enum/detect-skin-color.type';
import { GenderDetectedType } from '../enum/detected-gender.type';

export class FaceAnalysisModel {
  public readonly id: number;
  public readonly sessionId: string;
  public readonly userId: number | undefined;
  public readonly imageUrl: string;
  public readonly imageS3Key: string;

  // Gender Analysis Results
  public readonly detectedGender: GenderDetectedType;
  public readonly genderConfidence: number;

  // Skin Tone Analysis Results
  public readonly detectedSkinColor: SkinColorDetectedType;
  public readonly SkinColorConfidence: number;

  // Processing Status
  public readonly analysisStatus: AnalysisStatusType;
  public readonly errorMessage: string | undefined;
  public readonly processingTimeMs: number | undefined;

  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    sessionId: string,
    userId: number | undefined,
    imageUrl: string,
    imageS3Key: string,
    detectedGender: GenderDetectedType,
    genderConfidence: number,
    detectedSkinColor: SkinColorDetectedType,
    SkinColorConfidence: number,
    analysisStatus: AnalysisStatusType,
    errorMessage: string | undefined,
    processingTimeMs: number | undefined,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.sessionId = sessionId;
    this.userId = userId;
    this.imageUrl = imageUrl;
    this.imageS3Key = imageS3Key;
    this.detectedGender = detectedGender;
    this.genderConfidence = genderConfidence;
    this.detectedSkinColor = detectedSkinColor;
    this.SkinColorConfidence = SkinColorConfidence;
    this.analysisStatus = analysisStatus;
    this.errorMessage = errorMessage;
    this.processingTimeMs = processingTimeMs;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }

  // Metadata
  public readonly analysisMetadata?: {
    imageWidth?: number;
    imageHeight?: number;
    faceDetected?: boolean;
    faceCount?: number;
    modelVersions?: {
      genderModel?: string;
      SkinColorModel?: string;
    };
  };

  // Static factory method để tạo từ Entity
  static fromEntity(entity: any): FaceAnalysisModel {
    return new FaceAnalysisModel(
      entity.id,
      entity.sessionId?.toString() || '', // Convert number to string for compatibility
      entity.userId,
      entity.imageUrl,
      entity.imageS3Key,
      entity.detectedGender,
      entity.genderConfidence,
      entity.detectedSkinColor,
      entity.SkinColorConfidence,
      entity.AnalysisStatusType,
      entity.errorMessage,
      entity.processingTimeMs,
      entity.createdAt,
      entity.createdBy,
      entity.updatedAt,
      entity.updatedBy,
      entity.deletedAt,
      entity.deletedBy,
    );
  }

  // Helper methods
  isProcessingComplete(): boolean {
    return this.analysisStatus === 'completed';
  }

  isProcessingFailed(): boolean {
    return this.analysisStatus === 'failed';
  }

  isPending(): boolean {
    return this.analysisStatus === 'pending';
  }

  isProcessing(): boolean {
    return this.analysisStatus === 'processing';
  }

  hasValidResults(): boolean {
    return (
      this.isProcessingComplete() &&
      this.detectedGender !== GenderDetectedType.UNKNOWN &&
      this.detectedSkinColor !== SkinColorDetectedType.UNKNOWN
    );
  }

  getOverallConfidence(): number {
    if (!this.hasValidResults()) return 0;
    return (this.genderConfidence + this.SkinColorConfidence) / 2;
  }

  // Format cho API response (public facing) - match với DTO structure
  toPublicResult() {
    return {
      analysisId: this.id,
      sessionId: this.sessionId,
      analysis: {
        gender: {
          detected: this.detectedGender,
          confidence: this.genderConfidence,
        },
        SkinColor: {
          detected: this.detectedSkinColor,
          confidence: this.SkinColorConfidence,
        },
        overall: {
          confidence: this.getOverallConfidence(),
          processingTime: this.processingTimeMs,
        },
      },
      status: this.analysisStatus,
      s3Url: undefined as string | undefined, // Will be set by service
      analyzedAt: this.updatedAt || this.createdAt || new Date(),
    };
  }

  // Format chi tiết cho admin/internal use
  toDetailedResult() {
    return {
      id: this.id,
      sessionId: this.sessionId,
      userId: this.userId,
      imageUrl: this.imageUrl,
      imageS3Key: this.imageS3Key,
      analysis: {
        gender: {
          detected: this.detectedGender,
          confidence: this.genderConfidence,
        },
        SkinColor: {
          detected: this.detectedSkinColor,
          confidence: this.SkinColorConfidence,
        },
        overall: {
          confidence: this.getOverallConfidence(),
          status: this.analysisStatus,
          processingTime: this.processingTimeMs,
          errorMessage: this.errorMessage,
        },
      },
      timestamps: {
        createdAt: this.createdAt,
        createdBy: this.createdBy,
        updatedAt: this.updatedAt,
        updatedBy: this.updatedBy,
        deletedAt: this.deletedAt,
        deletedBy: this.deletedBy,
      },
      metadata: this.analysisMetadata,
    };
  }

  // Format cho analytics/reporting
  toAnalyticsData() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      detectedGender: this.detectedGender,
      genderConfidence: this.genderConfidence,
      detectedSkinColor: this.detectedSkinColor,
      SkinColorConfidence: this.SkinColorConfidence,
      analysisStatus: this.analysisStatus,
      processingTimeMs: this.processingTimeMs,
      createdAt: this.createdAt,
      hasValidResults: this.hasValidResults(),
      overallConfidence: this.getOverallConfidence(),
    };
  }
}
