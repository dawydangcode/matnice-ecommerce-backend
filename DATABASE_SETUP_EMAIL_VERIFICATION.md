# 📧 Hướng Dẫn Setup Email Verification

## Bước 1: Thêm Cột `is_verified` vào bảng `user`

```sql
-- Kết nối với database
mysql -u root -p
-- Nhập password: sapassword

-- Chọn database
USE mat_nice_ecommerce;

-- Thêm cột is_verified
ALTER TABLE user 
ADD COLUMN is_verified TINYINT(1) DEFAULT 0 
COMMENT 'Email verification status: 0 = not verified, 1 = verified'
AFTER email;

-- Kiểm tra cột đã được thêm
DESCRIBE user;
```

## Bước 2: Insert Email Template vào Database

```sql
-- Vẫn trong MySQL shell
-- Copy và paste câu lệnh sau:

INSERT INTO `email_template` (`name`, `html`, `subject`, `description`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`)
VALUES (
  'email_verification',
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 28px;
        }
        .email-body {
            padding: 40px 30px;
            color: #333333;
            line-height: 1.6;
        }
        .email-body h2 {
            color: #667eea;
            margin-bottom: 20px;
        }
        .email-body p {
            margin-bottom: 15px;
        }
        .verify-button {
            display: inline-block;
            padding: 15px 40px;
            margin: 25px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
        }
        .verify-button:hover {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
        .email-footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .divider {
            margin: 30px 0;
            border: 0;
            border-top: 1px solid #e0e0e0;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>🎉 Welcome to Mat Nice Store!</h1>
        </div>
        <div class="email-body">
            <h2>Hello {{username}}!</h2>
            <p>Thank you for registering with <strong>Mat Nice Store</strong>. We''re excited to have you on board!</p>
            
            <p>To complete your registration and start shopping, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="{{verifyUrl}}" class="verify-button">Verify Email Address</a>
            </div>
            
            <div class="info-box">
                <p><strong>⏰ Important:</strong> This verification link will expire in <strong>{{expiresIn}}</strong>.</p>
            </div>
            
            <hr class="divider">
            
            <p style="font-size: 14px; color: #6c757d;">
                If you didn''t create an account with Mat Nice Store, please ignore this email or contact our support team.
            </p>
            
            <p style="font-size: 14px; color: #6c757d;">
                <strong>Note:</strong> If the button doesn''t work, copy and paste this link into your browser:<br>
                <a href="{{verifyUrl}}" style="color: #667eea; word-break: break-all;">{{verifyUrl}}</a>
            </p>
        </div>
        <div class="email-footer">
            <p>&copy; 2025 Mat Nice Store. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>',
  'Verify Your Email Address - Mat Nice Store',
  'Email template for email verification after registration',
  NOW(),
  1,
  NULL,
  NULL,
  NULL,
  NULL
);
```

## Bước 3: Kiểm Tra Template Đã Insert

```sql
-- Kiểm tra email template vừa tạo
SELECT id, name, subject, description 
FROM email_template 
WHERE name = 'email_verification';

-- Thoát MySQL
EXIT;
```

## Bước 4: Restart Backend

```bash
# Di chuyển đến thư mục backend
cd /home/dawy/KLTN/matnice-ecommerce-backend

# Restart backend
npm run start:dev
```

## Bước 5: Test Chức Năng

### Test 1: Đăng ký tài khoản mới
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

**Kết quả mong đợi:**
- ✅ Tài khoản được tạo với `is_verified = 0`
- ✅ Email xác thực được gửi đến test@example.com
- ✅ Backend log hiển thị: "Sending email verification to test@example.com"

### Test 2: Kiểm tra email trong database
```sql
SELECT id, username, email, is_verified 
FROM user 
WHERE email = 'test@example.com';
```

**Kết quả mong đợi:**
```
| id | username    | email            | is_verified |
|----|-------------|------------------|-------------|
| XX | testuser123 | test@example.com | 0           |
```

### Test 3: Kiểm tra email nhận được
1. Mở email test@example.com
2. Tìm email từ "Mat Nice Store"
3. Click nút "Verify Email Address"
4. Sẽ redirect đến: `http://localhost:3002/verify-email?token=xxx`

### Test 4: Xác thực token
```bash
# Copy token từ URL, sau đó chạy:
curl -X POST http://localhost:3000/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_TỪ_EMAIL"
  }'
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Test 5: Kiểm tra user đã verified
```sql
SELECT id, username, email, is_verified 
FROM user 
WHERE email = 'test@example.com';
```

**Kết quả mong đợi:**
```
| id | username    | email            | is_verified |
|----|-------------|------------------|-------------|
| XX | testuser123 | test@example.com | 1           |
```

## 📊 Cấu Trúc Email Template

### Biến động (Variables)
Email template sử dụng 3 biến:

1. **{{username}}** - Tên người dùng
   - Ví dụ: "testuser123"

2. **{{verifyUrl}}** - Link xác thực
   - Format: `http://localhost:3002/verify-email?token=xxx`
   - Token có thời hạn 15 phút (config trong .env)

3. **{{expiresIn}}** - Thời gian hết hạn
   - Format human-readable: "15 minutes", "1 hour", etc.
   - Được tính động bởi moment.js

### Thiết Kế Email
- **Header**: Gradient tím với emoji 🎉
- **Body**: Nội dung chào mừng và hướng dẫn
- **Button**: Màu gradient tím, có hover effect
- **Info Box**: Cảnh báo thời hạn với border màu tím
- **Footer**: Copyright và thông báo "do not reply"

## 🔍 Troubleshooting

### Vấn đề 1: Template không insert được
**Lỗi:** Duplicate entry 'email_verification'

**Giải pháp:**
```sql
-- Xóa template cũ nếu có
DELETE FROM email_template WHERE name = 'email_verification';

-- Insert lại
-- (chạy lại câu INSERT ở Bước 2)
```

### Vấn đề 2: Email không được gửi
**Kiểm tra:**
1. Backend log có lỗi không?
2. Gmail credentials trong .env đúng không?
3. Email có bật "Less secure app access" không?

**Debug:**
```bash
# Kiểm tra backend log
tail -f logs/error.log
```

### Vấn đề 3: Token hết hạn quá nhanh
**Giải pháp:** Tăng thời gian trong .env
```properties
JWT_VERIFICATION_TOKEN_EXPIRES_IN=30m  # Thay vì 15m
```

### Vấn đề 4: Cột is_verified không tồn tại
**Lỗi:** Unknown column 'is_verified'

**Giải pháp:**
```sql
-- Kiểm tra cột
SHOW COLUMNS FROM user LIKE 'is_verified';

-- Nếu không có, chạy lại Bước 1
```

## 📝 Notes

- Token verification có thời hạn **15 phút** (config trong .env)
- Mỗi lần đăng ký sẽ tạo 1 session mới trong bảng `session`
- Session sẽ bị vô hiệu hóa sau khi verify thành công
- User phải verify email mới có thể login (có thể thêm check này sau)

## ✅ Checklist Hoàn Thành

- [ ] Thêm cột `is_verified` vào bảng `user`
- [ ] Insert email template vào database
- [ ] Kiểm tra template trong database
- [ ] Restart backend server
- [ ] Test đăng ký tài khoản mới
- [ ] Test email được gửi
- [ ] Test xác thực token
- [ ] Test user được update `is_verified = 1`

---

**Tạo bởi:** AI Assistant  
**Ngày:** December 17, 2025  
**Version:** 1.0
