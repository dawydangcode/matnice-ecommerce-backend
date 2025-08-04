export interface LensQualityModel {
  id: number;
  name: string;
  price: number;
  description?: string;
  uvProtection: boolean;
  antiReflective: boolean;
  hardCoating: boolean;
  nightDayOptimization: boolean;
  antistaticCoating: boolean;
  freeFormTechnology: boolean;
  transitionsOption: boolean;
  createdAt: Date;
  createdBy: number;
  updatedAt?: Date;
  updatedBy?: number;
  deletedAt?: Date;
  deletedBy?: number;
}
