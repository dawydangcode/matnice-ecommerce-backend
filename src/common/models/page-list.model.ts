export class PageList<T> {
  public readonly total: number;
  public readonly data: T[];

  constructor(total: number, data: T[]) {
    this.total = total;
    this.data = data;
  }
}
