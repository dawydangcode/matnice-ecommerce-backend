import { GenderType } from '../enums/gender.type';

export class UserDetailModel {
  public readonly id: number;
  public readonly userId: number;
  public readonly name: string | undefined;
  public readonly dob: Date | undefined;
  public readonly gender: GenderType | undefined;
  public readonly created_at: Date;
  public readonly created_by: number;
  public readonly updated_at: Date;
  public readonly updated_by: number;
  public readonly deleted_at: Date;
  public readonly deleted_by: number;

  constructor(
    id: number,
    userId: number,
    name: string | undefined,
    dob: Date | undefined,
    gender: GenderType | undefined,
    created_at: Date,
    created_by: number,
    updated_at: Date,
    updated_by: number,
    deleted_at: Date,
    deleted_by: number,
  ) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.dob = dob;
    this.gender = gender;
    this.created_at = created_at;
    this.created_by = created_by;
    this.updated_at = updated_at;
    this.updated_by = updated_by;
    this.deleted_at = deleted_at;
    this.deleted_by = deleted_by;
  }
}
