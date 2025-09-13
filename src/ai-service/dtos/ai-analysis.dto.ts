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
import { GenderDetectedType } from '../enum/detected-gender.type';
import { SkinColorDetectedType } from '../enum/detect-skin-color.type';
import { AnalysisStatusType } from '../enum/analysis-status.type';

// Request DTOs
export class AnalyzeFaceRequestDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file to analyze (JPEG, JPG, PNG)',
    required: true,
  })
  image!: Express.Multer.File;

  @ApiPropertyOptional({
    description: 'Session ID for tracking user session',
    example: 123,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  sessionId?: number;

  @ApiPropertyOptional({
    description: 'User ID if user is logged in',
    example: 123,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;
}

export class GetAnalysisRequestDto {
  @ApiProperty({
    description: 'Session ID to get analysis results',
    example: 123,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  sessionId!: number;
}

export class GetAnalysisHistoryRequestDto {
  @ApiPropertyOptional({
    description: 'User ID to get analysis history',
    example: 123,
  })
  @IsOptional()
  @Type(() => Number)
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
  detected!: GenderDetectedType;

  @ApiProperty({
    description: 'Confidence score for gender detection (0-1)',
    example: 0.8542,
  })
  confidence!: number;
}

export class SkinColorAnalysisDto {
  @ApiProperty({
    enum: ['light', 'medium', 'dark', 'unknown'],
    description: 'Detected skin tone',
    example: 'medium',
  })
  detected!: SkinColorDetectedType;

  @ApiProperty({
    description: 'Confidence score for skin tone detection (0-1)',
    example: 0.7231,
  })
  confidence!: number;
}

export class OverallAnalysisDto {
  @ApiProperty({
    description: 'Overall confidence score (average of all analyses)',
    example: 0.7887,
  })
  confidence!: number;

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
  sessionId!: string;

  @ApiProperty({
    description: 'Analysis results',
    type: 'object',
    properties: {
      gender: {
        type: 'object',
        properties: {
          detected: { type: 'string', enum: ['male', 'female', 'unknown'] },
          confidence: { type: 'number' },
        },
      },
      SkinColor: {
        type: 'object',
        properties: {
          detected: {
            type: 'string',
            enum: ['light', 'medium', 'dark', 'unknown'],
          },
          confidence: { type: 'number' },
        },
      },
      overall: {
        type: 'object',
        properties: {
          confidence: { type: 'number' },
          processingTime: { type: 'number' },
        },
      },
    },
  })
  analysis!: {
    gender: GenderAnalysisDto;
    SkinColor: SkinColorAnalysisDto;
    overall: OverallAnalysisDto;
  };

  @ApiProperty({
    enum: ['pending', 'processing', 'completed', 'failed'],
    description: 'Analysis processing status',
    example: 'completed',
  })
  status!: AnalysisStatusType;

  @ApiProperty({
    description: 'When the analysis was completed',
    example: '2024-01-15T10:30:00.000Z',
  })
  analyzedAt!: Date;
}

export class AnalyzeFaceResponseDto {
  @ApiProperty({
    description: 'Whether the request was successful',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Session ID for tracking analysis',
    example: 'sess_1234567890',
  })
  sessionId!: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Face analysis started successfully',
  })
  message!: string;

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
  success!: boolean;

  @ApiProperty({
    type: FaceAnalysisResultDto,
    description: 'Analysis results',
  })
  data!: FaceAnalysisResultDto;

  @ApiProperty({
    description: 'Response message',
    example: 'Analysis retrieved successfully',
  })
  message!: string;
}

export class AnalysisHistoryItemDto {
  @ApiProperty({
    description: 'Analysis ID',
    example: 123,
  })
  id!: number;

  @ApiProperty({
    description: 'Session ID',
    example: 'sess_1234567890',
  })
  sessionId!: string;

  @ApiProperty({
    description: 'Analysis results',
    type: 'object',
    properties: {
      gender: {
        type: 'object',
        properties: {
          detected: { type: 'string', enum: ['male', 'female', 'unknown'] },
          confidence: { type: 'number' },
        },
      },
      SkinColor: {
        type: 'object',
        properties: {
          detected: {
            type: 'string',
            enum: ['light', 'medium', 'dark', 'unknown'],
          },
          confidence: { type: 'number' },
        },
      },
      overall: {
        type: 'object',
        properties: {
          confidence: { type: 'number' },
          processingTime: { type: 'number' },
        },
      },
    },
  })
  analysis!: {
    gender: GenderAnalysisDto;
    SkinColor: SkinColorAnalysisDto;
    overall: OverallAnalysisDto;
  };

  @ApiProperty({
    description: 'When the analysis was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt!: Date;
}

export class GetAnalysisHistoryResponseDto {
  @ApiProperty({
    description: 'Whether the request was successful',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    type: [AnalysisHistoryItemDto],
    description: 'List of analysis history',
  })
  data!: AnalysisHistoryItemDto[];

  @ApiProperty({
    description: 'Pagination metadata',
  })
  pagination!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  @ApiProperty({
    description: 'Response message',
    example: 'Analysis history retrieved successfully',
  })
  message!: string;
}

// Error Response DTOs
export class ErrorResponseDto {
  @ApiProperty({
    description: 'Whether the request was successful',
    example: false,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Error message',
    example: 'Invalid image format',
  })
  message!: string;

  @ApiPropertyOptional({
    description: 'Error code for client handling',
    example: 'INVALID_IMAGE_FORMAT',
  })
  errorCode?: string;
}
