# Email Verification Setup Guide

## ✅ Completed Steps

### 1. Backend Code Changes
- ✅ Added `isVerified` column to `UserEntity`
- ✅ Updated `UserModel` with `isVerified` field
- ✅ Added `SessionType.EMAIL_VERIFICATION` to enum
- ✅ Updated `AuthService.register()` to send verification email
- ✅ Added `AuthService.sendVerificationEmail()` method
- ✅ Added `AuthService.verifyEmail()` method
- ✅ Added `UserService.verifyUserEmail()` method
- ✅ Updated `AuthController.register()` endpoint to pass userAgent and ipAddress
- ✅ Added `AuthController.verifyEmail()` endpoint
- ✅ Added `EMAIL_VERIFICATION_URL` to `.env` file
- ✅ Created email verification template SQL file

## 🔄 Pending Steps

### 2. Database Setup

#### Step 1: Add `is_verified` column to user table
```sql
ALTER TABLE user 
ADD COLUMN is_verified TINYINT(1) DEFAULT 0 AFTER email;
```

#### Step 2: Insert email verification template
```bash
cd /home/dawy/KLTN/matnice-ecommerce-backend
mysql -u root -p mat_nice_ecommerce < mailer/sql/email-verification-template.sql
```

Or run the SQL directly in your database:
```sql
INSERT INTO email_template (name, html, subject, description, created_at, updated_at)
VALUES (
  'EMAIL_VERIFICATION',
  '<!-- Full HTML content from email-verification-template.sql -->',
  'Verify Your Email Address - Mat Nice Store',
  'Email template for user email verification',
  NOW(),
  NOW()
);
```

### 3. Backend Restart
```bash
cd /home/dawy/KLTN/matnice-ecommerce-backend
npm run start:dev
```

### 4. Frontend Implementation

#### Create Verification Page Component
Create file: `/home/dawy/KLTN/matnice-ecommerce-frontend/src/pages/VerifyEmailPage.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/verify-email', {
        token,
      });

      if (response.data.success) {
        setStatus('success');
        setMessage('Email verified successfully! You can now login to your account.');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage('Verification failed. Please try again.');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Invalid or expired verification token');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-800">Verifying your email...</h2>
            <p className="mt-2 text-gray-600">Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Email Verified!</h2>
            <p className="mt-2 text-gray-600">{message}</p>
            <p className="mt-4 text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Verification Failed</h2>
            <p className="mt-2 text-gray-600">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
```

#### Add Route to App.tsx
Add this route to your React Router configuration:

```tsx
import VerifyEmailPage from './pages/VerifyEmailPage';

// In your routes:
<Route path="/verify-email" element={<VerifyEmailPage />} />
```

### 5. Update Registration Success Message
Update your registration component to inform users to check their email:

```tsx
// After successful registration
<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
  <p className="font-bold">Registration Successful!</p>
  <p>Please check your email to verify your account.</p>
  <p className="text-sm mt-1">The verification link will expire in 15 minutes.</p>
</div>
```

## 📋 Testing Checklist

### Backend Testing
1. ✅ No compilation errors
2. ⏳ Backend running successfully
3. ⏳ Database column added
4. ⏳ Email template inserted

### Registration Flow Testing
1. ⏳ Register a new user
2. ⏳ Check email received with verification link
3. ⏳ Click verification button in email
4. ⏳ Verify redirect to verification page
5. ⏳ Check user.is_verified = 1 in database
6. ⏳ Try to login with verified account

### Error Handling Testing
1. ⏳ Test with expired token
2. ⏳ Test with invalid token
3. ⏳ Test verifying already verified email
4. ⏳ Test registration without email
5. ⏳ Test with invalid email format

## 🔧 Configuration

### Environment Variables
```env
# Backend (.env)
EMAIL_VERIFICATION_URL=http://localhost:3002/verify-email
JWT_VERIFICATION_TOKEN_SECRET_KEY=111111qkkqkkkqk
JWT_VERIFICATION_TOKEN_EXPIRES_IN=15m
```

### Email Template Variables
- `{{username}}`: User's display name
- `{{verifyUrl}}`: Full verification URL with token
- `{{expiresIn}}`: Human-readable expiration time (e.g., "15 minutes")

## 📝 How It Works

1. **User Registers**
   - User submits registration form
   - Backend creates user with `isVerified: false`
   - Backend creates verification session
   - Backend generates JWT token with 15-minute expiration
   - Backend sends email with verification link

2. **User Receives Email**
   - Email contains styled verification button
   - Button links to: `http://localhost:3002/verify-email?token=JWT_TOKEN`

3. **User Clicks Verification Link**
   - Frontend VerifyEmailPage loads
   - Extracts token from URL query parameter
   - Sends POST request to `/api/v1/auth/verify-email`

4. **Backend Verifies**
   - Validates JWT token signature and expiration
   - Checks if user already verified
   - Updates `user.is_verified = true`
   - Invalidates verification session
   - Returns success response

5. **Frontend Confirms**
   - Shows success message
   - Redirects to login page after 3 seconds

## 🚨 Important Notes

- Verification tokens expire after 15 minutes
- Each token can only be used once
- Users with `isVerified: false` can still login (optional: add login check)
- Email template uses Gmail SMTP (cfdkcom3@gmail.com)
- Verification links use `http://localhost:3002` (change for production)

## 🔒 Security Features

- JWT token with expiration
- One-time use tokens (session invalidation)
- Secure token storage in session
- Token signature verification
- IP and user agent tracking

## 🌐 Production Deployment

Before deploying to production:
1. Update `EMAIL_VERIFICATION_URL` in `.env` to production URL
2. Update frontend API endpoint from localhost to production
3. Use HTTPS for all URLs
4. Configure proper SMTP settings
5. Add rate limiting to verification endpoint
6. Add email resend functionality (optional)

## 📧 Email Template Customization

The email template is stored in: `mailer/sql/email-verification-template.sql`

To customize:
1. Edit the HTML in the SQL file
2. Update the template in database
3. Variables available: `{{username}}`, `{{verifyUrl}}`, `{{expiresIn}}`

## ❓ Troubleshooting

### Email not received
- Check spam/junk folder
- Verify SMTP credentials in `.env`
- Check backend logs for email sending errors

### Token expired
- User must register again or request new verification email
- Consider adding resend functionality

### Database errors
- Ensure `is_verified` column exists
- Check email_template table has EMAIL_VERIFICATION row

### Frontend errors
- Check CORS settings on backend
- Verify API endpoint URL is correct
- Check browser console for errors
