export class RoleModel {
  public readonly id: number;
  public readonly name: string;
  public readonly created_at: Date | undefined;
  public readonly created_by: number | undefined;
  public readonly updated_at: Date | undefined;
  public readonly updated_by: number | undefined;
  public readonly deleted_at: Date | undefined;
  public readonly deleted_by: number | undefined;

  constructor(
    id: number,
    name: string,
    created_at: Date | undefined,
    created_by: number | undefined,
    updated_at: Date | undefined,
    updated_by: number | undefined,
    deleted_at: Date | undefined,
    deleted_by: number | undefined,
  ) {
    this.id = id;
    this.name = name;
    this.created_at = created_at;
    this.created_by = created_by;
    this.updated_at = updated_at;
    this.updated_by = updated_by;
    this.deleted_at = deleted_at;
    this.deleted_by = deleted_by;
  }
}
