export class PaginationParamsModel {
  public readonly page: number;
  public readonly limit: number;

  constructor(page = 1, limit = 10) {
    this.page = page;
    this.limit = limit;
  }

  toQuery() {
    return {
      take: this.limit,
      skip: (this.page - 1) * this.limit,
    };
  }
}
