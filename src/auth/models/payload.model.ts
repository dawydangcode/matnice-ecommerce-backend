export class PayloadModel {
  public readonly userId: number;
  public readonly sessionId: number;
  public readonly email: string;
  public readonly roleId: number;
  public readonly role: string;

  constructor(
    userId: number,
    sessionId: number,
    email: string,
    roleId: number,
    role: string,
  ) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.email = email;
    this.roleId = roleId;
    this.role = role;
  }

  toJson() {
    return {
      userId: this.userId,
      sessionId: this.sessionId,
      email: this.email,
      roleId: this.roleId,
      role: this.role,
    };
  }
}
