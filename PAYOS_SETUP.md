# PayOS Integration Setup

## Cấu hình PayOS Backend

### 1. Cài đặt thư viện PayOS

```bash
cd matnice-ecommerce-backend
npm install @payos/node
```

### 2. Cấu hình environment variables

Thêm vào file `.env`:

```env
# PayOS Configuration
PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key
```

### 3. Lấy thông tin PayOS

1. Đăng ký tài khoản tại: https://my.payos.vn
2. Xác thực doanh nghiệp/cá nhân
3. Tạo kênh thanh toán
4. Lấy Client ID, API Key, và Checksum Key từ dashboard

### 4. Cấu hình Webhook URL

Trong PayOS dashboard, cấu hình Webhook URL:

```
https://your-domain.com/api/payment/payos/webhook
```

**Lưu ý quan trọng về Webhook:**

- Webhook endpoint đã được implement với xác thực chữ ký HMAC_SHA256
- PayOS sẽ gửi POST request đến webhook URL khi có thay đổi trạng thái thanh toán
- Hệ thống sẽ tự động xác minh chữ ký và xử lý thanh toán thành công/thất bại
- Webhook endpoint là public (không cần JWT token) để PayOS có thể gọi

**Cấu hình local testing với ngrok:**

```bash
# Cài đặt ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000

# Sử dụng ngrok URL trong PayOS dashboard
https://abc123.ngrok.io/api/payment/payos/webhook
```

## Cấu hình PayOS Frontend

### 1. Cài đặt thư viện PayOS

```bash
cd matnice-ecommerce-frontend
npm install @payos/payos-checkout
```

### 2. Return URLs

PayOS sẽ redirect về các URLs sau:

- **Success**: `/checkout/payment-success` - Khi thanh toán thành công
- **Cancel**: `/checkout` - Khi hủy thanh toán

## API Endpoints

### Backend PayOS Endpoints

#### 1. Tạo link thanh toán cho cart

```http
POST /api/v1/payos/create-embedded-payment-link
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "cartId": 1,
  "returnUrl": "https://your-domain.com/checkout/payment-success",
  "cancelUrl": "https://your-domain.com/checkout",
  "buyerName": "Nguyễn Văn A",
  "buyerEmail": "example@email.com",
  "buyerPhone": "0123456789",
  "buyerAddress": "123 ABC Street"
}
```

#### 2. Tạo link thanh toán custom

```http
POST /api/v1/payos/create-payment-link
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "orderId": 12345,
  "amount": 500000,
  "description": "Thanh toán đơn hàng #12345",
  "items": [
    {
      "name": "Gọng kính Tom Ford",
      "quantity": 1,
      "price": 500000
    }
  ],
  "returnUrl": "https://your-domain.com/checkout/payment-success",
  "cancelUrl": "https://your-domain.com/checkout",
  "buyerName": "Nguyễn Văn A",
  "buyerEmail": "example@email.com"
}
```

#### 3. Webhook endpoint (PayOS gọi tự động)

```http
POST /api/payment/payos/webhook
Content-Type: application/json

{
  "code": "00",
  "desc": "success",
  "success": true,
  "data": {
    "orderCode": 1234567890,
    "amount": 10000,
    "description": "Thanh toán đơn hàng",
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

## Bảo mật Webhook

### Xác thực chữ ký HMAC_SHA256

PayOS sử dụng HMAC_SHA256 để ký webhook data. Backend tự động xác thực:

1. **Sắp xếp dữ liệu**: Sắp xếp các key trong `data` theo thứ tự alphabet
2. **Tạo query string**: Chuyển đổi object thành query string format
3. **Tính toán HMAC**: Sử dụng CHECKSUM_KEY để tạo chữ ký HMAC_SHA256
4. **So sánh**: So sánh chữ ký tính toán với chữ ký trong webhook

```typescript
// Algorithm implemented in PayOSService.verifyPaymentWebhookData()
const sortedData = sortObjDataByKey(webhookData.data);
const queryString = convertObjToQueryStr(sortedData);
const computedSignature = crypto
  .createHmac('sha256', checksumKey)
  .update(queryString)
  .digest('hex');

const isValid = computedSignature === webhookData.signature;
```

### Kiểm tra Webhook

Để test webhook endpoint:

```bash
# Xem logs webhook
tail -f logs/application.log | grep "PayOS Webhook"

# Test với curl (cần signature hợp lệ)
curl -X POST http://localhost:3000/api/payment/payos/webhook \
  -H "Content-Type: application/json" \
  -d @webhook-test-data.json
```

```http
POST /api/v1/payos/webhook
Content-Type: application/json

{
  "code": "00",
  "desc": "success",
  "success": true,
  "data": {
    "orderCode": 123456,
    "amount": 500000,
    "description": "Payment description",
    "accountNumber": "12345678",
    "reference": "TF230204212323",
    "transactionDateTime": "2023-02-04 18:25:00",
    "currency": "VND",
    "paymentLinkId": "124c33293c43417ab7879e14c8d9eb18",
    "code": "00",
    "desc": "Thành công"
  },
  "signature": "signature_string"
}
```

## Frontend Usage

### 1. Import PayOS Component

```tsx
import PayOSPayment from '../components/PayOSPayment';
```

### 2. Sử dụng PayOS Payment

```tsx
<PayOSPayment
  isVisible={showPayOSPayment}
  onSuccess={(orderCode) => {
    // Handle successful payment
    console.log('Payment successful:', orderCode);
    navigate('/order-success');
  }}
  onCancel={() => {
    // Handle payment cancellation
    setShowPayOSPayment(false);
  }}
  customerInfo={{
    fullName: 'Nguyễn Văn A',
    phone: '0123456789',
    email: 'example@email.com',
    address: '123 ABC Street, Ward, District, City',
  }}
/>
```

## Luồng thanh toán

### 1. Thanh toán từ Checkout

1. User chọn "Thanh toán trực tuyến (PayOS)"
2. Nhấn "Thanh toán trực tuyến"
3. PayOS modal hiện ra
4. User nhấn "Tạo Link Thanh Toán"
5. Backend tạo payment link từ cart items
6. PayOS embedded form hiển thị
7. User thực hiện thanh toán
8. PayOS redirect về `/checkout/payment-success`

### 2. Webhook Processing

1. PayOS gửi webhook về `/api/v1/payos/webhook`
2. Backend verify signature
3. Nếu thanh toán thành công:
   - Cập nhật payment status
   - Tạo order từ cart
   - Xóa cart
   - Gửi email xác nhận

### 3. Return URL Processing

Payment Success Page sẽ nhận các query params:

- `code`: Mã lỗi (00 = thành công)
- `id`: Payment Link ID
- `cancel`: true/false
- `status`: PAID/PENDING/CANCELLED
- `orderCode`: Mã đơn hàng

## Testing

### 1. Test Environment

PayOS cung cấp sandbox environment để test:

- Sử dụng test credentials
- Không có giao dịch thật

### 2. Test Cards

PayOS cung cấp test cards để test các scenarios khác nhau

### 3. Test Webhook

Sử dụng ngrok để expose local webhook endpoint:

```bash
ngrok http 3000
# Webhook URL: https://abc123.ngrok.io/api/v1/payos/webhook
```

## Production Setup

### 1. HTTPS Required

PayOS yêu cầu HTTPS cho production:

- Return URLs phải là HTTPS
- Webhook URL phải là HTTPS

### 2. Domain Verification

Verify domain trong PayOS dashboard

### 3. Security

- Validate webhook signature
- Log all payment transactions
- Monitor for fraud

## Troubleshooting

### Common Issues

1. **Invalid signature**: Kiểm tra Checksum Key
2. **CORS issues**: Cấu hình CORS cho PayOS domains
3. **Webhook not received**: Kiểm tra URL và HTTPS
4. **Payment link creation fails**: Kiểm tra API credentials

### Debug Logs

- Backend: Console logs trong PayOS service
- Frontend: Browser console cho PayOS events
- PayOS Dashboard: Transaction logs

## Support

- PayOS Documentation: https://docs.payos.vn
- PayOS Support: support@payos.vn
- Integration Support: https://my.payos.vn/support
