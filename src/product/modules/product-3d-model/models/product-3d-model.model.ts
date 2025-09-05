export interface Product3dModel {
  id: number;
  productId: number;
  modelType: string;
  fileType: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  isPrimary: boolean;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
