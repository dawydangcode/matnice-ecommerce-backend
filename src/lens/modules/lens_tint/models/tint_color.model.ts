export class TintColorModel {
  constructor(
    public id: number,
    public tintId: number,
    public name: string,
    public imageUrl: string | undefined,
    public colorCode: string | undefined,
    public createdAt: Date,
    public createdBy: number | undefined,
    public updatedAt: Date,
    public updatedBy: number | undefined,
    public deletedAt: Date | undefined,
    public deletedBy: number | undefined,
  ) {}
}
