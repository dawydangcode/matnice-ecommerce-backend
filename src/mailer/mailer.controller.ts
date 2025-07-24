import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mailer')
@Controller('api/v1/mailer')
export class MailerController {}
