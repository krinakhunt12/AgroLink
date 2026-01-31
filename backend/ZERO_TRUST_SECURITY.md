# Zero-Trust Backend Security Architecture

## 🔒 Overview

AgroLink implements a **Zero-Trust Security Model** where **no request is trusted by default**. Every API call undergoes multiple independent verification layers before accessing any resource, following the principle: **"Never Trust, Always Verify"**.

---

## 🛡️ Security Layers

### Layer 1: JWT Authentication & Token Validation
- **Token Extraction**: Validates Bearer token presence in Authorization header
- **Signature Verification**: Cryptographically verifies JWT signature using secret key
- **Expiration Check**: Ensures token hasn't expired
- **Revocation Check**: Validates token hasn't been manually revoked (session termination)

**Threat Mitigation**: Prevents unauthorized access, token forgery, and session hijacking

### Layer 2: User Account Status Verification
- **Account Existence**: Confirms user account still exists in database
- **Account Status**: Checks for suspended/banned accounts
- **Real-time Validation**: Every request re-validates user status (no caching)

**Threat Mitigation**: Prevents access from deleted or suspended accounts

### Layer 3: IP Reputation System
- **Suspicious IP Tracking**: Maintains real-time list of flagged IP addresses
- **Failure Threshold**: Automatically flags IPs after 10 failed authentication attempts
- **Automatic Blocking**: Denies requests from flagged IPs

**Threat Mitigation**: Prevents brute-force attacks and distributed attacks from compromised IPs

### Layer 4: Rate Limiting
- **Sliding Window**: 60 requests per minute per user/IP combination
- **Granular Tracking**: Separate limits for each user-IP pair
- **Automatic Cleanup**: Removes old request timestamps to prevent memory bloat

**Threat Mitigation**: Prevents API abuse, DoS attacks, and automated scraping

### Layer 5: Device/Session Fingerprinting
- **Fingerprint Generation**: Creates unique hash from User-Agent, Accept-Language, Accept-Encoding
- **Consistency Validation**: Detects when same token is used from different devices
- **Session Hijacking Detection**: Flags mismatched fingerprints for monitoring

**Threat Mitigation**: Detects stolen tokens and session hijacking attempts

### Layer 6: Token Freshness Monitoring
- **Age Tracking**: Monitors time since token issuance
- **Expiry Warning**: Sends `X-Token-Refresh-Required` header when token is about to expire
- **Proactive Refresh**: Allows frontend to refresh tokens before expiration

**Threat Mitigation**: Reduces window for token replay attacks

### Layer 7: Contextual Access Control (Beyond RBAC)
- **Role-Based Permissions**: Enforces farmer/buyer/admin role restrictions
- **Time-Based Access**: Optional restrictions for sensitive operations (e.g., admin actions during business hours)
- **Behavioral Analysis**: Monitors request patterns for anomalies

**Threat Mitigation**: Prevents privilege escalation and insider threats

### Layer 8: Request Integrity Validation
- **Header Validation**: Ensures required headers are present
- **Injection Detection**: Scans for SQL injection, XSS, path traversal patterns
- **Content-Type Validation**: Verifies proper content types for POST/PUT requests

**Threat Mitigation**: Prevents injection attacks and malformed requests

### Layer 9: Behavioral Anomaly Detection
- **Pattern Analysis**: Tracks user request patterns (endpoints, timing, methods)
- **Anomaly Scoring**: Calculates risk score based on unusual behavior
- **Automated Flagging**: Highlights suspicious patterns for review

**Threat Mitigation**: Detects automated bots, account takeover, and reconnaissance attacks

### Layer 10: Comprehensive Audit Logging
- **Event Tracking**: Logs all authentication attempts, failures, and security events
- **Request Metadata**: Captures IP, User-Agent, timestamp, request ID
- **Forensic Trail**: Enables post-incident analysis and compliance reporting

**Threat Mitigation**: Supports incident response and regulatory compliance

### Layer 11: Standardized Error Responses
- **No Information Leakage**: Generic error messages prevent system fingerprinting
- **Request ID Tracking**: Unique ID for each request enables support correlation
- **Consistent Format**: All security failures return standardized JSON structure

**Threat Mitigation**: Prevents information disclosure and system reconnaissance

---

## 🔐 Service-to-Service Security

### Node.js → FastAPI Communication
- **API Key Authentication**: Shared secret key (`ML_SERVICE_API_KEY`)
- **HMAC Request Signing**: Cryptographic signature using `ML_SERVICE_SECRET`
- **Timestamp Validation**: 5-minute window to prevent replay attacks
- **Signature Verification**: Constant-time comparison to prevent timing attacks

**Implementation**: See `backend/src/services/mlService.js` and `ml-service/app/security.py`

---

## 📊 Security Metrics & Monitoring

### Real-Time Metrics
```javascript
GET /api/admin/security/metrics
```

Returns:
- Active session count
- Suspicious IP list
- Total IPs being tracked
- Recent security events

### Audit Log Format
```json
{
  "timestamp": "2026-01-31T23:25:42.000Z",
  "eventType": "AUTH_SUCCESS | SECURITY_FAILURE | FINGERPRINT_MISMATCH | etc.",
  "requestId": "uuid-v4",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "userId": "user-id",
  "userType": "farmer | buyer | admin",
  "method": "GET | POST | PUT | DELETE",
  "path": "/api/endpoint",
  "additionalData": { ... }
}
```

---

## 🚨 Security Event Types

| Event Type | Severity | Description |
|------------|----------|-------------|
| `AUTH_SUCCESS` | INFO | Successful authentication |
| `SECURITY_FAILURE` | WARNING | Authentication/authorization failure |
| `TOKEN_EXPIRED` | INFO | Expired token used |
| `TOKEN_REVOKED` | WARNING | Revoked token attempted |
| `FINGERPRINT_MISMATCH` | HIGH | Possible session hijacking |
| `INJECTION_ATTEMPT` | CRITICAL | Malicious input detected |
| `IP_FLAGGED` | HIGH | IP exceeded failure threshold |
| `RATE_LIMIT_EXCEEDED` | WARNING | User exceeded request quota |
| `ANOMALOUS_PATTERN` | MEDIUM | Unusual request behavior |

---

## 🔧 Configuration

### Environment Variables
```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# ML Service Security
ML_SERVICE_API_KEY=agrolink_secure_ml_key_2026
ML_SERVICE_SECRET=super_secret_ml_protection_code
```

### Security Settings (`zeroTrust.js`)
```javascript
const SECURITY_CONFIG = {
    MAX_REQUESTS_PER_MINUTE: 60,
    SESSION_FINGERPRINT_REQUIRED: true,
    IP_WHITELIST_ENABLED: false,
    SUSPICIOUS_IP_THRESHOLD: 10,
    TOKEN_REFRESH_WINDOW: 300, // 5 minutes
};
```

---

## 🎯 Usage Examples

### Protecting Routes with Zero-Trust

```javascript
import { zeroTrustAuth, contextualAccessControl, requestIntegrityCheck } from './middleware/zeroTrust.js';

// Full Zero-Trust protection
router.post('/api/products', 
    zeroTrustAuth,                              // Layer 1-9
    requestIntegrityCheck,                       // Layer 8
    contextualAccessControl(['farmer']),         // Layer 7
    createProduct
);

// Read-only endpoints (lighter protection)
router.get('/api/products', 
    zeroTrustAuth,
    getProducts
);

// Admin-only with full protection
router.delete('/api/admin/users/:id',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    requestIntegrityCheck,
    deleteUser
);
```

### Session Management

```javascript
import { revokeSession } from './middleware/zeroTrust.js';

// On logout
export const logout = (req, res) => {
    const decoded = jwt.decode(req.headers.authorization.split(' ')[1]);
    revokeSession(decoded.id, decoded.iat);
    res.json({ success: true, message: 'Logged out successfully' });
};

// On security incident (admin action)
export const terminateUserSessions = (userId) => {
    // Revoke all sessions for a user
    // Implementation would iterate through all sessions
};
```

### IP Management

```javascript
import { clearSuspiciousIP, getSecurityMetrics } from './middleware/zeroTrust.js';

// Admin endpoint to clear IP flag
router.post('/api/admin/security/clear-ip', 
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    (req, res) => {
        clearSuspiciousIP(req.body.ip);
        res.json({ success: true });
    }
);

// Security dashboard
router.get('/api/admin/security/metrics',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    (req, res) => {
        res.json(getSecurityMetrics());
    }
);
```

---

## 🔍 Frontend Integration

### Handling Security Responses

```typescript
// Axios interceptor for token refresh
axios.interceptors.response.use(
    (response) => {
        // Check for token refresh warning
        if (response.headers['x-token-refresh-required']) {
            refreshAuthToken();
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            if (error.response.data.code === 'TOKEN_EXPIRED') {
                // Redirect to login
                window.location.href = '/login';
            }
        }
        if (error.response?.status === 403) {
            // Insufficient permissions
            toast.error('Access Denied: ' + error.response.data.message);
        }
        if (error.response?.status === 429) {
            // Rate limit exceeded
            toast.error('Too many requests. Please slow down.');
        }
        return Promise.reject(error);
    }
);
```

---

## 🏆 Security Best Practices Demonstrated

1. **Defense in Depth**: Multiple independent security layers
2. **Fail Secure**: Default deny, explicit allow
3. **Least Privilege**: Role-based access control
4. **Audit Everything**: Comprehensive logging for compliance
5. **Assume Breach**: Continuous verification, no implicit trust
6. **Secure by Default**: All routes protected unless explicitly public
7. **Graceful Degradation**: Security failures don't expose system details
8. **Behavioral Analysis**: Proactive threat detection
9. **Cryptographic Integrity**: HMAC signatures for service-to-service calls
10. **Session Management**: Revocation support and fingerprinting

---

## 📈 Production Recommendations

### Immediate Upgrades for Production

1. **Replace In-Memory Storage with Redis**
   - Session store
   - Rate limiting counters
   - IP reputation tracking

2. **Integrate Centralized Logging**
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - Splunk
   - AWS CloudWatch

3. **Add IP Geolocation Service**
   - MaxMind GeoIP2
   - IP2Location
   - Contextual access based on geography

4. **Implement 2FA/MFA**
   - TOTP (Time-based One-Time Password)
   - SMS verification
   - Email verification codes

5. **Add Web Application Firewall (WAF)**
   - AWS WAF
   - Cloudflare
   - ModSecurity

6. **Implement SIEM Integration**
   - Real-time security event correlation
   - Automated incident response
   - Threat intelligence feeds

7. **Add DDoS Protection**
   - Cloudflare
   - AWS Shield
   - Rate limiting at CDN level

8. **Implement Certificate Pinning**
   - For mobile apps
   - Prevents MITM attacks

---

## 🎓 Educational Value for Viva

### Key Talking Points

1. **Zero-Trust vs Traditional Perimeter Security**
   - Traditional: Trust inside network, verify at perimeter
   - Zero-Trust: Verify every request, regardless of source

2. **Why Multiple Layers?**
   - Single point of failure is eliminated
   - If one layer is bypassed, others still protect
   - Different layers catch different attack types

3. **Real-World Applications**
   - Google BeyondCorp
   - AWS Zero-Trust Architecture
   - Microsoft Zero-Trust Security Model

4. **Compliance Benefits**
   - GDPR: Audit trails and access controls
   - PCI-DSS: Strong authentication and logging
   - SOC 2: Comprehensive security monitoring

5. **Performance Considerations**
   - Middleware overhead: ~10-20ms per request
   - Mitigated by async operations and caching
   - Acceptable trade-off for security gains

---

## 📚 References

- NIST SP 800-207: Zero Trust Architecture
- OWASP Top 10 Security Risks
- CIS Controls for Effective Cyber Defense
- Google BeyondCorp Research Papers

---

**Last Updated**: January 31, 2026  
**Version**: 1.0  
**Maintainer**: AgroLink Security Team
