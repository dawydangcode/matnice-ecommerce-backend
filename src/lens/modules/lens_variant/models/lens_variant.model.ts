import { LensMaterialsType } from '../enum/lens-materials.type';
import { LensDesignType } from '../enum/lens_design.type';

export class LensVariantModel {
  public readonly id: number;
  public readonly lensId: number;
  public readonly lensThicknessId: number;
  public readonly design: LensDesignType;
  public readonly material: LensMaterialsType;
  public readonly price: number;
  public readonly stock: number;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    lensId: number,
    lensThicknessId: number,
    design: LensDesignType,
    material: LensMaterialsType,
    price: number,
    stock: number,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.lensId = lensId;
    this.lensThicknessId = lensThicknessId;
    this.design = design;
    this.material = material;
    this.price = price;
    this.stock = stock;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
