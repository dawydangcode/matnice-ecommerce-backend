export class TokenModel {
  public readonly token: string;
  public readonly expireDate: Date;

  constructor(token: string, expireDate: Date) {
    this.token = token;
    this.expireDate = expireDate;
  }
}
