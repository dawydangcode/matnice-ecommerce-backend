export class JwtConfigModel {
  public readonly secret: string;
  public readonly expiresIn: string;

  constructor(secret: string, expiresIn: string) {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  toJson() {
    return JSON.parse(JSON.stringify(this));
  }
}
