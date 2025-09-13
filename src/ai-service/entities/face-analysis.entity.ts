import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { AnalysisStatusType } from '../enum/analysis-status.type';
import { GenderDetectedType } from '../enum/detected-gender.type';
import { SkinColorDetectedType } from '../enum/detect-skin-color.type';
import { FaceAnalysisModel } from '../models/face-analysis.model';

@Entity('face_analysis')
@Index(['sessionId'])
@Index(['userId'])
@Index(['createdAt'])
export class FaceAnalysisEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'session_id' })
  sessionId!: number;

  @Column({ name: 'user_id' })
  userId?: number;

  @Column({ name: 'image_url' })
  imageUrl!: string;

  @Column({ name: 'image_s3_key' })
  imageS3Key!: string;

  // Gender Analysis Results
  @Column({ name: 'detected_gender' })
  detectedGender!: GenderDetectedType;

  @Column({ name: 'gender_confidence' })
  genderConfidence!: number;

  // Skin Tone Analysis Results
  @Column({ name: 'detected_skin_tone' })
  detectedSkinColor!: SkinColorDetectedType;

  @Column({ name: 'skin_color_confidence' })
  SkinColorConfidence!: number;

  // Processing Status
  @Column({ name: 'analysis_status' })
  AnalysisStatusType!: AnalysisStatusType;

  @Column({ type: 'text', name: 'error_message', nullable: true })
  errorMessage!: string;

  // Processing Times
  @Column({ name: 'processing_time_ms' })
  processingTimeMs!: number;

  // Metadata
  @Column({ type: 'json', name: 'analysis_metadata', nullable: true })
  analysisMetadata?: {
    imageWidth?: number;
    imageHeight?: number;
    faceDetected?: boolean;
    faceCount?: number;
    modelVersions?: {
      genderModel?: string;
      SkinColorModel?: string;
    };
  };

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'updated_by' })
  updatedBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;

  toModel(): FaceAnalysisModel {
    return new FaceAnalysisModel(
      this.id,
      this.sessionId.toString(),
      this.userId,
      this.imageUrl,
      this.imageS3Key,
      this.detectedGender,
      this.genderConfidence,
      this.detectedSkinColor,
      this.SkinColorConfidence,
      this.AnalysisStatusType,
      this.errorMessage,
      this.processingTimeMs,
      this.createdAt,
      this.createdBy,
      this.updatedAt,
      this.updatedBy,
      this.deletedAt,
      this.deletedBy,
    );
  }
}
