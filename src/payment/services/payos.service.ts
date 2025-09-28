import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PayOS, type Webhook } from '@payos/node';

export interface CreatePaymentLinkData {
  orderCode: number;
  amount: number;
  description: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  returnUrl: string;
  cancelUrl: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAddress?: string;
}

export interface PaymentLinkResponse {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: string;
  checkoutUrl: string;
  qrCode: string;
}

@Injectable()
export class PayOSService {
  private payOS: PayOS;

  constructor(private configService: ConfigService) {
    // Initialize PayOS with credentials from environment variables
    this.payOS = new PayOS({
      clientId: this.configService.get<string>('PAYOS_CLIENT_ID') || '',
      apiKey: this.configService.get<string>('PAYOS_API_KEY') || '',
      checksumKey: this.configService.get<string>('PAYOS_CHECKSUM_KEY') || '',
    });
  }

  async createPaymentLink(
    data: CreatePaymentLinkData,
  ): Promise<PaymentLinkResponse> {
    try {
      const paymentData = {
        orderCode: data.orderCode,
        amount: data.amount,
        description: data.description,
        items: data.items,
        returnUrl: data.returnUrl,
        cancelUrl: data.cancelUrl,
        buyerName: data.buyerName,
        buyerEmail: data.buyerEmail,
        buyerPhone: data.buyerPhone,
        buyerAddress: data.buyerAddress,
      };

      const paymentLinkResponse =
        await this.payOS.paymentRequests.create(paymentData);

      return paymentLinkResponse;
    } catch (error: any) {
      throw new HttpException(
        `PayOS Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPaymentLinkInfo(paymentLinkId: string): Promise<any> {
    try {
      return await this.payOS.paymentRequests.get(paymentLinkId);
    } catch (error: any) {
      throw new HttpException(
        `PayOS Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async cancelPaymentLink(
    paymentLinkId: string,
    reason?: string,
  ): Promise<any> {
    try {
      return await this.payOS.paymentRequests.cancel(paymentLinkId, reason);
    } catch (error: any) {
      throw new HttpException(
        `PayOS Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Sort object by key (alphabetical order)
   */
  private sortObjDataByKey(object: any): any {
    const orderedObject = Object.keys(object)
      .sort()
      .reduce((obj: any, key: string) => {
        obj[key] = object[key];
        return obj;
      }, {});
    return orderedObject;
  }

  /**
   * Convert object to query string for signature generation
   */
  private convertObjToQueryStr(object: any): string {
    return Object.keys(object)
      .filter((key) => object[key] !== undefined)
      .map((key) => {
        let value = object[key];

        // Sort nested object
        if (value && Array.isArray(value)) {
          value = JSON.stringify(
            value.map((val) =>
              typeof val === 'object' ? this.sortObjDataByKey(val) : val,
            ),
          );
        }

        // Set empty string if null
        if ([null, undefined, 'undefined', 'null'].includes(value)) {
          value = '';
        }

        return `${key}=${value}`;
      })
      .join('&');
  }

  /**
   * Verify PayOS webhook signature
   */
  verifyPaymentWebhookData(webhookData: Webhook): boolean {
    try {
      const checksumKey =
        this.configService.get<string>('PAYOS_CHECKSUM_KEY') || '';

      console.log('Verifying webhook signature...');
      console.log('Webhook data:', JSON.stringify(webhookData, null, 2));

      // Sort data by key
      const sortedDataByKey = this.sortObjDataByKey(webhookData.data);
      console.log('Sorted data:', JSON.stringify(sortedDataByKey, null, 2));

      // Convert to query string
      const dataQueryStr = this.convertObjToQueryStr(sortedDataByKey);
      console.log('Data query string:', dataQueryStr);

      // Generate signature
      const computedSignature = crypto
        .createHmac('sha256', checksumKey)
        .update(dataQueryStr)
        .digest('hex');

      console.log('Computed signature:', computedSignature);
      console.log('Received signature:', webhookData.signature);

      const isValid = computedSignature === webhookData.signature;
      console.log('Signature valid:', isValid);

      return isValid;
    } catch (error: any) {
      console.error('PayOS Webhook Verification Error:', error);
      return false;
    }
  }

  /**
   * Alternative method using PayOS SDK
   */
  async verifyPaymentWebhookDataSDK(webhookData: Webhook): Promise<boolean> {
    try {
      const verifiedData = await this.payOS.webhooks.verify(webhookData);
      console.log('PayOS SDK verification successful:', verifiedData);
      return true;
    } catch (error: any) {
      console.error('PayOS SDK Webhook Verification Error:', error);
      return false;
    }
  }

  generateOrderCode(): number {
    // Generate a unique order code (timestamp + random)
    return Date.now();
  }
}
