import { ApiProperty } from '@nestjs/swagger';

export class Model3dConfigModel {
  @ApiProperty({ description: 'Config ID' })
  id!: number;

  @ApiProperty({ description: '3D model ID' })
  modelId!: number;

  @ApiProperty({ description: 'Offset X coordinate' })
  offsetX!: number;

  @ApiProperty({ description: 'Offset Y coordinate' })
  offsetY!: number;

  @ApiProperty({ description: 'Position offset X' })
  positionOffsetX!: number;

  @ApiProperty({ description: 'Position offset Y' })
  positionOffsetY!: number;

  @ApiProperty({ description: 'Position offset Z' })
  positionOffsetZ!: number;

  @ApiProperty({ description: 'Initial scale' })
  initialScale!: number;

  @ApiProperty({ description: 'Rotation sensitivity' })
  rotationSensitivity!: number;

  @ApiProperty({ description: 'Yaw rotation limit' })
  yawLimit!: number;

  @ApiProperty({ description: 'Pitch rotation limit' })
  pitchLimit!: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Created by user ID', nullable: true })
  createdBy?: number;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @ApiProperty({ description: 'Updated by user ID', nullable: true })
  updatedBy?: number;

  @ApiProperty({ description: 'Deletion timestamp', nullable: true })
  deletedAt?: Date;

  @ApiProperty({ description: 'Deleted by user ID', nullable: true })
  deletedBy?: number;
}
