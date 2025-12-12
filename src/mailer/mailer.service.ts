import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { TemplateService } from './modules/template/template.service';
import { MailOptionsModel } from './models/mail-options.model';
import { EmailTemplateType } from 'src/auth/enums/email-template.type';

@Injectable()
export class MailerService {
  constructor(
    @Inject('NODEMAILER_TRANSPORT')
    private readonly nodemailerTransport: Transporter,
    private readonly configService: ConfigService,
    private readonly templateService: TemplateService,
  ) {}

  async sendMailWithTemplate(
    email: string,
    templateName: EmailTemplateType,
    variables: Record<string, string>,
  ): Promise<MailOptionsModel> {
    const template = await this.templateService.getTemplateByName(templateName);

    let htmlContent = template.html;
    let subject = template.subject;

    // Replace variables in both subject and HTML content
    for (const [key, value] of Object.entries(variables)) {
      htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
      subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    const fromEmail = `${this.configService.get<string>('MAILER_DEFAULT_NAME')} <${this.configService.get<string>('MAILER_DEFAULT_EMAIL')}>`;

    const mailData = new MailOptionsModel(
      fromEmail,
      email,
      subject,
      template.html,
      htmlContent,
    );

    await this.nodemailerTransport.sendMail(mailData);

    return mailData;
  }

  /**
   * Send order confirmation email with order details
   */
  async sendOrderConfirmationEmail(
    email: string,
    orderData: {
      orderId: number;
      payosOrderCode: string;
      customerName: string;
      orderDate: string;
      totalPrice: string;
      shippingCost: string;
      subtotal: string;
      products: Array<{
        name: string;
        quantity: number;
        price: string;
        lensInfo?: string;
      }>;
      shippingAddress: {
        fullName: string;
        phone: string;
        province: string;
        district: string;
        ward: string;
        addressDetail: string;
      };
    },
  ): Promise<MailOptionsModel> {
    // Build product list HTML
    const productListHtml = orderData.products
      .map(
        (product) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            ${product.name}
            ${product.lensInfo ? `<br><span style="font-size: 12px; color: #6b7280;">${product.lensInfo}</span>` : ''}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${product.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${product.price}</td>
        </tr>
      `,
      )
      .join('');

    const variables: Record<string, string> = {
      customerName: orderData.customerName,
      orderId: orderData.orderId.toString(),
      payosOrderCode: orderData.payosOrderCode,
      orderDate: orderData.orderDate,
      productList: productListHtml,
      subtotal: orderData.subtotal,
      shippingCost: orderData.shippingCost,
      totalPrice: orderData.totalPrice,
      shippingFullName: orderData.shippingAddress.fullName,
      shippingPhone: orderData.shippingAddress.phone,
      shippingAddress: `${orderData.shippingAddress.addressDetail}, ${orderData.shippingAddress.ward}, ${orderData.shippingAddress.district}, ${orderData.shippingAddress.province}`,
    };

    return this.sendMailWithTemplate(
      email,
      EmailTemplateType.ORDER_CONFIRMATION,
      variables,
    );
  }

  async sendOrderStatusUpdateEmail(
    email: string,
    orderData: {
      customerName: string;
      orderId: number;
      oldStatus: string;
      newStatus: string;
      orderDate: string;
      trackingNumber?: string;
      estimatedDelivery?: string;
    },
  ): Promise<MailOptionsModel> {
    // Map status to Vietnamese display names
    const statusDisplayNames: Record<string, string> = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đã gửi hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy',
    };

    const variables: Record<string, string> = {
      customerName: orderData.customerName,
      orderId: orderData.orderId.toString(),
      oldStatus: statusDisplayNames[orderData.oldStatus] || orderData.oldStatus,
      newStatus: statusDisplayNames[orderData.newStatus] || orderData.newStatus,
      orderDate: orderData.orderDate,
      trackingNumber: orderData.trackingNumber || 'Chưa cập nhật',
      estimatedDelivery: orderData.estimatedDelivery || 'Đang cập nhật',
    };

    return this.sendMailWithTemplate(
      email,
      EmailTemplateType.ORDER_STATUS_UPDATE,
      variables,
    );
  }
}
