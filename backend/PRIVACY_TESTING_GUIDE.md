# 🧪 Data Privacy & Compliance - Testing Guide

## 📋 Overview

This guide provides comprehensive test scenarios for validating the Data Privacy & Compliance Layer implementation. All tests ensure GDPR-like compliance and ethical data handling.

---

## 🔧 Prerequisites

### Environment Setup

```bash
# Set encryption key
export ENCRYPTION_KEY="your-super-secret-encryption-key-min-32-chars-long"

# Start backend server
cd backend
npm run dev

# In another terminal, prepare test data
# Login to get authentication token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","password":"password"}' \
  | jq -r '.token')

echo "Token: $TOKEN"
```

---

## 📊 Test Categories

### 1. Encryption & Decryption Tests
### 2. Data Masking Tests
### 3. Purpose-Based Access Control Tests
### 4. Data Export Tests (Right to Access)
### 5. Account Deletion Tests (Right to be Forgotten)
### 6. Consent Management Tests
### 7. Data Minimization Tests
### 8. Audit Logging Tests

---

## 1️⃣ Encryption & Decryption Tests

### Test 1.1: Encrypt Sensitive Data

```javascript
// File: test-encryption.js
import { encrypt, decrypt } from './src/utils/encryption.js';

const testData = {
    phone: "+919876543210",
    email: "farmer@example.com",
    bankAccount: "1234567890123456"
};

console.log('Original Data:', testData);

// Encrypt
const encrypted = {
    phone: encrypt(testData.phone),
    email: encrypt(testData.email),
    bankAccount: encrypt(testData.bankAccount)
};

console.log('Encrypted Data:', encrypted);

// Decrypt
const decrypted = {
    phone: decrypt(encrypted.phone),
    email: decrypt(encrypted.email),
    bankAccount: decrypt(encrypted.bankAccount)
};

console.log('Decrypted Data:', decrypted);

// Verify
console.log('Phone Match:', testData.phone === decrypted.phone);
console.log('Email Match:', testData.email === decrypted.email);
console.log('Bank Account Match:', testData.bankAccount === decrypted.bankAccount);
```

**Expected Output**:
```
Original Data: { phone: '+919876543210', email: 'farmer@example.com', ... }
Encrypted Data: { phone: 'a3f5b2c8...', email: 'b6c3d2e1...', ... }
Decrypted Data: { phone: '+919876543210', email: 'farmer@example.com', ... }
Phone Match: true
Email Match: true
Bank Account Match: true
```

**Run Test**:
```bash
node test-encryption.js
```

---

### Test 1.2: Encryption Key Validation

```bash
# Test with missing encryption key
unset ENCRYPTION_KEY
curl -X GET http://localhost:5000/api/privacy/compliance-status

# Expected: Error about missing encryption key

# Test with weak encryption key (< 32 chars)
export ENCRYPTION_KEY="short_key"
curl -X GET http://localhost:5000/api/privacy/compliance-status

# Expected: Warning about weak encryption key

# Test with strong encryption key
export ENCRYPTION_KEY="this-is-a-very-strong-encryption-key-with-more-than-32-characters"
curl -X GET http://localhost:5000/api/privacy/compliance-status

# Expected: "encryptionEnabled": true
```

---

## 2️⃣ Data Masking Tests

### Test 2.1: Mask Different Data Types

```javascript
// File: test-masking.js
import { mask } from './src/utils/encryption.js';

const testCases = [
    { data: "+919876543210", type: "phone", expected: "+91-XXXX-XX-3210" },
    { data: "user@example.com", type: "email", expected: "u***@example.com" },
    { data: "1234567890123456", type: "card", expected: "XXXX-XXXX-XXXX-3456" },
    { data: "12345678901234", type: "account", expected: "XXXXXXXXXX1234" },
    { data: "123456789012", type: "aadhaar", expected: "XXXX-XXXX-9012" },
    { data: "50000", type: "price", expected: "₹XX,XXX" }
];

testCases.forEach(test => {
    const masked = mask(test.data, test.type);
    const passed = masked === test.expected;
    console.log(`${test.type}: ${passed ? '✓' : '✗'} ${masked}`);
});
```

**Expected Output**:
```
phone: ✓ +91-XXXX-XX-3210
email: ✓ u***@example.com
card: ✓ XXXX-XXXX-XXXX-3456
account: ✓ XXXXXXXXXX1234
aadhaar: ✓ XXXX-XXXX-9012
price: ✓ ₹XX,XXX
```

---

## 3️⃣ Purpose-Based Access Control Tests

### Test 3.1: Profile View (Limited Access)

```bash
# View own profile (should get full access with masking)
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer $TOKEN"

# Expected: Full profile with highly sensitive fields masked
# {
#   "name": "Ramesh Patel",
#   "phone": "+91-XXXX-XX-3210",  // Masked
#   "email": "r***@example.com",   // Masked
#   "userType": "farmer",
#   "location": "Gujarat"
# }
```

### Test 3.2: Analytics Access (Anonymized Only)

```bash
# Analytics endpoint should return anonymized data
curl -X GET http://localhost:5000/api/analytics/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Expected: Anonymized data
# {
#   "userId": "user123",
#   "userType": "farmer",
#   "location": "Gujarat",
#   "anonymousPhone": "a3f5b2c8d1e9f4a7",  // Hash-based ID
#   "anonymousName": "User_d3e2f1a8"
# }
```

### Test 3.3: Transaction Access (Necessary Fields Only)

```bash
# Transaction endpoint should expose only necessary fields
curl -X GET http://localhost:5000/api/orders/123 \
  -H "Authorization: Bearer $TOKEN"

# Expected: Only transaction-relevant fields
# {
#   "orderId": "ORD-123",
#   "product": "Tomatoes",
#   "quantity": 100,
#   "totalPrice": 5000,
#   "buyerName": "Ramesh Patel",
#   "buyerPhone": "+91-XXXX-XX-3210",  // Masked
#   "deliveryAddress": "Gujarat"        // Partial
# }
```

---

## 4️⃣ Data Export Tests (Right to Access)

### Test 4.1: Export User Data (JSON)

```bash
# Export all user data
curl -X GET http://localhost:5000/api/privacy/export-data \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

# Expected: Complete data export with all categories
# {
#   "exportDate": "2026-01-31T23:39:28.000Z",
#   "userId": "user123",
#   "dataCategories": {
#     "profile": {...},
#     "products": [...],
#     "orders": [...],
#     "bids": [...]
#   },
#   "dataProcessingPurposes": [...],
#   "dataRetentionPolicy": {...}
# }
```

### Test 4.2: Download Data (JSON File)

```bash
# Download as JSON file
curl -X GET http://localhost:5000/api/privacy/download-data/json \
  -H "Authorization: Bearer $TOKEN" \
  -o my-agrolink-data.json

# Verify file
cat my-agrolink-data.json | jq '.exportDate'
```

### Test 4.3: Download Data (CSV File)

```bash
# Download as CSV file
curl -X GET http://localhost:5000/api/privacy/download-data/csv \
  -H "Authorization: Bearer $TOKEN" \
  -o my-agrolink-data.csv

# Verify file
head my-agrolink-data.csv
```

---

## 5️⃣ Account Deletion Tests (Right to be Forgotten)

### Test 5.1: Check Deletion Eligibility

```bash
# Check if account can be deleted
curl -X GET http://localhost:5000/api/privacy/deletion-eligibility \
  -H "Authorization: Bearer $TOKEN"

# Expected (if eligible):
# {
#   "success": true,
#   "canDelete": true,
#   "issues": []
# }

# Expected (if not eligible):
# {
#   "success": true,
#   "canDelete": false,
#   "issues": [
#     {
#       "type": "active_orders",
#       "message": "You have 2 active orders. Please complete or cancel them first."
#     }
#   ]
# }
```

### Test 5.2: Request Account Deletion

```bash
# Request deletion
curl -X POST http://localhost:5000/api/privacy/request-deletion \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"No longer needed"}'

# Expected:
# {
#   "success": true,
#   "message": "Deletion request created. Please check your email for confirmation.",
#   "deletionToken": "abc123def456...",
#   "scheduledDate": "2026-03-02T23:39:28.000Z"  // 30 days from now
# }

# Save the deletion token
DELETION_TOKEN="abc123def456..."
```

### Test 5.3: Confirm Account Deletion

```bash
# Confirm deletion with token
curl -X POST http://localhost:5000/api/privacy/confirm-deletion \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"deletionToken\":\"$DELETION_TOKEN\"}"

# Expected:
# {
#   "success": true,
#   "message": "Your account and personal data have been permanently deleted",
#   "report": {
#     "userId": "user123",
#     "steps": [
#       {"step": "User data fetched", "timestamp": "..."},
#       {"step": "Processed 5 products", "timestamp": "..."},
#       {"step": "Anonymized 10 orders", "timestamp": "..."},
#       {"step": "Processed 3 bids", "timestamp": "..."},
#       {"step": "Created anonymized user record", "timestamp": "..."},
#       {"step": "User account deleted", "timestamp": "..."}
#     ],
#     "status": "completed"
#   }
# }
```

### Test 5.4: Verify Deletion

```bash
# Try to login with deleted account
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","password":"password"}'

# Expected: 401 Unauthorized - User not found

# Check if orders are anonymized
curl -X GET http://localhost:5000/api/orders/123 \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Expected: Order exists but user data is anonymized
# {
#   "orderId": "ORD-123",
#   "buyerName": "Deleted User",
#   "buyerPhone": null,
#   "buyerEmail": null,
#   "isAnonymized": true,
#   "blockchainHash": "a3f5b2c8..."  // Still present (immutable)
# }
```

### Test 5.5: Alternative - Anonymize Account

```bash
# Instead of deletion, anonymize
curl -X POST http://localhost:5000/api/privacy/anonymize-account \
  -H "Authorization: Bearer $TOKEN"

# Expected:
# {
#   "success": true,
#   "message": "Your account has been anonymized"
# }

# Verify anonymization
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer $TOKEN"

# Expected: Anonymized profile
# {
#   "name": "User_a3f5b2c8",
#   "phone": null,
#   "email": "deleted_a3f5b2c8@anonymized.local",
#   "isAnonymized": true
# }
```

---

## 6️⃣ Consent Management Tests

### Test 6.1: Get Privacy Settings

```bash
# Get current privacy settings
curl -X GET http://localhost:5000/api/privacy/privacy-settings \
  -H "Authorization: Bearer $TOKEN"

# Expected:
# {
#   "success": true,
#   "data": {
#     "userId": "user123",
#     "consents": {
#       "analytics": true,
#       "mlTraining": true,
#       "marketing": false,
#       "thirdPartySharing": false
#     },
#     "dataProcessingPurposes": [...],
#     "dataRetentionPolicy": {...}
#   }
# }
```

### Test 6.2: Update Consent

```bash
# Withdraw consent for analytics
curl -X PUT http://localhost:5000/api/privacy/privacy-settings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "consents": {
      "analytics": false,
      "mlTraining": false,
      "marketing": false,
      "thirdPartySharing": false
    }
  }'

# Expected:
# {
#   "success": true,
#   "message": "Privacy settings updated successfully",
#   "consents": {...}
# }
```

### Test 6.3: Verify Consent Enforcement

```bash
# Try to access analytics endpoint without consent
curl -X GET http://localhost:5000/api/analytics/user-behavior \
  -H "Authorization: Bearer $TOKEN"

# Expected: 403 Forbidden
# {
#   "success": false,
#   "message": "User consent required for this operation",
#   "consentRequired": "analytics"
# }
```

---

## 7️⃣ Data Minimization Tests

### Test 7.1: Verify Minimal Data Exposure

```bash
# Get user list (should not expose sensitive fields)
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Expected: Only non-sensitive fields
# [
#   {
#     "_id": "user123",
#     "name": "Ramesh Patel",
#     "userType": "farmer",
#     "location": "Gujarat",
#     "isVerified": true
#     // No phone, email, bankAccount, etc.
#   }
# ]
```

### Test 7.2: Verify No Sensitive Data in Logs

```bash
# Check server logs for sensitive data
grep -i "password\|phone\|email\|bankAccount" backend/logs/app.log

# Expected: All sensitive fields should be [REDACTED]
# [PRIVACY-AUDIT] {"phone":"[REDACTED]","email":"[REDACTED]"}
```

---

## 8️⃣ Audit Logging Tests

### Test 8.1: Verify Data Access Logging

```bash
# Access profile
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer $TOKEN"

# Check logs
grep "DATA_ACCESS" backend/logs/app.log | tail -1

# Expected:
# [PRIVACY-AUDIT] {
#   "eventType": "DATA_ACCESS",
#   "purpose": "profile_view",
#   "requestedBy": "user123",
#   "path": "/api/profile",
#   "timestamp": "2026-01-31T23:39:28.000Z"
# }
```

### Test 8.2: Verify Deletion Logging

```bash
# After deletion, check audit log
grep "DATA_DELETION" backend/logs/app.log | tail -1

# Expected:
# [DELETION-AUDIT] {
#   "eventType": "DATA_DELETION",
#   "userId": "user123",
#   "status": "completed",
#   "retentionPeriod": "permanent"
# }
```

---

## 9️⃣ Compliance Status Tests

### Test 9.1: Check Overall Compliance

```bash
# Get compliance status
curl -X GET http://localhost:5000/api/privacy/compliance-status \
  -H "Authorization: Bearer $TOKEN"

# Expected:
# {
#   "success": true,
#   "data": {
#     "checks": {
#       "encryptionEnabled": true,
#       "dataMinimizationEnforced": true,
#       "consentManagementActive": true,
#       "auditLoggingEnabled": true,
#       "rightToAccessImplemented": true,
#       "rightToErasureImplemented": true,
#       "dataPortabilitySupported": true,
#       "privacyByDefaultEnabled": true
#     },
#     "gdprPrinciples": {...},
#     "overallCompliance": "COMPLIANT"
#   }
# }
```

---

## 🔟 Integration Tests

### Test 10.1: Complete User Journey

```bash
# 1. Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "phone":"9999999999",
    "password":"password123",
    "userType":"farmer"
  }'

# 2. Login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999999999","password":"password123"}' \
  | jq -r '.token')

# 3. View profile (verify masking)
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer $TOKEN"

# 4. Export data
curl -X GET http://localhost:5000/api/privacy/export-data \
  -H "Authorization: Bearer $TOKEN"

# 5. Update privacy settings
curl -X PUT http://localhost:5000/api/privacy/privacy-settings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"consents":{"analytics":false}}'

# 6. Request deletion
curl -X POST http://localhost:5000/api/privacy/request-deletion \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Test"}'

# 7. Confirm deletion (use token from step 6)
# curl -X POST http://localhost:5000/api/privacy/confirm-deletion ...
```

---

## 📊 Test Results Checklist

- [ ] Encryption/Decryption works correctly
- [ ] Data masking formats are correct
- [ ] Purpose-based access control enforced
- [ ] Data export includes all categories
- [ ] Deletion eligibility check works
- [ ] Account deletion completes successfully
- [ ] Anonymization preserves transaction records
- [ ] Blockchain hashes retained after deletion
- [ ] Consent management works
- [ ] Consent enforcement blocks unauthorized access
- [ ] Data minimization enforced
- [ ] No sensitive data in logs
- [ ] Audit logs capture all events
- [ ] Compliance status shows COMPLIANT

---

## 🚨 Common Issues & Solutions

### Issue 1: Encryption Key Not Set

**Error**: `ENCRYPTION_KEY environment variable not set`

**Solution**:
```bash
export ENCRYPTION_KEY="your-super-secret-encryption-key-min-32-chars-long"
```

### Issue 2: Deletion Fails Due to Active Orders

**Error**: `Cannot delete account at this time - active orders`

**Solution**: Complete or cancel all active orders first
```bash
# Cancel active orders
curl -X PUT http://localhost:5000/api/orders/123/cancel \
  -H "Authorization: Bearer $TOKEN"
```

### Issue 3: Consent Required Error

**Error**: `User consent required for this operation`

**Solution**: Grant consent first
```bash
curl -X PUT http://localhost:5000/api/privacy/privacy-settings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"consents":{"analytics":true}}'
```

---

## 📈 Performance Testing

### Test Encryption Overhead

```bash
# Benchmark encryption performance
time node -e "
const { encrypt } = require('./src/utils/encryption.js');
for (let i = 0; i < 1000; i++) {
  encrypt('test-data-' + i);
}
"

# Expected: < 1 second for 1000 encryptions
```

---

**Created**: January 31, 2026  
**Version**: 1.0  
**Total Test Scenarios**: 25+  
**Coverage**: Encryption, Masking, Access Control, Export, Deletion, Consent, Audit
