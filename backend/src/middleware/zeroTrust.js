import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.model.js';

/**
 * ZERO-TRUST SECURITY ARCHITECTURE
 * 
 * Core Principle: "Never Trust, Always Verify"
 * Every request undergoes multiple independent security checks before accessing any resource.
 * 
 * Security Layers:
 * 1. JWT Token Validation (Identity Verification)
 * 2. Token Integrity & Expiration Checks
 * 3. User Account Status Verification
 * 4. IP Address & Geolocation Validation
 * 5. Device/Session Fingerprint Verification
 * 6. Request Metadata Analysis
 * 7. Rate Limiting & Anomaly Detection
 * 8. Comprehensive Audit Logging
 */

// In-memory session store (In production, use Redis)
const sessionStore = new Map();
const ipAccessLog = new Map();
const suspiciousIPs = new Set();

// Security Configuration
const SECURITY_CONFIG = {
    MAX_REQUESTS_PER_MINUTE: 60,
    SESSION_FINGERPRINT_REQUIRED: true,
    IP_WHITELIST_ENABLED: false,
    SUSPICIOUS_IP_THRESHOLD: 10, // Failed attempts before IP is flagged
    TOKEN_REFRESH_WINDOW: 300, // 5 minutes before expiry
};

/**
 * LAYER 1: Enhanced JWT Authentication with Zero-Trust Validation
 */
export const zeroTrustAuth = async (req, res, next) => {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    // Attach request metadata for audit trail
    req.securityContext = {
        requestId,
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        origin: req.headers.origin,
        method: req.method,
        path: req.path,
    };

    try {
        // STEP 1: Extract and validate JWT token
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return handleSecurityFailure(req, res, 'MISSING_TOKEN', 'Authentication token not provided', 401);
        }

        // STEP 2: Verify JWT signature and decode
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return handleSecurityFailure(req, res, 'TOKEN_EXPIRED', 'Session expired. Please login again.', 401);
            }
            if (jwtError.name === 'JsonWebTokenError') {
                return handleSecurityFailure(req, res, 'INVALID_TOKEN', 'Invalid authentication token', 401);
            }
            throw jwtError;
        }

        // STEP 3: Verify token hasn't been revoked (check against session store)
        const sessionKey = `session:${decoded.id}:${decoded.iat}`;
        if (sessionStore.has(`revoked:${sessionKey}`)) {
            return handleSecurityFailure(req, res, 'TOKEN_REVOKED', 'Session has been terminated', 401);
        }

        // STEP 4: Fetch user and verify account status
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return handleSecurityFailure(req, res, 'USER_NOT_FOUND', 'Account no longer exists', 401);
        }

        // STEP 5: Verify user account is active (not banned/suspended)
        if (user.accountStatus === 'suspended' || user.accountStatus === 'banned') {
            return handleSecurityFailure(req, res, 'ACCOUNT_SUSPENDED', 'Account access has been restricted', 403);
        }

        // STEP 6: IP Address Validation
        const clientIP = req.securityContext.ip;
        if (suspiciousIPs.has(clientIP)) {
            return handleSecurityFailure(req, res, 'SUSPICIOUS_IP', 'Access denied from flagged IP address', 403);
        }

        // STEP 7: Rate Limiting Check
        const rateLimitResult = checkRateLimit(clientIP, user._id);
        if (!rateLimitResult.allowed) {
            return handleSecurityFailure(req, res, 'RATE_LIMIT_EXCEEDED', `Too many requests. Try again in ${rateLimitResult.retryAfter}s`, 429);
        }

        // STEP 8: Session Fingerprint Validation (Device/Browser consistency)
        const requestFingerprint = generateFingerprint(req);
        const storedFingerprint = sessionStore.get(sessionKey);

        if (SECURITY_CONFIG.SESSION_FINGERPRINT_REQUIRED && storedFingerprint) {
            if (storedFingerprint !== requestFingerprint) {
                // Fingerprint mismatch - possible session hijacking
                logSecurityEvent('FINGERPRINT_MISMATCH', req, user, {
                    expected: storedFingerprint,
                    received: requestFingerprint
                });
                // Allow but flag for monitoring (strict mode would reject)
            }
        } else if (!storedFingerprint) {
            // First request - store fingerprint
            sessionStore.set(sessionKey, requestFingerprint);
        }

        // STEP 9: Token Freshness Check (warn if token is about to expire)
        const tokenAge = Math.floor(Date.now() / 1000) - decoded.iat;
        const tokenExpiry = decoded.exp - Math.floor(Date.now() / 1000);

        if (tokenExpiry < SECURITY_CONFIG.TOKEN_REFRESH_WINDOW) {
            res.setHeader('X-Token-Refresh-Required', 'true');
        }

        // STEP 10: Attach verified user to request
        req.user = user;
        req.securityContext.userId = user._id.toString();
        req.securityContext.userType = user.userType;
        req.securityContext.tokenAge = tokenAge;

        // STEP 11: Log successful authentication
        logSecurityEvent('AUTH_SUCCESS', req, user, {
            processingTime: Date.now() - startTime
        });

        next();

    } catch (error) {
        console.error('[Zero-Trust] Unexpected error:', error);
        return handleSecurityFailure(req, res, 'INTERNAL_ERROR', 'Security verification failed', 500);
    }
};

/**
 * LAYER 2: Contextual Access Control (Beyond RBAC)
 */
export const contextualAccessControl = (requiredPermissions = []) => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            const context = req.securityContext;

            // Check if user has required role
            if (requiredPermissions.length > 0 && !requiredPermissions.includes(user.userType)) {
                return handleSecurityFailure(req, res, 'INSUFFICIENT_PERMISSIONS',
                    `Access denied. Required role: ${requiredPermissions.join(' or ')}`, 403);
            }

            // Additional contextual checks

            // 1. Time-based access (e.g., admin actions only during business hours)
            if (user.userType === 'admin') {
                const hour = new Date().getHours();
                // Example: Restrict sensitive admin actions outside 9 AM - 6 PM
                if ((req.method === 'DELETE' || req.path.includes('/admin/critical')) && (hour < 9 || hour > 18)) {
                    logSecurityEvent('TIME_RESTRICTION', req, user, { hour });
                    // In strict mode, this would block the request
                }
            }

            // 2. Geolocation-based access (if IP geolocation is available)
            // This is a placeholder - integrate with IP geolocation service
            const suspiciousCountries = ['XX', 'YY']; // Example country codes
            // if (suspiciousCountries.includes(context.country)) { ... }

            // 3. Request pattern analysis
            const requestPattern = analyzeRequestPattern(user._id, req);
            if (requestPattern.anomalyScore > 0.8) {
                logSecurityEvent('ANOMALOUS_PATTERN', req, user, requestPattern);
                // Flag for review but allow (in strict mode, would challenge with 2FA)
            }

            next();

        } catch (error) {
            console.error('[Contextual-Access] Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Access control verification failed'
            });
        }
    };
};

/**
 * LAYER 3: Request Integrity Verification
 */
export const requestIntegrityCheck = (req, res, next) => {
    try {
        // 1. Validate request headers
        const requiredHeaders = ['user-agent', 'accept'];
        for (const header of requiredHeaders) {
            if (!req.headers[header]) {
                logSecurityEvent('MISSING_HEADER', req, req.user, { header });
            }
        }

        // 2. Check for common attack patterns in request
        const suspiciousPatterns = [
            /<script>/i,
            /javascript:/i,
            /onerror=/i,
            /\.\.\//,
            /union.*select/i,
        ];

        const requestString = JSON.stringify({
            query: req.query,
            body: req.body,
            params: req.params
        });

        for (const pattern of suspiciousPatterns) {
            if (pattern.test(requestString)) {
                logSecurityEvent('INJECTION_ATTEMPT', req, req.user, {
                    pattern: pattern.toString(),
                    matched: requestString.match(pattern)?.[0]
                });
                return handleSecurityFailure(req, res, 'MALICIOUS_INPUT', 'Request contains suspicious content', 400);
            }
        }

        // 3. Validate content-type for POST/PUT requests
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            const contentType = req.headers['content-type'];
            if (!contentType || (!contentType.includes('application/json') && !contentType.includes('multipart/form-data'))) {
                logSecurityEvent('INVALID_CONTENT_TYPE', req, req.user, { contentType });
            }
        }

        next();

    } catch (error) {
        console.error('[Request-Integrity] Error:', error);
        next(); // Don't block on integrity check errors
    }
};

/**
 * Helper: Generate device/session fingerprint
 */
function generateFingerprint(req) {
    const components = [
        req.headers['user-agent'] || '',
        req.headers['accept-language'] || '',
        req.headers['accept-encoding'] || '',
    ].join('|');

    return crypto.createHash('sha256').update(components).digest('hex');
}

/**
 * Helper: Rate limiting check
 */
function checkRateLimit(ip, userId) {
    const key = `${ip}:${userId}`;
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    if (!ipAccessLog.has(key)) {
        ipAccessLog.set(key, []);
    }

    const requests = ipAccessLog.get(key);

    // Remove old requests outside the window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    ipAccessLog.set(key, recentRequests);

    if (recentRequests.length >= SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE) {
        return {
            allowed: false,
            retryAfter: Math.ceil((recentRequests[0] + 60000 - now) / 1000)
        };
    }

    recentRequests.push(now);
    return { allowed: true };
}

/**
 * Helper: Analyze request patterns for anomalies
 */
function analyzeRequestPattern(userId, req) {
    // Simplified anomaly detection
    // In production, use ML-based behavioral analysis

    const userKey = `pattern:${userId}`;
    if (!sessionStore.has(userKey)) {
        sessionStore.set(userKey, {
            requests: [],
            endpoints: new Set(),
            methods: new Set()
        });
    }

    const pattern = sessionStore.get(userKey);
    pattern.requests.push({
        timestamp: Date.now(),
        path: req.path,
        method: req.method
    });
    pattern.endpoints.add(req.path);
    pattern.methods.add(req.method);

    // Keep only last 100 requests
    if (pattern.requests.length > 100) {
        pattern.requests = pattern.requests.slice(-100);
    }

    // Calculate anomaly score (simplified)
    let anomalyScore = 0;

    // Check for rapid sequential requests to different endpoints
    const recentRequests = pattern.requests.slice(-10);
    const uniqueEndpoints = new Set(recentRequests.map(r => r.path));
    if (uniqueEndpoints.size > 8) {
        anomalyScore += 0.3; // Scanning behavior
    }

    // Check for unusual time patterns
    const timestamps = recentRequests.map(r => r.timestamp);
    const intervals = [];
    for (let i = 1; i < timestamps.length; i++) {
        intervals.push(timestamps[i] - timestamps[i - 1]);
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    if (avgInterval < 100) {
        anomalyScore += 0.4; // Too fast - possible bot
    }

    return {
        anomalyScore: Math.min(anomalyScore, 1),
        recentEndpoints: uniqueEndpoints.size,
        avgRequestInterval: avgInterval
    };
}

/**
 * Helper: Centralized security failure handler
 */
function handleSecurityFailure(req, res, code, message, statusCode) {
    // Log the failure
    logSecurityEvent('SECURITY_FAILURE', req, req.user, {
        failureCode: code,
        failureMessage: message,
        statusCode
    });

    // Track failed attempts for IP reputation
    const ip = req.securityContext.ip;
    const failureKey = `failures:${ip}`;
    const failures = (sessionStore.get(failureKey) || 0) + 1;
    sessionStore.set(failureKey, failures);

    if (failures >= SECURITY_CONFIG.SUSPICIOUS_IP_THRESHOLD) {
        suspiciousIPs.add(ip);
        logSecurityEvent('IP_FLAGGED', req, null, { ip, failureCount: failures });
    }

    // Return standardized error response (no sensitive details)
    return res.status(statusCode).json({
        success: false,
        message,
        code,
        requestId: req.securityContext.requestId,
        timestamp: req.securityContext.timestamp
    });
}

/**
 * Helper: Comprehensive audit logging
 */
function logSecurityEvent(eventType, req, user, additionalData = {}) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        eventType,
        requestId: req.securityContext?.requestId,
        ip: req.securityContext?.ip,
        userAgent: req.securityContext?.userAgent,
        userId: user?._id?.toString() || 'anonymous',
        userType: user?.userType || 'unknown',
        method: req.method,
        path: req.path,
        ...additionalData
    };

    // In production, send to centralized logging service (e.g., ELK, Splunk)
    console.log(`[SECURITY-AUDIT] ${eventType}:`, JSON.stringify(logEntry));

    // Store critical events for real-time monitoring
    if (['SECURITY_FAILURE', 'FINGERPRINT_MISMATCH', 'INJECTION_ATTEMPT', 'IP_FLAGGED'].includes(eventType)) {
        // Trigger alert to security team
        // sendSecurityAlert(logEntry);
    }
}

/**
 * Utility: Revoke a user's session (for logout or security incidents)
 */
export const revokeSession = (userId, issuedAt) => {
    const sessionKey = `session:${userId}:${issuedAt}`;
    sessionStore.set(`revoked:${sessionKey}`, true);
    logSecurityEvent('SESSION_REVOKED', { path: '/auth/logout' }, { _id: userId }, { sessionKey });
};

/**
 * Utility: Clear suspicious IP flag (admin action)
 */
export const clearSuspiciousIP = (ip) => {
    suspiciousIPs.delete(ip);
    sessionStore.delete(`failures:${ip}`);
    console.log(`[Zero-Trust] Cleared suspicious flag for IP: ${ip}`);
};

/**
 * Utility: Get security metrics (for admin dashboard)
 */
export const getSecurityMetrics = () => {
    return {
        activeSessions: sessionStore.size,
        suspiciousIPs: Array.from(suspiciousIPs),
        totalIPsTracked: ipAccessLog.size,
        timestamp: new Date().toISOString()
    };
};
