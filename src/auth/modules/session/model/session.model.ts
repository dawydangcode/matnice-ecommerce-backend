import { SessionType } from '../enums/session.type';

export class SessionModel {
  public readonly id: number;
  public readonly userId: number;
  public readonly type: SessionType | undefined;
  public readonly isActive: boolean;
  public readonly userAgent: string | undefined;
  public readonly ipAddress: string | undefined;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: Number | undefined;

  constructor(
    id: number,
    userId: number,
    type: SessionType | undefined,
    isActive: boolean,
    userAgent: string | undefined,
    ipAddress: string | undefined,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: Number | undefined,
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.isActive = isActive;
    this.userAgent = userAgent;
    this.ipAddress = ipAddress;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
