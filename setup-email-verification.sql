-- ============================================
-- EMAIL VERIFICATION SETUP SCRIPT
-- Mat Nice Store - Email Verification System
-- ============================================

USE mat_nice_ecommerce;

-- Step 1: Add is_verified column to user table
-- ============================================
ALTER TABLE user 
ADD COLUMN is_verified TINYINT(1) DEFAULT 0 
COMMENT 'Email verification status: 0 = not verified, 1 = verified'
AFTER email;

-- Step 2: Insert email verification template
-- ============================================
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

-- Step 3: Verify installation
-- ============================================
SELECT '✅ Column added successfully!' as Status;
DESCRIBE user;

SELECT '✅ Email template inserted successfully!' as Status;
SELECT id, name, subject, description 
FROM email_template 
WHERE name = 'email_verification';

-- ============================================
-- DONE! Now restart your backend:
-- cd /home/dawy/KLTN/matnice-ecommerce-backend
-- npm run start:dev
-- ============================================
