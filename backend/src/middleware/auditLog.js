import { auditLogger } from '../services/auditLogger.js';

/**
 * AUDIT LOGGING MIDDLEWARE
 * 
 * Integrates audit logging into the request/response cycle
 * 
 * Features:
 * - Automatic logging of all requests
 * - Success/failure tracking
 * - Performance monitoring
 * - Error logging
 */

/**
 * Log all API requests
 */
export const auditRequest = async (req, res, next) => {
    // Capture request start time
    req.startTime = Date.now();

    // Generate request ID
    req.id = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store original res.json to intercept response
    const originalJson = res.json.bind(res);

    res.json = function (data) {
        // Log the request after response
        logRequest(req, res, data);
        return originalJson(data);
    };

    next();
};

/**
 * Log request details
 */
const logRequest = async (req, res, responseData) => {
    try {
        const duration = Date.now() - req.startTime;
        const user = req.user;

        // Determine event type based on endpoint and method
        let eventType = 'DATA_READ';
        let eventCategory = 'DATA_ACCESS';

        if (req.originalUrl.includes('/auth/login')) {
            eventType = res.statusCode === 200 ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED';
            eventCategory = 'AUTHENTICATION';
        } else if (req.originalUrl.includes('/auth/logout')) {
            eventType = 'LOGOUT';
            eventCategory = 'AUTHENTICATION';
        } else if (req.method === 'POST') {
            eventType = 'DATA_WRITE';
        } else if (req.method === 'PUT' || req.method === 'PATCH') {
            eventType = 'DATA_UPDATE';
        } else if (req.method === 'DELETE') {
            eventType = 'DATA_DELETE';
        }

        // Determine outcome
        let outcome = 'SUCCESS';
        if (res.statusCode >= 400 && res.statusCode < 500) {
            outcome = 'BLOCKED';
        } else if (res.statusCode >= 500) {
            outcome = 'FAILURE';
        }

        // Log the event
        await auditLogger.log({
            eventType,
            eventCategory,
            userId: user?._id,
            userRole: user?.userType,
            userName: user?.name,
            action: `${req.method} ${req.originalUrl}`,
            resource: req.originalUrl,
            method: req.method,
            endpoint: req.originalUrl,
            outcome,
            statusCode: res.statusCode,
            ipAddress: req.ip || req.connection?.remoteAddress,
            userAgent: req.get('user-agent'),
            sessionId: req.sessionID,
            details: {
                duration,
                responseSize: JSON.stringify(responseData).length
            },
            requestId: req.id
        });

    } catch (error) {
        console.error('[AUDIT-MIDDLEWARE-ERROR]', error);
    }
};

/**
 * Log authentication events
 */
export const auditAuth = (eventType) => {
    return async (req, res, next) => {
        try {
            await auditLogger.logAuthentication(
                eventType,
                req,
                req.user,
                {
                    endpoint: req.originalUrl,
                    method: req.method
                }
            );
        } catch (error) {
            console.error('[AUDIT-AUTH-ERROR]', error);
        }
        next();
    };
};

/**
 * Log authorization failures
 */
export const auditAuthzFailure = async (req, res, resource, reason) => {
    try {
        await auditLogger.logAuthorization(
            'ACCESS_DENIED',
            req,
            req.user,
            resource,
            {
                reason,
                requiredRole: reason.includes('role') ? 'admin' : undefined
            }
        );
    } catch (error) {
        console.error('[AUDIT-AUTHZ-ERROR]', error);
    }
};

/**
 * Log data access
 */
export const auditDataAccess = (purpose) => {
    return async (req, res, next) => {
        try {
            await auditLogger.logDataAccess(
                'SENSITIVE_DATA_ACCESS',
                req,
                req.user,
                req.originalUrl,
                {
                    purpose,
                    dataType: req.params.type || 'unknown'
                }
            );
        } catch (error) {
            console.error('[AUDIT-DATA-ACCESS-ERROR]', error);
        }
        next();
    };
};

/**
 * Log security events
 */
export const auditSecurityEvent = async (eventType, req, details = {}) => {
    try {
        await auditLogger.logSecurity(
            eventType,
            req,
            req.user,
            details
        );
    } catch (error) {
        console.error('[AUDIT-SECURITY-ERROR]', error);
    }
};

/**
 * Log privacy events
 */
export const auditPrivacyEvent = async (eventType, req, details = {}) => {
    try {
        await auditLogger.logPrivacy(
            eventType,
            req,
            req.user,
            details
        );
    } catch (error) {
        console.error('[AUDIT-PRIVACY-ERROR]', error);
    }
};

/**
 * Log file upload events
 */
export const auditFileUpload = async (eventType, req, details = {}) => {
    try {
        await auditLogger.logFileUpload(
            eventType,
            req,
            req.user,
            details
        );
    } catch (error) {
        console.error('[AUDIT-FILE-UPLOAD-ERROR]', error);
    }
};

/**
 * Middleware to log failed requests
 */
export const auditError = (err, req, res, next) => {
    // Log the error
    auditLogger.log({
        eventType: 'SYSTEM_ERROR',
        eventCategory: 'SYSTEM',
        userId: req.user?._id,
        userRole: req.user?.userType,
        action: `${req.method} ${req.originalUrl}`,
        resource: req.originalUrl,
        method: req.method,
        endpoint: req.originalUrl,
        outcome: 'FAILURE',
        statusCode: err.statusCode || 500,
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.get('user-agent'),
        errorMessage: err.message,
        details: {
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        },
        requestId: req.id
    }).catch(error => {
        console.error('[AUDIT-ERROR-LOGGING-FAILED]', error);
    });

    next(err);
};

export default {
    auditRequest,
    auditAuth,
    auditAuthzFailure,
    auditDataAccess,
    auditSecurityEvent,
    auditPrivacyEvent,
    auditFileUpload,
    auditError
};
