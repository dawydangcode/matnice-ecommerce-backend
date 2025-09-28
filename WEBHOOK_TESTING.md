# PayOS Webhook Testing Guide

## Test Webhook Endpoint

### 1. Create Test Script

Create a test file to verify webhook signature validation:

```typescript
// test-webhook.ts
import * as crypto from 'crypto';

// Sample webhook data (replace with actual PayOS webhook format)
const testWebhookData = {
  code: '00',
  desc: 'success',
  success: true,
  data: {
    orderCode: 1234567890,
    amount: 10000,
    description: 'Test payment',
    accountNumber: '12345678',
    reference: 'TXN123',
    transactionDateTime: '2024-01-20T10:30:00',
    currency: 'VND',
    paymentLinkId: 'abc123',
    code: '00',
    desc: 'Thành công',
  },
  signature: '',
};

// Your PayOS checksum key
const CHECKSUM_KEY = 'your-checksum-key-here';

// Sort object by key
function sortObjDataByKey(object: any): any {
  const orderedObject = Object.keys(object)
    .sort()
    .reduce((obj: any, key: string) => {
      obj[key] = object[key];
      return obj;
    }, {});
  return orderedObject;
}

// Convert object to query string
function convertObjToQueryStr(object: any): string {
  return Object.keys(object)
    .filter((key) => object[key] !== undefined)
    .map((key) => {
      let value = object[key];

      if (value && Array.isArray(value)) {
        value = JSON.stringify(
          value.map((val) =>
            typeof val === 'object' ? sortObjDataByKey(val) : val,
          ),
        );
      }

      if ([null, undefined, 'undefined', 'null'].includes(value)) {
        value = '';
      }

      return `${key}=${value}`;
    })
    .join('&');
}

// Generate signature
const sortedData = sortObjDataByKey(testWebhookData.data);
const dataQueryStr = convertObjToQueryStr(sortedData);
const signature = crypto
  .createHmac('sha256', CHECKSUM_KEY)
  .update(dataQueryStr)
  .digest('hex');

testWebhookData.signature = signature;

console.log(
  'Test webhook data with signature:',
  JSON.stringify(testWebhookData, null, 2),
);
```

### 2. Test with curl

```bash
# Test webhook endpoint
curl -X POST http://localhost:3000/api/payment/payos/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "code": "00",
    "desc": "success",
    "success": true,
    "data": {
      "orderCode": 1234567890,
      "amount": 10000,
      "description": "Test payment",
      "accountNumber": "12345678",
      "reference": "TXN123",
      "transactionDateTime": "2024-01-20T10:30:00",
      "currency": "VND",
      "paymentLinkId": "abc123",
      "code": "00",
      "desc": "Thành công"
    },
    "signature": "generated-signature-here"
  }'
```

### 3. Environment Variables

Make sure these are set in your `.env`:

```bash
# PayOS Configuration
PAYOS_CLIENT_ID=your-client-id
PAYOS_API_KEY=your-api-key
PAYOS_CHECKSUM_KEY=your-checksum-key
```

### 4. Webhook URL Configuration

In PayOS dashboard, configure webhook URL:

```
https://your-domain.com/api/payment/payos/webhook
```

For local testing with ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000

# Use the ngrok URL in PayOS dashboard
https://abc123.ngrok.io/api/payment/payos/webhook
```

### 5. Expected Webhook Data Format

PayOS sends webhook in this format:

```json
{
  "code": "00",
  "desc": "success",
  "success": true,
  "data": {
    "orderCode": 1234567890,
    "amount": 10000,
    "description": "Payment description",
    "accountNumber": "12345678",
    "reference": "TXN_REF_123",
    "transactionDateTime": "2024-01-20T10:30:00.000Z",
    "currency": "VND",
    "paymentLinkId": "payment-link-id",
    "code": "00",
    "desc": "Thành công"
  },
  "signature": "hmac-sha256-signature"
}
```

### 6. Debugging Tips

1. **Check logs**: Monitor console output for signature verification details
2. **Verify checksum key**: Ensure it matches PayOS dashboard
3. **Data format**: Ensure webhook data matches expected format
4. **Signature generation**: Use exact same algorithm as PayOS
5. **Network issues**: Check if webhook URL is accessible from PayOS servers

### 7. Common Issues

- **Invalid signature**: Check checksum key and sorting algorithm
- **Network timeout**: Ensure webhook endpoint responds quickly
- **Data format mismatch**: Verify webhook data structure
- **Environment variables**: Ensure all PayOS config is loaded correctly
