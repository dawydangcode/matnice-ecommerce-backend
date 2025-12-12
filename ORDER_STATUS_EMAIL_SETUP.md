# Hướng dẫn triển khai tính năng gửi email cập nhật trạng thái đơn hàng

## 1. Chạy SQL để tạo email template

Kết nối vào MySQL và chạy file SQL:

```bash
cd /home/dawy/KLTN/matnice-ecommerce-backend
mysql -u your_username -p your_database_name < src/mailer/sql/order-status-update-template.sql
```

Hoặc copy nội dung file và chạy trực tiếp trong MySQL client.

## 2. Restart backend server

```bash
cd /home/dawy/KLTN/matnice-ecommerce-backend
npm run start:dev
```

## 3. Test tính năng

### Test thủ công:

1. Đăng nhập vào admin panel
2. Vào "Quản lý đơn hàng"
3. Chọn một đơn hàng và thay đổi trạng thái
4. Nhấn SUBMIT
5. Kiểm tra email của khách hàng

### Các trường hợp test:

- PENDING → PROCESSING
- PROCESSING → SHIPPED
- SHIPPED → DELIVERED
- Bất kỳ → CANCELLED

## 4. Kiểm tra logs

Backend sẽ log các thông tin sau:

```
Sending status update email for order {id}
Status update email sent successfully for order {id}
```

Nếu có lỗi:

```
Failed to send status update email for order {id}: {error}
```

## 5. Troubleshooting

### Email không gửi được:

1. Kiểm tra SMTP configuration trong .env
2. Kiểm tra email template đã được insert vào database chưa:
   ```sql
   SELECT * FROM email_template WHERE name = 'order_status_update';
   ```

### Email gửi nhưng không nhận được:

1. Kiểm tra spam folder
2. Kiểm tra email address trong đơn hàng có đúng không
3. Kiểm tra SMTP logs

## 6. Các file đã thay đổi:

### Backend:

- `src/auth/enums/email-template.type.ts` - Thêm ORDER_STATUS_UPDATE enum
- `src/mailer/mailer.service.ts` - Thêm method sendOrderStatusUpdateEmail()
- `src/order/order.service.ts` - Thêm logic gửi email trong updateOrderStatus()
- `src/order/order.module.ts` - Import MailerModule
- `src/mailer/sql/order-status-update-template.sql` - Email template HTML

### Không có thay đổi frontend

Frontend không cần thay đổi gì, tính năng hoạt động tự động khi admin cập nhật trạng thái.
