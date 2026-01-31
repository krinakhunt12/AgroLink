# Zero-Trust Security Testing Guide

## 🧪 Testing Strategy

This guide provides comprehensive test scenarios to validate the Zero-Trust security architecture implementation.

---

## 📋 Test Categories

### 1. Authentication Layer Tests
### 2. Authorization & RBAC Tests
### 3. Rate Limiting Tests
### 4. Session Management Tests
### 5. IP Reputation Tests
### 6. Request Integrity Tests
### 7. Behavioral Anomaly Tests
### 8. Integration Tests

---

## 1️⃣ Authentication Layer Tests

### Test 1.1: Missing Token
**Objective**: Verify system rejects requests without authentication token

```bash
# Request
curl -X GET http://localhost:5000/api/profile

# Expected Response
{
  "success": false,
  "message": "Authentication token not provided",
  "code": "MISSING_TOKEN",
  "requestId": "uuid",
  "timestamp": "2026-01-31T23:25:42.000Z"
}
# Expected Status: 401
```

### Test 1.2: Invalid Token Signature
**Objective**: Verify system rejects tokens with invalid signatures

```bash
# Request
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer invalid.token.here"

# Expected Response
{
  "success": false,
  "message": "Invalid authentication token",
  "code": "INVALID_TOKEN",
  "requestId": "uuid",
  "timestamp": "2026-01-31T23:25:42.000Z"
}
# Expected Status: 401
```

### Test 1.3: Expired Token
**Objective**: Verify system rejects expired tokens

```bash
# Generate expired token (set JWT_EXPIRE=1s in .env for testing)
# Request
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer <expired-token>"

# Expected Response
{
  "success": false,
  "message": "Session expired. Please login again.",
  "code": "TOKEN_EXPIRED",
  "requestId": "uuid",
  "timestamp": "2026-01-31T23:25:42.000Z"
}
# Expected Status: 401
```

### Test 1.4: Revoked Token
**Objective**: Verify system rejects manually revoked tokens

```bash
# Step 1: Login and get token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"1234567890","password":"password"}' \
  | jq -r '.token')

# Step 2: Logout (revokes token)
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"

# Step 3: Try to use revoked token
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer $TOKEN"

# Expected Response
{
  "success": false,
  "message": "Session has been terminated",
  "code": "TOKEN_REVOKED",
  "requestId": "uuid",
  "timestamp": "2026-01-31T23:25:42.000Z"
}
# Expected Status: 401
```

### Test 1.5: Deleted User Account
**Objective**: Verify system rejects tokens for deleted users

```bash
# Request with token of deleted user
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer <token-of-deleted-user>"

# Expected Response
{
  "success": false,
  "message": "Account no longer exists",
  "code": "USER_NOT_FOUND",
  "requestId": "uuid",
  "timestamp": "2026-01-31T23:25:42.000Z"
}
# Expected Status: 401
```

---

## 2️⃣ Authorization & RBAC Tests

### Test 2.1: Role Restriction - Farmer Endpoint
**Objective**: Verify only farmers can access farmer-specific endpoints

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

# Expected Response
{
  "success": false,
  "message": "Access denied. Required role: farmer",
  "code": "INSUFFICIENT_PERMISSIONS",
  "requestId": "uuid",
  "timestamp": "2026-01-31T23:25:42.000Z"
}
# Expected Status: 403
```

### Test 2.2: Admin-Only Access
**Objective**: Verify only admins can access admin endpoints

```bash
# Login as farmer
FARMER_TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"farmer-phone","password":"password"}' \
  | jq -r '.token')

# Try to access admin endpoint
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer $FARMER_TOKEN"

# Expected Response
{
  "success": false,
  "message": "Access denied. Required role: admin",
  "code": "INSUFFICIENT_PERMISSIONS",
  "requestId": "uuid",
  "timestamp": "2026-01-31T23:25:42.000Z"
}
# Expected Status: 403
```

### Test 2.3: Multi-Role Access
**Objective**: Verify endpoints accessible by multiple roles work correctly

```bash
# Test with farmer token
curl -X GET http://localhost:5000/api/marketplace/products \
  -H "Authorization: Bearer $FARMER_TOKEN"

# Test with buyer token
curl -X GET http://localhost:5000/api/marketplace/products \
  -H "Authorization: Bearer $BUYER_TOKEN"

# Both should succeed with status 200
```

---

## 3️⃣ Rate Limiting Tests

### Test 3.1: Normal Request Rate
**Objective**: Verify normal usage is allowed

```bash
# Send 30 requests (under 60/min limit)
for i in {1..30}; do
  curl -X GET http://localhost:5000/api/profile \
    -H "Authorization: Bearer $TOKEN"
  sleep 0.1
done

# All requests should succeed with status 200
```

### Test 3.2: Exceed Rate Limit
**Objective**: Verify rate limiting blocks excessive requests

```bash
# Send 70 requests rapidly (exceeds 60/min limit)
for i in {1..70}; do
  curl -X GET http://localhost:5000/api/profile \
    -H "Authorization: Bearer $TOKEN"
done

# First 60 should succeed (200)
# Remaining 10 should fail with:
{
  "success": false,
  "message": "Too many requests. Try again in Xs",
  "code": "RATE_LIMIT_EXCEEDED",
  "requestId": "uuid",
  "timestamp": "2026-01-31T23:25:42.000Z"
}
# Expected Status: 429
```

### Test 3.3: Rate Limit Reset
**Objective**: Verify rate limit resets after time window

```bash
# Exceed rate limit
for i in {1..70}; do
  curl -X GET http://localhost:5000/api/profile \
    -H "Authorization: Bearer $TOKEN"
done

# Wait 61 seconds
sleep 61

# Try again - should succeed
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer $TOKEN"

# Expected Status: 200
```

---

## 4️⃣ Session Management Tests

### Test 4.1: Token Refresh Warning
**Objective**: Verify system warns when token is about to expire

```bash
# Use token that's about to expire (within 5 minutes)
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer $EXPIRING_TOKEN" \
  -v

# Check response headers for:
# X-Token-Refresh-Required: true
```

### Test 4.2: Token Refresh
**Objective**: Verify token refresh functionality

```bash
# Refresh token
NEW_TOKEN=$(curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Authorization: Bearer $OLD_TOKEN" \
  | jq -r '.token')

# Use new token
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer $NEW_TOKEN"

# Expected Status: 200
```

### Test 4.3: Session Fingerprint Consistency
**Objective**: Verify fingerprint validation (requires different User-Agent)

```bash
# Request 1 with User-Agent A
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)"

# Request 2 with User-Agent B (same token)
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)"

# Second request should succeed but log FINGERPRINT_MISMATCH event
# Check server logs for: [SECURITY-AUDIT] FINGERPRINT_MISMATCH
```

---

## 5️⃣ IP Reputation Tests

### Test 5.1: Failed Login Attempts
**Objective**: Verify IP gets flagged after multiple failures

```bash
# Attempt 11 failed logins (exceeds threshold of 10)
for i in {1..11}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"phone":"1234567890","password":"wrong-password"}'
done

# 11th attempt should return:
{
  "success": false,
  "message": "Access denied from flagged IP address",
  "code": "SUSPICIOUS_IP",
  "requestId": "uuid",
  "timestamp": "2026-01-31T23:25:42.000Z"
}
# Expected Status: 403
```

### Test 5.2: Clear Suspicious IP (Admin)
**Objective**: Verify admin can clear IP flags

```bash
# Admin clears IP flag
curl -X POST http://localhost:5000/api/admin/security/clear-ip \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ip":"192.168.1.100"}'

# Expected Response
{
  "success": true,
  "message": "Suspicious flag cleared for IP: 192.168.1.100"
}
# Expected Status: 200
```

---

## 6️⃣ Request Integrity Tests

### Test 6.1: SQL Injection Attempt
**Objective**: Verify system detects SQL injection patterns

```bash
curl -X POST http://localhost:5000/api/farmer/products \
  -H "Authorization: Bearer $FARMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Tomato","description":"Test; DROP TABLE users;--"}'

# Expected Response
{
  "success": false,
  "message": "Request contains suspicious content",
  "code": "MALICIOUS_INPUT",
  "requestId": "uuid",
  "timestamp": "2026-01-31T23:25:42.000Z"
}
# Expected Status: 400
# Check logs for: [SECURITY-AUDIT] INJECTION_ATTEMPT
```

### Test 6.2: XSS Attempt
**Objective**: Verify system detects XSS patterns

```bash
curl -X POST http://localhost:5000/api/farmer/products \
  -H "Authorization: Bearer $FARMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(\"XSS\")</script>","price":50}'

# Expected Response
{
  "success": false,
  "message": "Request contains suspicious content",
  "code": "MALICIOUS_INPUT",
  "requestId": "uuid",
  "timestamp": "2026-01-31T23:25:42.000Z"
}
# Expected Status: 400
```

### Test 6.3: Path Traversal Attempt
**Objective**: Verify system detects path traversal patterns

```bash
curl -X GET http://localhost:5000/api/files?path=../../etc/passwd \
  -H "Authorization: Bearer $TOKEN"

# Expected Response
{
  "success": false,
  "message": "Request contains suspicious content",
  "code": "MALICIOUS_INPUT",
  "requestId": "uuid",
  "timestamp": "2026-01-31T23:25:42.000Z"
}
# Expected Status: 400
```

---

## 7️⃣ Behavioral Anomaly Tests

### Test 7.1: Rapid Endpoint Scanning
**Objective**: Verify system detects scanning behavior

```bash
# Rapidly access many different endpoints
ENDPOINTS=(
  "/api/profile"
  "/api/products"
  "/api/orders"
  "/api/bids"
  "/api/users"
  "/api/categories"
  "/api/marketplace"
  "/api/dashboard"
  "/api/analytics"
)

for endpoint in "${ENDPOINTS[@]}"; do
  curl -X GET "http://localhost:5000$endpoint" \
    -H "Authorization: Bearer $TOKEN"
done

# Check logs for: [SECURITY-AUDIT] ANOMALOUS_PATTERN
# anomalyScore should be elevated
```

### Test 7.2: Bot-like Request Pattern
**Objective**: Verify system detects automated bot behavior

```bash
# Send requests with very consistent timing (< 100ms intervals)
for i in {1..20}; do
  curl -X GET http://localhost:5000/api/products \
    -H "Authorization: Bearer $TOKEN"
  sleep 0.05  # 50ms - too fast for human
done

# Check logs for: [SECURITY-AUDIT] ANOMALOUS_PATTERN
# avgRequestInterval should be flagged
```

---

## 8️⃣ Integration Tests

### Test 8.1: Complete User Journey (Farmer)
**Objective**: Verify security doesn't break normal user flow

```bash
# 1. Register
REGISTER_RESPONSE=$(curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test Farmer",
    "phone":"9876543210",
    "password":"SecurePass123",
    "userType":"farmer",
    "location":"Gujarat"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')

# 2. Get profile
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer $TOKEN"

# 3. Create product
curl -X POST http://localhost:5000/api/farmer/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Organic Tomatoes",
    "price":60,
    "quantity":100,
    "category":"Vegetables"
  }'

# 4. View products
curl -X GET http://localhost:5000/api/marketplace/products \
  -H "Authorization: Bearer $TOKEN"

# 5. Logout
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"

# All steps should succeed
```

### Test 8.2: Admin Security Management
**Objective**: Verify admin security controls work end-to-end

```bash
# 1. Admin login
ADMIN_TOKEN=$(curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@agrolink.com","password":"admin123"}' \
  | jq -r '.token')

# 2. View security metrics
curl -X GET http://localhost:5000/api/admin/security/metrics \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 3. Clear suspicious IP
curl -X POST http://localhost:5000/api/admin/security/clear-ip \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ip":"192.168.1.100"}'

# 4. Revoke user session
curl -X POST http://localhost:5000/api/admin/security/revoke-session \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-id-here","issuedAt":1234567890}'

# All should succeed with appropriate responses
```

---

## 🎯 Automated Test Script

```bash
#!/bin/bash

# Zero-Trust Security Test Suite
# Run all tests and generate report

BASE_URL="http://localhost:5000"
REPORT_FILE="security-test-report.txt"

echo "Zero-Trust Security Test Report" > $REPORT_FILE
echo "Generated: $(date)" >> $REPORT_FILE
echo "================================" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Test 1: Missing Token
echo "Test 1: Missing Token" >> $REPORT_FILE
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X GET $BASE_URL/api/profile)
if [ "$RESPONSE" == "401" ]; then
  echo "✓ PASS - Correctly rejected missing token" >> $REPORT_FILE
else
  echo "✗ FAIL - Expected 401, got $RESPONSE" >> $REPORT_FILE
fi
echo "" >> $REPORT_FILE

# Test 2: Invalid Token
echo "Test 2: Invalid Token" >> $REPORT_FILE
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X GET $BASE_URL/api/profile \
  -H "Authorization: Bearer invalid.token.here")
if [ "$RESPONSE" == "401" ]; then
  echo "✓ PASS - Correctly rejected invalid token" >> $REPORT_FILE
else
  echo "✗ FAIL - Expected 401, got $RESPONSE" >> $REPORT_FILE
fi
echo "" >> $REPORT_FILE

# Add more tests...

echo "Test suite completed. Report saved to $REPORT_FILE"
cat $REPORT_FILE
```

---

## 📊 Expected Audit Log Entries

### Successful Authentication
```json
{
  "timestamp": "2026-01-31T23:25:42.000Z",
  "eventType": "AUTH_SUCCESS",
  "requestId": "uuid",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "userId": "user-id",
  "userType": "farmer",
  "method": "GET",
  "path": "/api/profile",
  "processingTime": 15
}
```

### Failed Authentication
```json
{
  "timestamp": "2026-01-31T23:25:42.000Z",
  "eventType": "SECURITY_FAILURE",
  "requestId": "uuid",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "userId": "anonymous",
  "userType": "unknown",
  "method": "GET",
  "path": "/api/profile",
  "failureCode": "INVALID_TOKEN",
  "failureMessage": "Invalid authentication token",
  "statusCode": 401
}
```

---

## 🔍 Monitoring Checklist

During testing, monitor for:

- [ ] All authentication failures are logged
- [ ] Rate limiting triggers at correct threshold
- [ ] IP reputation system flags suspicious IPs
- [ ] Session fingerprint mismatches are detected
- [ ] Injection attempts are blocked and logged
- [ ] Anomalous patterns are identified
- [ ] Admin actions are properly audited
- [ ] No sensitive information in error responses
- [ ] Request IDs are unique and traceable
- [ ] Performance overhead is acceptable (< 20ms)

---

## 🚀 Performance Benchmarking

```bash
# Benchmark authentication overhead
ab -n 1000 -c 10 -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/profile

# Expected results:
# - Requests per second: > 500
# - Mean time per request: < 20ms
# - Failed requests: 0
```

---

**Last Updated**: January 31, 2026  
**Test Suite Version**: 1.0
