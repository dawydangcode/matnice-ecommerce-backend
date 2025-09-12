import {
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

// Request DTOs
export class AnalyzeFaceRequestDto {
  @ApiPropertyOptional({
    description: 'Session ID for tracking user session',
    example: 'sess_1234567890',
  })
  @IsOptional()
  @IsString()
  sessionId!: string;

  @ApiPropertyOptional({
    description: 'User ID if user is logged in',
    example: 123,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId!: number;
}

export class GetAnalysisRequestDto {
  @ApiProperty({
    description: 'Session ID to get analysis results',
    example: 'sess_1234567890',
  })
  @IsNotEmpty()
  @IsString()
  sessionId!: string;
}

export class GetAnalysisHistoryRequestDto {
  @ApiPropertyOptional({
    description: 'User ID to get analysis history',
    example: 123,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId!: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of records per page',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}

// Response DTOs
export class GenderAnalysisDto {
  @ApiProperty({
    enum: ['male', 'female', 'unknown'],
    description: 'Detected gender',
    example: 'female',
  })
  detected: 'male' | 'female' | 'unknown';

  @ApiProperty({
    description: 'Confidence score for gender detection (0-1)',
    example: 0.8542,
  })
  confidence: number;
}

export class SkinToneAnalysisDto {
  @ApiProperty({
    enum: ['light', 'medium', 'dark', 'unknown'],
    description: 'Detected skin tone',
    example: 'medium',
  })
  detected: 'light' | 'medium' | 'dark' | 'unknown';

  @ApiProperty({
    description: 'Confidence score for skin tone detection (0-1)',
    example: 0.7231,
  })
  confidence: number;
}

export class OverallAnalysisDto {
  @ApiProperty({
    description: 'Overall confidence score (average of all analyses)',
    example: 0.7887,
  })
  confidence: number;

  @ApiProperty({
    description: 'Processing time in milliseconds',
    example: 2340,
  })
  processingTime?: number;
}

export class FaceAnalysisResultDto {
  @ApiProperty({
    description: 'Session ID',
    example: 'sess_1234567890',
  })
  sessionId: string;

  @ApiProperty({
    type: () => ({
      gender: GenderAnalysisDto,
      skinTone: SkinToneAnalysisDto,
      overall: OverallAnalysisDto,
    }),
    description: 'Analysis results',
  })
  analysis: {
    gender: GenderAnalysisDto;
    skinTone: SkinToneAnalysisDto;
    overall: OverallAnalysisDto;
  };

  @ApiProperty({
    enum: ['pending', 'processing', 'completed', 'failed'],
    description: 'Analysis processing status',
    example: 'completed',
  })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @ApiProperty({
    description: 'When the analysis was completed',
    example: '2024-01-15T10:30:00.000Z',
  })
  analyzedAt: Date;
}

export class AnalyzeFaceResponseDto {
  @ApiProperty({
    description: 'Whether the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Session ID for tracking analysis',
    example: 'sess_1234567890',
  })
  sessionId: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Face analysis started successfully',
  })
  message: string;

  @ApiPropertyOptional({
    type: FaceAnalysisResultDto,
    description: 'Analysis results (if processing is fast enough)',
  })
  data?: FaceAnalysisResultDto;
}

export class GetAnalysisResponseDto {
  @ApiProperty({
    description: 'Whether the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: FaceAnalysisResultDto,
    description: 'Analysis results',
  })
  data: FaceAnalysisResultDto;

  @ApiProperty({
    description: 'Response message',
    example: 'Analysis retrieved successfully',
  })
  message: string;
}

export class AnalysisHistoryItemDto {
  @ApiProperty({
    description: 'Analysis ID',
    example: 123,
  })
  id: number;

  @ApiProperty({
    description: 'Session ID',
    example: 'sess_1234567890',
  })
  sessionId: string;

  @ApiProperty({
    type: () => ({
      gender: GenderAnalysisDto,
      skinTone: SkinToneAnalysisDto,
      overall: OverallAnalysisDto,
    }),
    description: 'Analysis results',
  })
  analysis: {
    gender: GenderAnalysisDto;
    skinTone: SkinToneAnalysisDto;
    overall: OverallAnalysisDto;
  };

  @ApiProperty({
    description: 'When the analysis was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;
}

export class GetAnalysisHistoryResponseDto {
  @ApiProperty({
    description: 'Whether the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: [AnalysisHistoryItemDto],
    description: 'List of analysis history',
  })
  data: AnalysisHistoryItemDto[];

  @ApiProperty({
    description: 'Pagination metadata',
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  @ApiProperty({
    description: 'Response message',
    example: 'Analysis history retrieved successfully',
  })
  message: string;
}

// Error Response DTOs
export class ErrorResponseDto {
  @ApiProperty({
    description: 'Whether the request was successful',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'Error message',
    example: 'Invalid image format',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Error code for client handling',
    example: 'INVALID_IMAGE_FORMAT',
  })
  errorCode?: string;
}
