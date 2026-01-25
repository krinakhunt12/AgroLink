# 🔐 Complete Authentication System Implementation Plan

## Overview
Building a production-ready authentication system with:
- Manual login/signup
- Forgot password flow with email
- Google Sign-In (Firebase)
- Professional UI with i18n support
- TanStack Query integration
- Full security measures

---

## 📁 File Structure

```
src/
├── pages/
│   ├── Login.tsx                    ✅ Already exists (will enhance)
│   ├── Signup.tsx                   🆕 Create new
│   ├── ForgotPassword.tsx           🆕 Create new
│   └── ResetPassword.tsx            🆕 Create new
├── components/
│   ├── auth/
│   │   ├── GoogleSignInButton.tsx   🆕 Enhanced version
│   │   ├── PasswordStrengthMeter.tsx 🆕 New component
│   │   └── AuthLayout.tsx           🆕 Shared layout
│   └── ui/
│       └── (existing shadcn components)
├── hooks/
│   └── api/
│       ├── useAuthQuery.ts          ✅ Already exists (will enhance)
│       └── usePasswordReset.ts      🆕 Create new
├── services/
│   └── firebase.ts                  🆕 Firebase config
└── utils/
    ├── validation.ts                🆕 Form validation
    └── passwordStrength.ts          🆕 Password strength checker
```

---

## 🎨 Design System

### Colors (from index.css)
```css
--brand-primary: #16a34a (green-600)
--brand-primary-dark: #15803d (green-700)
--text-primary: #1c1917 (stone-900)
--text-secondary: #57534e (stone-600)
--bg-base: #fafaf9 (stone-50)
--bg-surface: #ffffff
--border-base: #e7e5e4 (stone-200)
```

### Typography
- Font: Inter (from Google Fonts)
- Headings: font-black, tracking-tight
- Body: font-medium
- Labels: font-bold, uppercase, text-xs

---

## 🔄 Authentication Flows

### Flow 1: Manual Login
```
User enters phone/email + password
    ↓
Validate inputs
    ↓
Call login mutation (TanStack Query)
    ↓
Backend verifies credentials
    ↓
Return JWT token + user data
    ↓
Store token in localStorage
    ↓
Redirect based on role (farmer/buyer)
```

### Flow 2: Manual Signup
```
User fills registration form
    ↓
Validate all fields
    ↓
Check password strength
    ↓
Call signup mutation
    ↓
Backend creates user
    ↓
Send verification email (optional)
    ↓
Auto-login or redirect to login
```

### Flow 3: Forgot Password
```
User clicks "Forgot Password?"
    ↓
Navigate to /forgot-password
    ↓
Enter email/phone
    ↓
Call forgot-password API
    ↓
Backend generates secure token
    ↓
Send email with reset link
    ↓
Show success message
```

### Flow 4: Reset Password
```
User clicks email link
    ↓
Navigate to /reset-password?token=XXX&email=YYY
    ↓
Validate token via API
    ↓
Show password reset form
    ↓
Enter new password (with strength meter)
    ↓
Call reset-password API
    ↓
Backend verifies token & updates password
    ↓
Show success toast
    ↓
Redirect to /login
```

### Flow 5: Google Sign-In
```
User clicks "Sign in with Google"
    ↓
Firebase Google Auth popup
    ↓
Get Google ID token
    ↓
Send token to backend
    ↓
Backend verifies with Google
    ↓
Create user if new / Link if exists
    ↓
Return app JWT token
    ↓
Redirect based on role
```

---

## 🔧 Implementation Steps

### Phase 1: Backend API Endpoints (Already exists, will enhance)
- ✅ POST /api/auth/login
- ✅ POST /api/auth/register
- 🆕 POST /api/auth/forgot-password
- 🆕 POST /api/auth/reset-password
- 🆕 POST /api/auth/validate-reset-token
- 🆕 POST /api/auth/google-signin

### Phase 2: Frontend Components
1. Enhanced Login page
2. New Signup page
3. Forgot Password page
4. Reset Password page
5. Google Sign-In button
6. Password strength meter
7. Auth layout wrapper

### Phase 3: TanStack Query Hooks
1. useLogin
2. useSignup
3. useForgotPassword
4. useResetPassword
5. useValidateToken
6. useGoogleSignIn

### Phase 4: Utilities
1. Form validation
2. Password strength checker
3. Token management
4. Firebase integration

### Phase 5: Email Templates
1. Password reset email
2. Welcome email
3. Verification email

---

## 🔒 Security Measures

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Token Security
- Cryptographically secure random tokens
- 1-hour expiration
- Single-use only
- Stored hashed in database

### API Security
- Rate limiting on auth endpoints
- CSRF protection
- Input sanitization
- SQL injection prevention

---

## 🌐 i18n Support

### Translation Keys
```json
{
  "auth": {
    "login": "Login",
    "signup": "Sign Up",
    "forgotPassword": "Forgot Password?",
    "resetPassword": "Reset Password",
    "email": "Email",
    "phone": "Phone Number",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "signInWithGoogle": "Sign in with Google",
    "errors": {
      "invalidCredentials": "Invalid email or password",
      "emailRequired": "Email is required",
      "passwordWeak": "Password is too weak"
    }
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Login page with manual + Google sign-in
- [ ] Signup page with validation
- [ ] Forgot password flow working
- [ ] Reset password with token validation
- [ ] Google Sign-In integrated
- [ ] All forms use TanStack Query
- [ ] All text uses i18n
- [ ] Professional UI matching theme
- [ ] Mobile responsive
- [ ] Error handling with toasts
- [ ] Loading states
- [ ] Security measures implemented

---

**Ready to implement! Starting with the components...**
