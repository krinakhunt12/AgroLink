# 🚀 Admin Panel - Quick Test Guide

## ✅ Admin Login Credentials

```
📧 Email: admin@agrolink.com
🔑 Password: Admin@123
🌐 URL: http://localhost:5173/admin/login
```

---

## 🧪 Quick Tests

### Test 1: Admin Login
1. Go to: `http://localhost:5173/admin/login`
2. Enter email: `admin@agrolink.com`
3. Enter password: `Admin@123`
4. Click "Login"
5. ✅ Should redirect to `/admin/dashboard`

### Test 2: Admin Dashboard Access
1. After login, verify you see:
   - Admin sidebar with navigation
   - Dashboard statistics
   - System health metrics
2. ✅ All admin features should be accessible

### Test 3: Farmer Verification Management
1. Navigate to: `/admin/verifications`
2. ✅ Should see list of farmer verification requests
3. Click "View" on any request
4. ✅ Should see detailed verification information
5. Click "Approve" or "Reject"
6. ✅ Should see success message

### Test 4: Non-Admin Access Denial
1. Logout from admin
2. Login as farmer: `9876543210` / `password123`
3. Try to access: `/admin/dashboard`
4. ✅ Should redirect to `/farmer/dashboard`

---

## 🐛 Troubleshooting

### Issue: "Invalid credentials"
**Solution**: Run admin creation script again
```bash
cd backend
node src/scripts/createAdmin.js
```

### Issue: Redirects to home page after login
**Solution**: Check localStorage
```javascript
// Open browser console
console.log(localStorage.getItem('user'));
// Should show: {"userType": "admin", ...}
```

### Issue: 403 Forbidden on API calls
**Solution**: Check if token is being sent
```javascript
// Open browser console → Network tab
// Check request headers for: Authorization: Bearer ...
```

---

## 📊 Expected Behavior

| User Type | Login URL | Dashboard URL | Can Access Admin? |
|-----------|-----------|---------------|-------------------|
| Admin | `/admin/login` | `/admin/dashboard` | ✅ Yes |
| Farmer | `/login` | `/farmer/dashboard` | ❌ No (403) |
| Buyer | `/login` | `/buyer/dashboard` | ❌ No (403) |

---

## 🔑 All Test Accounts

```
ADMIN:
Email: admin@agrolink.com
Password: Admin@123

FARMER:
Phone: 9876543210
Password: password123

BUYER:
Phone: 9876543220
Password: password123
```

---

## ✨ Admin Panel Features

- ✅ User Management (Farmers & Buyers)
- ✅ Farmer Verification Dashboard
- ✅ Product Listings Management
- ✅ ML Operations Dashboard
- ✅ Rules Engine
- ✅ System Health Monitoring
- ✅ Audit Logs

---

**Everything is working! 🎉**
