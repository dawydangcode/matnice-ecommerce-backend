export class LensImageModel {
  public readonly id: number;
  public readonly lensId: number;
  public readonly imageUrl: string;
  public readonly imageOrder?: string;
  public readonly isThumbnail?: boolean;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    lensId: number,
    imageUrl: string,
    imageOrder: string | undefined,
    isThumbnail: boolean | undefined,
    createdAt: Date,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.lensId = lensId;
    this.imageUrl = imageUrl;
    this.imageOrder = imageOrder;
    this.isThumbnail = isThumbnail;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }

  // Kiểm tra xem có phải ảnh chính không
  isPrimaryImage(): boolean {
    return this.imageOrder === 'a';
  }

  // Lấy thứ tự ảnh
  getImageOrder(): number {
    if (!this.imageOrder) return 999; // Đưa về cuối nếu không có order
    return this.imageOrder.charCodeAt(0) - 'a'.charCodeAt(0);
  }
}
