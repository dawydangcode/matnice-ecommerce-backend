import { SessionType } from '../enum/session.type';

export class SessionModel {
  public readonly id: number;
  public readonly userId: number;
  public readonly type: SessionType | undefined;
  public readonly userAgent: string | undefined;
  public readonly ipAddress: string | undefined;
  public readonly isActive: boolean | undefined;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    userId: number,
    type: SessionType | undefined,
    userAgent: string | undefined,
    ipAddress: string | undefined,
    isActive: boolean | undefined,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.userAgent = userAgent;
    this.ipAddress = ipAddress;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
