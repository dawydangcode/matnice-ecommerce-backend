import { TokenModel } from './token.model';

export class LoginTokenModel {
  public readonly userId: number;
  public readonly accessToken: TokenModel;
  public readonly refreshToken: TokenModel;

  constructor(
    userId: number,
    accessToken: TokenModel,
    refreshToken: TokenModel,
  ) {
    this.userId = userId;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
