export class MailOptionsModel {
  public readonly from: string;
  public readonly to: string;
  public readonly subject: string;
  public readonly text: string;
  public readonly html?: string;

  constructor(
    from: string,
    to: string,
    subject: string,
    text: string,
    html?: string,
  ) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html;
  }
}
