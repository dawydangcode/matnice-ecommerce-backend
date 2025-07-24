import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  CreateEmailTemplateDto,
  DeleteEmailTemplateDto,
  GetEmailTemplateDto,
  UpdateEmailTemplateBodyDto,
  UpdateEmailTemplateParamsDto,
} from './dtos/email-template.dto';
import { TemplateService } from './template.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/decorator/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { RequestModel } from 'src/common/models/request.model';
import { EmailTemplateModel } from './models/email-template.model';

@Controller('api/v1')
@ApiTags('Mail Template')
@Roles(RoleType.Admin)
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get('template/list')
  async getTemplates(): Promise<EmailTemplateModel[]> {
    return await this.templateService.getTemplates();
  }

  @Get('template/:templateId/detail')
  async getTemplate(@Param() params: GetEmailTemplateDto) {
    return await this.templateService.getTemplateById(params.templateId);
  }

  @Post('template/create')
  async create(@Req() req: RequestModel, @Body() body: CreateEmailTemplateDto) {
    return await this.templateService.createTemplate(
      body.name,
      body.subject,
      body.description,
      body.html,
      req.user.accountId,
    );
  }

  @Put('template/:templateId/update')
  async update(
    @Req() req: RequestModel,
    @Param() params: UpdateEmailTemplateParamsDto,
    @Body() body: UpdateEmailTemplateBodyDto,
  ) {
    return await this.templateService.updateTemplate(
      params.templateId,
      body.name,
      body.subject,
      body.description,
      body.html,
      req.user.accountId,
    );
  }

  @Delete('template/:templateId/delete')
  async delete(
    @Req() req: RequestModel,
    @Param() params: DeleteEmailTemplateDto,
  ) {
    await this.templateService.deleteTemplate(
      params.templateId,
      req.user.accountId,
    );
  }
}
