# 🐛 Email Verification - Debugging Guide

## Vấn Đề: Email không được gửi dù backend báo thành công

### ✅ Đã Làm
1. Email template đã được thêm vào database
2. Đã thêm logging vào `sendVerificationEmail()` method
3. Backend đã restart

---

## 🔍 Bước Debug

### Bước 1: Kiểm tra Backend Logs
Sau khi đăng ký, kiểm tra console backend. Bạn sẽ thấy:

```
📧 Starting email verification process for: cfdkcom4@gmail.com
✅ Session created: 123
✅ Token generated, expires: 2025-12-17T10:30:00.000Z
📧 Verification URL: http://localhost:3002/verify-email?token=eyJ...
⏰ Expires in: 15 minutes
📤 Sending email to: cfdkcom4@gmail.com
📧 Template type: email_verification
📧 Template variables: { username: 'user321', expiresIn: '15 minutes' }
```

**Nếu thấy logs trên:**
- ✅ Backend code đang chạy đúng
- ✅ Session được tạo thành công
- ✅ Token được generate
- ❓ Vấn đề ở Mailer Service

**Nếu thấy error:**
```
❌ Failed to send verification email: [Error message]
Error details: [Chi tiết lỗi]
```
→ Đọc error message để biết nguyên nhân

---

### Bước 2: Kiểm tra Mailer Configuration

**File:** `/home/dawy/KLTN/matnice-ecommerce-backend/.env`

```properties
# Check these values:
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=cfdkcom3@gmail.com
MAIL_PASS=pdgf ljru topu odke
MAIL_SECURE=false
EMAIL_VERIFICATION_URL=http://localhost:3002/verify-email
```

**Common Issues:**

1. **Wrong Gmail Credentials**
   - Email: `cfdkcom3@gmail.com`
   - App Password: `pdgf ljru topu odke`
   - ✅ Verify password is correct

2. **Gmail Security Block**
   - Gmail có thể block "less secure apps"
   - Solution: Use App Password instead of regular password
   - Hoặc bật "Allow less secure apps" trong Gmail settings

3. **2FA Enabled**
   - Nếu Gmail có 2FA → PHẢI dùng App Password
   - Tạo App Password: https://myaccount.google.com/apppasswords

---

### Bước 3: Kiểm tra Email Template trong Database

```sql
SELECT id, name, subject 
FROM email_template 
WHERE name = 'email_verification';
```

**Expected Result:**
```
| id | name               | subject                                   |
|----|--------------------|-------------------------------------------|
| X  | email_verification | Verify Your Email Address - Mat Nice Store |
```

**Nếu không có:**
→ Chạy lại SQL insert template

---

### Bước 4: Test Mailer Service Directly

Tạo test endpoint để check mailer:

```typescript
// In auth.controller.ts
@Public()
@Post('test-email')
async testEmail(@Body() body: { email: string }) {
  try {
    await this.authService.testSendEmail(body.email);
    return { success: true, message: 'Email sent' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

```typescript
// In auth.service.ts
async testSendEmail(email: string): Promise<void> {
  await this.mailerService.sendMailWithTemplate(
    email,
    EmailTemplateType.EMAIL_VERIFICATION,
    {
      username: 'Test User',
      verifyUrl: 'http://localhost:3002/verify-email?token=test123',
      expiresIn: '15 minutes',
    }
  );
}
```

**Test:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

---

### Bước 5: Kiểm tra MailerService

**File:** `src/mailer/mailer.service.ts`

Tìm method `sendMailWithTemplate()` và thêm logging:

```typescript
async sendMailWithTemplate(
  to: string,
  templateType: EmailTemplateType,
  variables: Record<string, any>,
): Promise<void> {
  console.log('🔍 MailerService.sendMailWithTemplate called');
  console.log('   To:', to);
  console.log('   Template:', templateType);
  console.log('   Variables:', variables);

  try {
    // Get template from database
    const template = await this.emailTemplateRepository.findOne({
      where: { name: templateType },
    });

    console.log('📄 Template found:', template ? 'Yes' : 'No');
    
    if (!template) {
      throw new Error(`Email template '${templateType}' not found`);
    }

    // Replace variables
    let html = template.html;
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, variables[key]);
    });

    console.log('📧 Sending email via transporter...');
    
    // Send email
    await this.transporter.sendMail({
      from: this.configService.get('MAILER_DEFAULT_EMAIL'),
      to,
      subject: template.subject,
      html,
    });

    console.log('✅ Email sent successfully');
  } catch (error: any) {
    console.error('❌ MailerService error:', error);
    throw error;
  }
}
```

---

## 🎯 Các Nguyên Nhân Thường Gặp

### 1. Email Template Không Tồn Tại
**Symptom:** Backend log shows "Template not found"

**Solution:**
```sql
INSERT INTO email_template (name, html, subject, ...)
VALUES ('email_verification', '...', '...', ...);
```

### 2. Gmail Blocking
**Symptom:** Error "Username and Password not accepted" hoặc "SMTP authentication failed"

**Solutions:**
- Sử dụng App Password
- Bật "Less secure app access"
- Kiểm tra 2FA settings

### 3. Wrong Port/Host
**Symptom:** Connection timeout hoặc "ECONNREFUSED"

**Solution:**
```properties
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false  # Use TLS (STARTTLS)

# OR
MAIL_PORT=465
MAIL_SECURE=true   # Use SSL
```

### 4. Template Variables Không Match
**Symptom:** Email sent nhưng hiển thị `{{username}}` thay vì tên thật

**Solution:** Check variable names match exactly:
- Backend: `{ username: 'John', verifyUrl: '...', expiresIn: '15 minutes' }`
- Template: `{{username}}`, `{{verifyUrl}}`, `{{expiresIn}}`

### 5. Email Đi Vào Spam
**Symptom:** Email được gửi nhưng không thấy trong inbox

**Solution:**
- Check spam folder
- Add sender to contacts
- Verify SPF/DKIM records (production only)

---

## 📝 Quick Checklist

- [ ] Backend logs show "Starting email verification process"
- [ ] Session created successfully
- [ ] Token generated with expiration
- [ ] Verification URL created
- [ ] Mailer service called with correct params
- [ ] Email template exists in database
- [ ] Gmail credentials correct in .env
- [ ] App Password used (if 2FA enabled)
- [ ] Email not in spam folder
- [ ] Check recipient email is correct

---

## 🧪 Manual Test

### Test 1: Database Connection
```sql
SELECT COUNT(*) FROM email_template WHERE name = 'email_verification';
-- Expected: 1
```

### Test 2: Backend Registration
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "YOUR_EMAIL@gmail.com",
    "password": "Test123456!"
  }'
```

Watch backend console for logs.

### Test 3: Check Session Created
```sql
SELECT * FROM session 
WHERE type = 'EMAIL_VERIFICATION' 
ORDER BY created_at DESC 
LIMIT 1;
```

### Test 4: Gmail App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Create new app password for "Mail"
3. Copy password (format: xxxx xxxx xxxx xxxx)
4. Update .env: `MAIL_PASS=xxxx xxxx xxxx xxxx`
5. Restart backend

---

## 🔧 Next Steps

1. **Đăng ký account mới** với email thật
2. **Xem backend console** - tìm các logs bắt đầu bằng 📧, ✅, ❌
3. **Nếu thấy ✅ Email sent successfully:**
   - Check inbox
   - Check spam folder
   - Wait 1-2 minutes
4. **Nếu thấy ❌ Error:**
   - Copy full error message
   - Check error type (Gmail auth, template not found, etc.)
   - Apply solution từ guide này

---

**Created:** December 17, 2025  
**Status:** Ready for debugging
