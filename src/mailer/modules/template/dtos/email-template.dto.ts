import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class EmailTemplateDto {
  @ApiProperty()
  @Type(() => Number)
  templateId!: number;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  subject!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsString()
  html!: string;
}

export class GetEmailTemplateDto extends PickType(EmailTemplateDto, [
  'templateId',
]) {}

export class CreateEmailTemplateDto extends PickType(EmailTemplateDto, [
  'name',
  'description',
  'html',
  'subject',
]) {}

export class UpdateEmailTemplateParamsDto extends PickType(EmailTemplateDto, [
  'templateId',
]) {}

export class UpdateEmailTemplateBodyDto extends PartialType(
  PickType(EmailTemplateDto, ['name', 'subject', 'description', 'html']),
) {}

export class DeleteEmailTemplateDto extends PickType(EmailTemplateDto, [
  'templateId',
]) {}
