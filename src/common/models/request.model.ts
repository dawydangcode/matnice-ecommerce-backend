import { PayloadModel } from '../../auth/models/payload.model';

export class RequestModel extends Request {
  public readonly user!: PayloadModel;
}
