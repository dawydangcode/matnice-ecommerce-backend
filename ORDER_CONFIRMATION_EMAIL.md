# Order Confirmation Email Feature

## Tổng quan

Tính năng này tự động gửi email xác nhận đơn hàng cho khách hàng sau khi thanh toán thành công qua PayOS.

## Thông tin trong email

Email xác nhận sẽ bao gồm các thông tin sau:

### 1. Thông tin đơn hàng

- **Mã đơn hàng**: ID đơn hàng trong database (VD: #194)
- **Mã thanh toán PayOS**: orderCode từ PayOS (VD: 1765548332890)
- **Thời gian đặt hàng**: Thời gian tạo đơn hàng

### 2. Danh sách sản phẩm

Với mỗi sản phẩm trong đơn hàng:

- Tên sản phẩm
- Số lượng
- Giá tiền
- **Thông tin kính** (nếu có):
  - Loại tròng kính (Lens Type)
  - Độ cầu (SPH) mắt phải/trái
  - Độ loạn (CYL) mắt phải/trái
  - Trục (AXIS) mắt phải/trái

### 3. Tổng chi phí

- Tạm tính (Subtotal)
- Phí vận chuyển (Shipping Cost)
- Tổng cộng (Total Price)

### 4. Địa chỉ giao hàng

- Tên người nhận
- Số điện thoại
- Địa chỉ đầy đủ (Số nhà, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố)

## Cài đặt

### 1. Cài đặt template email vào database

Chạy SQL script để tạo template email:

\`\`\`bash
mysql -u your_username -p your_database < src/mailer/sql/order-confirmation-template.sql
\`\`\`

Hoặc import file SQL vào database qua phpMyAdmin hoặc MySQL Workbench.

### 2. Cấu hình SMTP

Đảm bảo file `.env` đã có các thông tin cấu hình email:

\`\`\`env
MAILER_HOST=smtp.gmail.com
MAILER_PORT=587
MAILER_USER=your-email@gmail.com
MAILER_PASSWORD=your-app-password
MAILER_DEFAULT_NAME=Mat Nice Store
MAILER_DEFAULT_EMAIL=noreply@matnice.com
\`\`\`

**Lưu ý**: Nếu sử dụng Gmail, cần tạo App Password thay vì dùng mật khẩu thường:

1. Vào Google Account Settings
2. Security → 2-Step Verification
3. App Passwords → Generate new password

## Luồng hoạt động

1. Khách hàng thanh toán qua PayOS thành công
2. Frontend gọi API `POST /api/payment/payos/create-order-from-payment`
3. Backend thực hiện:
   - ✅ Xác thực payment đã hoàn tất
   - ✅ Tạo đơn hàng (Order)
   - ✅ Cập nhật trạng thái đơn hàng
   - ✅ Xóa giỏ hàng
   - ✅ **Gửi email xác nhận** 👈 NEW!
4. Khách hàng nhận email xác nhận với đầy đủ thông tin đơn hàng

## API Endpoint

### Create Order From Payment

\`\`\`
POST /api/payment/payos/create-order-from-payment
\`\`\`

**Request Body:**
\`\`\`json
{
"transactionId": "1765548332890",
"customerInfo": {
"fullName": "Nguyễn Văn A",
"phone": "0987654321",
"email": "customer@example.com",
"province": "TP. Hồ Chí Minh",
"district": "Quận 1",
"ward": "Phường Bến Nghé",
"addressDetail": "123 Đường ABC",
"notes": "Ghi chú đơn hàng"
}
}
\`\`\`

**Response:**
\`\`\`json
{
"statusCode": 201,
"message": "Order created successfully from payment",
"data": {
"orderId": 194,
"paymentId": 123,
"transactionId": "1765548332890"
}
}
\`\`\`

**Email gửi tự động**: Sau khi tạo đơn hàng thành công, email xác nhận sẽ được gửi đến `customerInfo.email`

## Xử lý lỗi

Email được gửi trong khối `try-catch` riêng biệt, nên:

- ✅ Nếu gửi email thất bại, đơn hàng vẫn được tạo thành công
- ✅ Lỗi gửi email chỉ được log ra console, không làm fail toàn bộ process
- ✅ Response vẫn trả về success cho client

Console log khi gửi email:
\`\`\`
📧 Preparing to send order confirmation email...
📧 Order confirmation email sent to: customer@example.com
\`\`\`

Console log nếu gửi email thất bại:
\`\`\`
❌ Error sending order confirmation email: [Error details]
\`\`\`

## Customization

### Chỉnh sửa template email

1. Truy cập database → bảng `email_template`
2. Tìm record có `name = 'order_confirmation'`
3. Chỉnh sửa cột `html` để thay đổi giao diện email
4. Chỉnh sửa cột `subject` để thay đổi tiêu đề email

### Variables có thể sử dụng trong template

- `{{customerName}}` - Tên khách hàng
- `{{orderId}}` - Mã đơn hàng trong database
- `{{payosOrderCode}}` - Mã thanh toán PayOS
- `{{orderDate}}` - Thời gian đặt hàng
- `{{productList}}` - HTML danh sách sản phẩm (tự động generate)
- `{{subtotal}}` - Tạm tính
- `{{shippingCost}}` - Phí vận chuyển
- `{{totalPrice}}` - Tổng cộng
- `{{shippingFullName}}` - Tên người nhận
- `{{shippingPhone}}` - Số điện thoại người nhận
- `{{shippingAddress}}` - Địa chỉ đầy đủ

## Testing

### Test gửi email thủ công

Có thể test bằng cách:

1. Đặt hàng qua frontend và thanh toán
2. Kiểm tra console log backend xem có log "📧 Order confirmation email sent"
3. Kiểm tra email inbox của khách hàng

### Test với Mailtrap (Development)

Để test trong môi trường development mà không gửi email thật:

\`\`\`env
MAILER_HOST=smtp.mailtrap.io
MAILER_PORT=2525
MAILER_USER=your-mailtrap-username
MAILER_PASSWORD=your-mailtrap-password
\`\`\`

## Troubleshooting

### Email không được gửi

1. **Kiểm tra SMTP configuration trong .env**
2. **Kiểm tra email template đã được insert vào database chưa**
   \`\`\`sql
   SELECT \* FROM email_template WHERE name = 'order_confirmation';
   \`\`\`
3. **Kiểm tra console log** để xem error message cụ thể
4. **Test SMTP connection** với nodemailer

### Email vào spam

- Cấu hình SPF, DKIM, DMARC records cho domain
- Sử dụng email service provider chuyên nghiệp (SendGrid, Mailgun, AWS SES)
- Tránh sử dụng từ ngữ spam trong subject và content

### Product name hiển thị "Product #ID"

Hiện tại chưa fetch product name từ product service. Để cải thiện:

1. Import ProductService vào PayOSController
2. Fetch product details trong vòng lặp map products
3. Thay `Product #${item.productId}` bằng product name thực tế

## Files thay đổi

1. **src/auth/enums/email-template.type.ts** - Thêm ORDER_CONFIRMATION template type
2. **src/mailer/mailer.service.ts** - Thêm method sendOrderConfirmationEmail()
3. **src/payment/payment.module.ts** - Import MailerModule
4. **src/payment/controllers/payos.controller.ts** - Thêm logic gửi email sau khi tạo order
5. **src/mailer/sql/order-confirmation-template.sql** - SQL template cho email

## Future Improvements

- [ ] Fetch product name từ product service thay vì hiển thị "Product #ID"
- [ ] Thêm link tracking đơn hàng trong email
- [ ] Thêm QR code cho mã đơn hàng
- [ ] Gửi email cập nhật trạng thái đơn hàng (shipping, delivered)
- [ ] Multi-language support (EN/VI)
- [ ] Attach invoice PDF vào email
