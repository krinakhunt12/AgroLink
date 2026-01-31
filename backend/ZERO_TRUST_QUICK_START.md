# Zero-Trust Security - Quick Start Guide

## 🚀 5-Minute Integration

This guide shows you how to quickly integrate the Zero-Trust security architecture into your existing AgroLink routes.

---

## Step 1: Import the Middleware

```javascript
// At the top of your route file
import { 
    zeroTrustAuth, 
    contextualAccessControl, 
    requestIntegrityCheck 
} from '../middleware/zeroTrust.js';
```

---

## Step 2: Apply to Routes

### Basic Protection (Read-Only Endpoints)

```javascript
// GET endpoints - Authentication only
router.get('/api/products', 
    zeroTrustAuth,  // Layers 1-9
    getProducts
);

router.get('/api/profile', 
    zeroTrustAuth,
    getProfile
);
```

### Standard Protection (Write Endpoints)

```javascript
// POST/PUT endpoints - Authentication + Request Integrity
router.post('/api/products', 
    zeroTrustAuth,              // Layers 1-9
    requestIntegrityCheck,       // Layer 11 (injection detection)
    createProduct
);

router.put('/api/products/:id', 
    zeroTrustAuth,
    requestIntegrityCheck,
    updateProduct
);
```

### Role-Based Protection

```javascript
// Farmer-only endpoints
router.post('/api/farmer/products', 
    zeroTrustAuth,
    contextualAccessControl(['farmer']),  // Layer 10 (RBAC)
    requestIntegrityCheck,
    createProduct
);

// Buyer-only endpoints
router.post('/api/buyer/orders', 
    zeroTrustAuth,
    contextualAccessControl(['buyer']),
    requestIntegrityCheck,
    createOrder
);

// Multi-role endpoints
router.get('/api/marketplace/products', 
    zeroTrustAuth,
    contextualAccessControl(['farmer', 'buyer']),
    getMarketplaceProducts
);
```

### Maximum Protection (Admin/Critical Endpoints)

```javascript
// Admin-only with full protection
router.delete('/api/admin/users/:id', 
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    requestIntegrityCheck,
    deleteUser
);

router.post('/api/admin/security/revoke-session', 
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    requestIntegrityCheck,
    revokeUserSession
);
```

---

## Step 3: Update Your Main App File

```javascript
// backend/src/app.js or server.js

import express from 'express';
import securityRoutes from './routes/security.routes.js';

const app = express();

// ... existing middleware (cors, body-parser, etc.)

// Add security routes
app.use('/api', securityRoutes);

// ... rest of your routes
```

---

## Step 4: Environment Variables

Add to your `.env` file:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d

# ML Service Security (if using ML features)
ML_SERVICE_API_KEY=agrolink_secure_ml_key_2026
ML_SERVICE_SECRET=super_secret_ml_protection_code
ML_SERVICE_URL=http://localhost:8000
```

---

## Step 5: Frontend Integration

### Update API Request Interceptor

```typescript
// src/services/api.ts

import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Response interceptor for security headers
api.interceptors.response.use(
    (response) => {
        // Check for token refresh warning
        if (response.headers['x-token-refresh-required']) {
            console.log('Token refresh required');
            // Trigger token refresh
            refreshAuthToken();
        }
        return response;
    },
    (error) => {
        const { status, data } = error.response || {};
        
        // Handle security-related errors
        switch(status) {
            case 401:
                // Unauthorized - redirect to login
                if (data?.code === 'TOKEN_EXPIRED') {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                break;
                
            case 403:
                // Forbidden - show access denied
                if (data?.code === 'INSUFFICIENT_PERMISSIONS') {
                    toast.error('Access Denied: You do not have permission');
                } else if (data?.code === 'SUSPICIOUS_IP') {
                    toast.error('Access temporarily restricted. Contact support.');
                }
                break;
                
            case 429:
                // Rate limit exceeded
                toast.error('Too many requests. Please slow down.');
                break;
                
            case 400:
                // Bad request - possible injection attempt
                if (data?.code === 'MALICIOUS_INPUT') {
                    toast.error('Invalid input detected');
                }
                break;
        }
        
        return Promise.reject(error);
    }
);

export default api;
```

---

## Step 6: Test Your Implementation

### Test 1: Valid Request

```bash
# Login to get token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"1234567890","password":"password"}' \
  | jq -r '.token')

# Make authenticated request
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer $TOKEN"

# Expected: 200 OK with user profile
```

### Test 2: Missing Token

```bash
curl -X GET http://localhost:5000/api/profile

# Expected: 401 Unauthorized
# {
#   "success": false,
#   "message": "Authentication token not provided",
#   "code": "MISSING_TOKEN"
# }
```

### Test 3: Role Restriction

```bash
# Login as buyer
BUYER_TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"buyer-phone","password":"password"}' \
  | jq -r '.token')

# Try to access farmer-only endpoint
curl -X POST http://localhost:5000/api/farmer/products \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Tomato","price":50}'

# Expected: 403 Forbidden
# {
#   "success": false,
#   "message": "Access denied. Required role: farmer",
#   "code": "INSUFFICIENT_PERMISSIONS"
# }
```

### Test 4: Rate Limiting

```bash
# Send 70 requests rapidly (exceeds 60/min limit)
for i in {1..70}; do
  curl -X GET http://localhost:5000/api/profile \
    -H "Authorization: Bearer $TOKEN"
done

# First 60: 200 OK
# Remaining 10: 429 Too Many Requests
```

---

## Step 7: Monitor Security Events

### View Logs

```bash
# Your server logs will show security events
[SECURITY-AUDIT] AUTH_SUCCESS: {"userId":"123","ip":"192.168.1.1","path":"/api/profile"}
[SECURITY-AUDIT] SECURITY_FAILURE: {"code":"INVALID_TOKEN","ip":"192.168.1.100"}
[SECURITY-AUDIT] FINGERPRINT_MISMATCH: {"userId":"123","expected":"abc...","received":"def..."}
```

### Admin Security Dashboard

```bash
# Get security metrics (admin only)
curl -X GET http://localhost:5000/api/admin/security/metrics \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Response:
# {
#   "success": true,
#   "data": {
#     "activeSessions": 150,
#     "suspiciousIPs": ["192.168.1.100"],
#     "totalIPsTracked": 1250,
#     "timestamp": "2026-01-31T23:25:42.000Z"
#   }
# }
```

---

## Common Patterns

### Pattern 1: Public Endpoint (No Auth)

```javascript
// Health check, public info
router.get('/api/health', (req, res) => {
    res.json({ status: 'healthy' });
});
```

### Pattern 2: Authenticated Endpoint

```javascript
// User profile, dashboard
router.get('/api/dashboard', 
    zeroTrustAuth,
    getDashboard
);
```

### Pattern 3: Authenticated + Integrity

```javascript
// Create, update, delete operations
router.post('/api/products', 
    zeroTrustAuth,
    requestIntegrityCheck,
    createProduct
);
```

### Pattern 4: Role-Based

```javascript
// Role-specific operations
router.post('/api/farmer/products', 
    zeroTrustAuth,
    contextualAccessControl(['farmer']),
    requestIntegrityCheck,
    createProduct
);
```

### Pattern 5: Admin Only

```javascript
// Critical admin operations
router.delete('/api/admin/users/:id', 
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    requestIntegrityCheck,
    deleteUser
);
```

---

## Troubleshooting

### Issue 1: "Token not provided" error

**Cause**: Frontend not sending Authorization header

**Fix**:
```typescript
// Ensure axios includes token
axios.get('/api/profile', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
```

### Issue 2: "Token expired" error

**Cause**: JWT token has expired

**Fix**: Implement token refresh
```typescript
const refreshAuthToken = async () => {
    const response = await axios.post('/api/auth/refresh-token', {}, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    localStorage.setItem('token', response.data.token);
};
```

### Issue 3: "Rate limit exceeded" error

**Cause**: Too many requests in short time

**Fix**: Implement request throttling on frontend
```typescript
import { debounce } from 'lodash';

const debouncedSearch = debounce((query) => {
    api.get(`/api/products?search=${query}`);
}, 500);
```

### Issue 4: "Insufficient permissions" error

**Cause**: User trying to access endpoint for different role

**Fix**: Check user role before making request
```typescript
const user = JSON.parse(localStorage.getItem('user'));
if (user.userType === 'farmer') {
    // Allow farmer actions
} else {
    toast.error('This action is only available to farmers');
}
```

---

## Performance Optimization

### 1. Use Redis for Session Store

```javascript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Replace Map with Redis
// sessionStore.set(key, value) → redis.set(key, value)
// sessionStore.get(key) → redis.get(key)
```

### 2. Cache User Data

```javascript
// Cache user lookup to reduce DB queries
const userCache = new Map();

const getUserFromCache = async (userId) => {
    if (userCache.has(userId)) {
        return userCache.get(userId);
    }
    const user = await User.findById(userId);
    userCache.set(userId, user);
    return user;
};
```

### 3. Batch Audit Logs

```javascript
// Instead of logging each event immediately
const logBuffer = [];

const batchLog = (entry) => {
    logBuffer.push(entry);
    if (logBuffer.length >= 100) {
        flushLogs();
    }
};

const flushLogs = () => {
    // Send batch to logging service
    logger.info('Batch security events', logBuffer);
    logBuffer.length = 0;
};
```

---

## Next Steps

1. ✅ **Integrate Zero-Trust middleware into all routes**
2. ✅ **Update frontend error handling**
3. ✅ **Test all security scenarios**
4. ✅ **Monitor security logs**
5. ⏭️ **Set up Redis for production**
6. ⏭️ **Integrate centralized logging (ELK/CloudWatch)**
7. ⏭️ **Add 2FA for admin accounts**
8. ⏭️ **Set up security monitoring alerts**

---

## Quick Reference

### Middleware Stack

```
zeroTrustAuth              → Layers 1-9 (Authentication, IP, Rate Limit, etc.)
contextualAccessControl    → Layer 10 (RBAC)
requestIntegrityCheck      → Layer 11 (Injection Detection)
```

### Error Codes

```
MISSING_TOKEN              → 401 - No token provided
INVALID_TOKEN              → 401 - Invalid signature
TOKEN_EXPIRED              → 401 - Token expired
TOKEN_REVOKED              → 401 - Session terminated
USER_NOT_FOUND             → 401 - Account deleted
ACCOUNT_SUSPENDED          → 403 - Account banned
SUSPICIOUS_IP              → 403 - IP flagged
INSUFFICIENT_PERMISSIONS   → 403 - Wrong role
RATE_LIMIT_EXCEEDED        → 429 - Too many requests
MALICIOUS_INPUT            → 400 - Injection detected
```

---

**Created**: January 31, 2026  
**Last Updated**: January 31, 2026  
**Version**: 1.0  
**Estimated Integration Time**: 5-10 minutes per route file
