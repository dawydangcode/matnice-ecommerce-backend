/**
 * Test script for PayOS webhook signature verification
 * Run with: npx ts-node test-webhook-signature.ts
 */

import * as crypto from 'crypto';

// Test configuration - using actual checksum key from .env
const CHECKSUM_KEY =
  '695f0cbc05e6023900ba9e3b0539ac6019c623c75bb8c58a9a5dcc1c47ce3ab1';

// Sample webhook data (typical PayOS format)
const testWebhookData = {
  code: '00',
  desc: 'success',
  success: true,
  data: {
    orderCode: 1234567890,
    amount: 10000,
    description: 'Test payment for cart',
    accountNumber: '12345678',
    reference: 'TXN123',
    transactionDateTime: '2024-01-20T10:30:00.000Z',
    currency: 'VND',
    paymentLinkId: 'abc123def456',
    code: '00',
    desc: 'Thành công',
  },
};

/**
 * Sort object by key (alphabetical order)
 */
function sortObjDataByKey(object: any): any {
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
function convertObjToQueryStr(object: any): string {
  return Object.keys(object)
    .filter((key) => object[key] !== undefined)
    .map((key) => {
      let value = object[key];

      // Sort nested object
      if (value && Array.isArray(value)) {
        value = JSON.stringify(
          value.map((val) =>
            typeof val === 'object' ? sortObjDataByKey(val) : val,
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
 * Generate HMAC SHA256 signature
 */
function generateSignature(data: any, checksumKey: string): string {
  const sortedData = sortObjDataByKey(data);
  const queryString = convertObjToQueryStr(sortedData);

  console.log('🔍 Debug Information:');
  console.log('1. Original data:', JSON.stringify(data, null, 2));
  console.log('2. Sorted data:', JSON.stringify(sortedData, null, 2));
  console.log('3. Query string:', queryString);

  const signature = crypto
    .createHmac('sha256', checksumKey)
    .update(queryString)
    .digest('hex');

  console.log('4. Generated signature:', signature);

  return signature;
}

/**
 * Verify webhook signature
 */
function verifyWebhookSignature(
  webhookData: any,
  expectedSignature: string,
  checksumKey: string,
): boolean {
  const computedSignature = generateSignature(webhookData.data, checksumKey);
  const isValid = computedSignature === expectedSignature;

  console.log('\n✅ Verification Result:');
  console.log('Expected signature:', expectedSignature);
  console.log('Computed signature:', computedSignature);
  console.log('Is valid:', isValid);

  return isValid;
}

// Main test
console.log('🚀 PayOS Webhook Signature Test\n');

// Generate signature for test data
const generatedSignature = generateSignature(
  testWebhookData.data,
  CHECKSUM_KEY,
);

// Create complete webhook payload
const completeWebhookData = {
  ...testWebhookData,
  signature: generatedSignature,
};

console.log('\n📦 Complete webhook payload:');
console.log(JSON.stringify(completeWebhookData, null, 2));

// Verify the signature
console.log('\n🔐 Verifying signature...');
const isValid = verifyWebhookSignature(
  completeWebhookData,
  generatedSignature,
  CHECKSUM_KEY,
);

if (isValid) {
  console.log('\n🎉 SUCCESS: Signature verification passed!');
  console.log('You can use this payload to test your webhook endpoint.');
} else {
  console.log('\n❌ FAILED: Signature verification failed!');
  console.log('Check your checksum key and implementation.');
}

// Instructions
console.log('\n📋 Instructions:');
console.log('1. Replace CHECKSUM_KEY with your actual PayOS checksum key');
console.log('2. Run: npx ts-node test-webhook-signature.ts');
console.log('3. Use the generated payload to test your webhook endpoint');
console.log(
  '4. Test endpoint: POST http://localhost:3000/api/payment/payos/webhook',
);

export {
  generateSignature,
  verifyWebhookSignature,
  sortObjDataByKey,
  convertObjToQueryStr,
};
