import { AnalysisStatus } from '../enum/analysis-status.type';
import { SkinColorDetected } from '../enum/detect-skin-color.type';
import { GenderDetected } from '../enum/detected-gender.type';

export class FaceAnalysisModel {
  public readonly id: number;
  public readonly sessionId: string;
  public readonly userId: number | undefined;
  public readonly imageUrl: string;
  public readonly imageS3Key: string;

  // Gender Analysis Results
  public readonly detectedGender: GenderDetected;
  public readonly genderConfidence: number;

  // Skin Tone Analysis Results
  public readonly detectedSkinTone: SkinColorDetected;
  public readonly skinToneConfidence: number;

  // Processing Status
  public readonly analysisStatus: AnalysisStatus;
  public readonly errorMessage?: string;
  public readonly processingTimeMs?: number;

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
    detectedGender: GenderDetected,
    genderConfidence: number,
    detectedSkinTone: SkinColorDetected,
    skinToneConfidence: number,
    analysisStatus: AnalysisStatus,
    errorMessage: string,
    processingTimeMs: number,
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
    this.detectedSkinTone = detectedSkinTone;
    this.skinToneConfidence = skinToneConfidence;
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
  analysisMetadata?: {
    imageWidth?: number;
    imageHeight?: number;
    faceDetected?: boolean;
    faceCount?: number;
    modelVersions?: {
      genderModel?: string;
      skinToneModel?: string;
    };
  };

  constructor(data: Partial<FaceAnalysisModel>) {
    Object.assign(this, data);
  }

  // Helper methods
  isProcessingComplete(): boolean {
    return this.analysisStatus === 'completed';
  }

  isProcessingFailed(): boolean {
    return this.analysisStatus === 'failed';
  }

  hasValidResults(): boolean {
    return (
      this.isProcessingComplete() &&
      this.detectedGender !== 'unknown' &&
      this.detectedSkinTone !== 'unknown'
    );
  }

  getOverallConfidence(): number {
    if (!this.hasValidResults()) return 0;
    return (this.genderConfidence + this.skinToneConfidence) / 2;
  }

  toPublicResult() {
    return {
      sessionId: this.sessionId,
      analysis: {
        gender: {
          detected: this.detectedGender,
          confidence: this.genderConfidence,
        },
        skinTone: {
          detected: this.detectedSkinTone,
          confidence: this.skinToneConfidence,
        },
        overall: {
          confidence: this.getOverallConfidence(),
          processingTime: this.processingTimeMs,
        },
      },
      status: this.analysisStatus,
      analyzedAt: this.updatedAt,
    };
  }
}
