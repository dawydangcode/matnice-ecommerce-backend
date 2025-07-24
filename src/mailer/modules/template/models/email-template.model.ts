export class EmailTemplateModel {
  public readonly templateId: number;
  public readonly name: string;
  public readonly subject: string;
  public readonly description: string;
  public readonly html: string;
  public readonly createdAt: Date | undefined;
  public readonly createdBy: number | undefined;
  public readonly updatedAt: Date | undefined;
  public readonly updatedBy: number | undefined;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    templateId: number,
    name: string,
    subject: string,
    description: string,
    html: string,
    createdAt: Date | undefined,
    createdBy: number | undefined,
    updatedAt: Date | undefined,
    updatedBy: number | undefined,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.templateId = templateId;
    this.name = name;
    this.subject = subject;
    this.description = description;
    this.html = html;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
