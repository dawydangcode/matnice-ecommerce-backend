import { Injectable } from '@nestjs/common';
import { EmailTemplateEntity } from './entities/email-template.entity';
import { In, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailTemplateModel } from './models/email-template.model';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(EmailTemplateEntity)
    private readonly emailTemplateRepository: Repository<EmailTemplateEntity>,
  ) {}

  async getTemplates(): Promise<EmailTemplateModel[]> {
    const template = await this.emailTemplateRepository.find({
      where: {
        deletedAt: IsNull(),
      },
    });

    return template.map((entity) => entity.toModel());
  }

  async getTemplateById(templateId: number): Promise<EmailTemplateModel> {
    const template = await this.emailTemplateRepository.findOne({
      where: {
        id: templateId,
        deletedAt: IsNull(),
      },
    });

    if (!template) {
      throw new Error('EmailTemplateEntity not found');
    }

    return template.toModel();
  }

  async getTemplateByName(templateName: string): Promise<EmailTemplateModel> {
    const template = await this.emailTemplateRepository.findOne({
      where: {
        name: templateName,
        deletedAt: IsNull(),
      },
    });

    if (!template) {
      throw new Error(
        `EmailTemplateEntity with name '${templateName}' not found`,
      );
    }

    return template.toModel();
  }

  async createTemplate(
    name: string,
    subject: string,
    description: string,
    html: string,
    reqAccountId: number | undefined,
  ): Promise<EmailTemplateModel> {
    const entity = this.emailTemplateRepository.create({
      name: name,
      subject: subject,
      description: description,
      html: html,
      createdAt: new Date(),
      createdBy: reqAccountId,
    });
    const template = await this.emailTemplateRepository.save(entity);
    if (!reqAccountId) {
      await this.emailTemplateRepository.update(template.id, {
        createdBy: template.id,
      });
    }
    return await this.getTemplateById(template.id);
  }

  async updateTemplate(
    templateId: number,
    name: string | undefined,
    subject: string | undefined,
    description: string | undefined,
    html: string | undefined,
    reqAccountId: number | undefined,
  ): Promise<EmailTemplateModel> {
    await this.emailTemplateRepository.update(
      { id: templateId },
      {
        name: name,
        subject: subject,
        description: description,
        html: html,
        updatedAt: new Date(),
        updatedBy: reqAccountId,
      },
    );
    return await this.getTemplateById(templateId);
  }

  async deleteTemplate(
    templateId: number,
    reqAccountId: number,
  ): Promise<boolean> {
    await this.emailTemplateRepository.update(
      { id: templateId },
      {
        deletedAt: new Date(),
        deletedBy: reqAccountId,
      },
    );
    return true;
  }
}
