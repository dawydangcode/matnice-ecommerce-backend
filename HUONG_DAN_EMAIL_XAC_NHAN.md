# Hướng dẫn sử dụng tính năng Email xác nhận đơn hàng

## �� Mục đích

Sau khi khách hàng thanh toán thành công qua PayOS, hệ thống sẽ tự động gửi email xác nhận đơn hàng đến địa chỉ email mà khách hàng đã nhập.

## 📧 Thông tin trong email

Email xác nhận bao gồm:

### 1. Thông tin cơ bản
- ✅ **Mã hóa đơn**: Mã đơn hàng trong database (VD: #194)
- ✅ **Mã thanh toán PayOS**: orderCode từ PayOS (VD: 1765548332890)
- ✅ Thời gian đặt hàng
- ✅ Tên khách hàng

### 2. Chi tiết sản phẩm
Với mỗi sản phẩm:
- Tên sản phẩm
- Số lượng
- Giá tiền
- **Thông tin tròng kính** (nếu có):
  - Loại tròng: Single Vision, Progressive, Bifocal...
  - Độ cầu (SPH) mắt phải/trái
  - Độ loạn (CYL) mắt phải/trái

### 3. Chi phí
- Tạm tính
- Phí vận chuyển
- **Tổng cộng**

### 4. Địa chỉ giao hàng
- Tên người nhận
- Số điện thoại
- Địa chỉ đầy đủ

## 🚀 Cách cài đặt

### Bước 1: Chạy SQL để tạo email template

```bash
mysql -u root -p matnice_ecommerce < src/mailer/sql/order-confirmation-template.sql
```

Hoặc copy nội dung file `src/mailer/sql/order-confirmation-template.sql` và chạy trong phpMyAdmin.

### Bước 2: Kiểm tra cấu hình email trong .env

Đảm bảo file `.env` có đầy đủ thông tin:

```env
MAILER_HOST=smtp.gmail.com
MAILER_PORT=587
MAILER_USER=your-email@gmail.com
MAILER_PASSWORD=your-app-password
MAILER_DEFAULT_NAME=Mat Nice Store
MAILER_DEFAULT_EMAIL=noreply@matnice.com
```

**Lưu ý với Gmail:**
- Không dùng mật khẩu thường
- Phải tạo "App Password" tại: https://myaccount.google.com/apppasswords
- Bật 2-Step Verification trước khi tạo App Password

### Bước 3: Restart backend

```bash
npm run start:dev
```

## ✅ Kiểm tra hoạt động

1. **Đặt hàng và thanh toán** qua giao diện frontend
2. **Xem console log** backend, sẽ thấy:
   ```
   📧 Preparing to send order confirmation email...
   📧 Order confirmation email sent to: customer@example.com
   ```
3. **Kiểm tra email inbox** của khách hàng

## 🔧 Tùy chỉnh email template

### Chỉnh sửa giao diện email

1. Vào database → bảng `email_template`
2. Tìm record có `name = 'order_confirmation'`
3. Sửa cột `html` để thay đổi giao diện
4. Sửa cột `subject` để thay đổi tiêu đề

### Các biến có thể dùng trong template

- `{{customerName}}` - Tên khách hàng
- `{{orderId}}` - Mã đơn hàng
- `{{payosOrderCode}}` - Mã thanh toán PayOS
- `{{orderDate}}` - Ngày đặt hàng
- `{{productList}}` - Danh sách sản phẩm (tự động)
- `{{subtotal}}` - Tạm tính
- `{{shippingCost}}` - Phí ship
- `{{totalPrice}}` - Tổng cộng
- `{{shippingFullName}}` - Tên người nhận
- `{{shippingPhone}}` - SĐT người nhận
- `{{shippingAddress}}` - Địa chỉ đầy đủ

## ⚠️ Xử lý lỗi

- Email gửi thất bại **KHÔNG làm fail** quá trình tạo đơn hàng
- Đơn hàng vẫn được tạo thành công
- Lỗi chỉ được ghi log, không throw exception
- Client vẫn nhận response success

## 🐛 Troubleshooting

### Email không được gửi?

**1. Kiểm tra SMTP config**
```bash
# Xem log backend có lỗi gì không
tail -f logs/app.log
```

**2. Kiểm tra template đã có trong DB chưa**
```sql
SELECT * FROM email_template WHERE name = 'order_confirmation';
```

**3. Test với Mailtrap (môi trường dev)**
```env
MAILER_HOST=smtp.mailtrap.io
MAILER_PORT=2525
MAILER_USER=your-mailtrap-username
MAILER_PASSWORD=your-mailtrap-password
```

### Email vào spam?

- Sử dụng email service chuyên nghiệp: SendGrid, AWS SES, Mailgun
- Cấu hình SPF, DKIM records cho domain
- Tránh dùng từ ngữ "spam" trong nội dung

## 📝 Files đã thay đổi

1. `src/auth/enums/email-template.type.ts` - Thêm ORDER_CONFIRMATION
2. `src/mailer/mailer.service.ts` - Thêm method gửi email xác nhận
3. `src/payment/payment.module.ts` - Import MailerModule
4. `src/payment/controllers/payos.controller.ts` - Logic gửi email
5. `src/mailer/sql/order-confirmation-template.sql` - Template email

## 📚 Tài liệu chi tiết

Xem file `ORDER_CONFIRMATION_EMAIL.md` để biết thêm chi tiết kỹ thuật.
