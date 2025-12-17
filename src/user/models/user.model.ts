export class UserModel {
  public readonly id: number;
  public readonly username: string;
  public readonly roleId: number;
  public readonly email: string;
  public readonly password: string | undefined;
  public readonly isVerified: boolean;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    username: string,
    roleId: number,
    email: string,
    password: string | undefined,
    isVerified: boolean,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.username = username;
    this.roleId = roleId;
    this.email = email;
    this.password = password;
    this.isVerified = isVerified;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
