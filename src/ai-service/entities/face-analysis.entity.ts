import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('face_analysis')
@Index(['sessionId'])
@Index(['userId'])
@Index(['createdAt'])
export class FaceAnalysisEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint', name: 'session_id' })
  sessionId!: number;

  @Column({ type: 'bigint', name: 'user_id', nullable: true })
  userId?: number;

  @Column({ type: 'varchar', length: 255, name: 'image_url' })
  imageUrl!: string;

  @Column({ type: 'varchar', length: 50, name: 'image_s3_key' })
  imageS3Key!: string;

  // Gender Analysis Results
  @Column({
    type: 'enum',
    enum: ['male', 'female', 'unknown'],
    name: 'detected_gender',
    default: 'unknown',
  })
  detectedGender!: 'male' | 'female' | 'unknown';

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 4,
    name: 'gender_confidence',
    default: 0,
  })
  genderConfidence!: number;

  // Skin Tone Analysis Results
  @Column({
    type: 'enum',
    enum: ['light', 'medium', 'dark', 'unknown'],
    name: 'detected_skin_tone',
    default: 'unknown',
  })
  detectedSkinTone!: 'light' | 'medium' | 'dark' | 'unknown';

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 4,
    name: 'skin_tone_confidence',
    default: 0,
  })
  skinToneConfidence!: number;

  // Processing Status
  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'completed', 'failed'],
    name: 'analysis_status',
    default: 'pending',
  })
  analysisStatus!: 'pending' | 'processing' | 'completed' | 'failed';

  @Column({ type: 'text', name: 'error_message', nullable: true })
  errorMessage?: string;

  // Processing Times
  @Column({ type: 'int', name: 'processing_time_ms', nullable: true })
  processingTimeMs?: number;

  // Metadata
  @Column({ type: 'json', name: 'analysis_metadata', nullable: true })
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'bigint', name: 'created_by', nullable: true })
  createdBy?: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'bigint', name: 'updated_by', nullable: true })
  updatedBy?: number;

  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'bigint', name: 'deleted_by', nullable: true })
  deletedBy?: number;
}
