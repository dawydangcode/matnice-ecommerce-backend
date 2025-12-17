#!/bin/bash

# Quick Setup Script for Email Verification
# Run this script to setup database for email verification

echo "=========================================="
echo "Email Verification Setup Script"
echo "=========================================="
echo ""

# Database credentials
DB_USER="root"
DB_PASS="sapassword"
DB_NAME="mat_nice_ecommerce"

echo "Step 1: Adding is_verified column to user table..."
mysql -u $DB_USER -p$DB_PASS $DB_NAME << EOF
-- Add is_verified column if not exists
ALTER TABLE user 
ADD COLUMN IF NOT EXISTS is_verified TINYINT(1) DEFAULT 0 
COMMENT 'Email verification status: 0 = not verified, 1 = verified'
AFTER email;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Column added successfully (or already exists)"
else
    echo "❌ Failed to add column"
    exit 1
fi

echo ""
echo "Step 2: Checking if email template exists..."
TEMPLATE_EXISTS=$(mysql -u $DB_USER -p$DB_PASS $DB_NAME -N -e "SELECT COUNT(*) FROM email_template WHERE name = 'email_verification';")

if [ "$TEMPLATE_EXISTS" -gt 0 ]; then
    echo "⚠️  Email template already exists. Updating..."
    mysql -u $DB_USER -p$DB_PASS $DB_NAME << EOF
    DELETE FROM email_template WHERE name = 'email_verification';
EOF
fi

echo "Step 3: Inserting email verification template..."
mysql -u $DB_USER -p$DB_PASS $DB_NAME << 'EOF'
INSERT INTO email_template (name, html, subject, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by)
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
EOF

if [ $? -eq 0 ]; then
    echo "✅ Email template inserted successfully"
else
    echo "❌ Failed to insert email template"
    exit 1
fi

echo ""
echo "Step 4: Verifying installation..."
mysql -u $DB_USER -p$DB_PASS $DB_NAME << EOF
SELECT '=== User Table Structure ===' as Info;
DESCRIBE user;

SELECT '=== Email Template ===' as Info;
SELECT id, name, subject FROM email_template WHERE name = 'email_verification';
EOF

echo ""
echo "=========================================="
echo "✅ Setup completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Restart backend: npm run start:dev"
echo "2. Test registration with a valid email"
echo "3. Check email inbox for verification link"
echo ""
