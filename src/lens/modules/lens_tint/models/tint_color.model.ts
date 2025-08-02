export class TintColorModel {
  constructor(
    public id: number,
    public tintId: number,
    public name: string,
    public imageUrl: string | null,
    public colorCode: string | null,
    public createdAt: Date,
    public createdBy: number | null,
    public updatedAt: Date,
    public updatedBy: number | null,
    public deletedAt: Date | null,
    public deletedBy: number | null,
  ) {}
}
