import AuditLog from '../models/AuditLog.model.js';
import crypto from 'crypto';

/**
 * CENTRALIZED AUDIT LOGGING SERVICE
 * 
 * Provides unified interface for logging security events across the application
 * 
 * Features:
 * - Centralized log creation
 * - Risk assessment
 * - Automatic categorization
 * - Correlation tracking
 * - Append-only storage
 * 
 * Usage:
 * import { auditLogger } from './services/auditLogger.js';
 * await auditLogger.logAuthentication('LOGIN_SUCCESS', req, user);
 */

class AuditLogger {
    /**
     * Generate unique event ID
     */
    generateEventId() {
        return `EVT-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    }

    /**
     * Extract request context
     */
    extractRequestContext(req) {
        return {
            ipAddress: req.ip || req.connection?.remoteAddress || 'unknown',
            userAgent: req.get('user-agent') || 'unknown',
            method: req.method,
            endpoint: req.originalUrl || req.url,
            sessionId: req.sessionID || req.headers['x-session-id'],
            deviceFingerprint: req.headers['x-device-fingerprint']
        };
    }

    /**
     * Assess risk level based on event type and context
     */
    assessRisk(eventType, outcome, context = {}) {
        let riskScore = 0;
        let riskLevel = 'LOW';

        // High-risk event types
        const highRiskEvents = [
            'FRAUD_DETECTED',
            'ANOMALY_DETECTED',
            'MALICIOUS_FILE_UPLOAD',
            'INJECTION_ATTEMPT',
            'XSS_ATTEMPT',
            'DATA_DELETION_REQUESTED'
        ];

        const mediumRiskEvents = [
            'LOGIN_FAILED',
            'ACCESS_DENIED',
            'ROLE_VIOLATION',
            'POLICY_VIOLATION',
            'FILE_VALIDATION_FAILED',
            'RATE_LIMIT_EXCEEDED'
        ];

        if (highRiskEvents.includes(eventType)) {
            riskScore = 80;
            riskLevel = 'HIGH';
        } else if (mediumRiskEvents.includes(eventType)) {
            riskScore = 50;
            riskLevel = 'MEDIUM';
        } else if (outcome === 'FAILURE' || outcome === 'BLOCKED') {
            riskScore = 30;
            riskLevel = 'MEDIUM';
        } else {
            riskScore = 10;
            riskLevel = 'LOW';
        }

        // Adjust based on context
        if (context.repeatedFailure) {
            riskScore += 20;
        }

        if (context.suspiciousIP) {
            riskScore += 15;
        }

        if (context.anomalyScore > 0.7) {
            riskScore += 25;
        }

        // Determine final risk level
        if (riskScore >= 75) {
            riskLevel = 'CRITICAL';
        } else if (riskScore >= 50) {
            riskLevel = 'HIGH';
        } else if (riskScore >= 25) {
            riskLevel = 'MEDIUM';
        } else {
            riskLevel = 'LOW';
        }

        return { riskScore, riskLevel };
    }

    /**
     * Core logging function
     */
    async log(eventData) {
        try {
            const eventId = this.generateEventId();

            // Assess risk
            const { riskScore, riskLevel } = this.assessRisk(
                eventData.eventType,
                eventData.outcome,
                eventData.context || {}
            );

            const logEntry = new AuditLog({
                eventId,
                timestamp: new Date(),
                eventType: eventData.eventType,
                eventCategory: eventData.eventCategory,
                userId: eventData.userId,
                userRole: eventData.userRole,
                userName: eventData.userName,
                userEmail: eventData.userEmail,
                action: eventData.action,
                resource: eventData.resource,
                method: eventData.method,
                endpoint: eventData.endpoint,
                outcome: eventData.outcome,
                statusCode: eventData.statusCode,
                ipAddress: eventData.ipAddress,
                userAgent: eventData.userAgent,
                sessionId: eventData.sessionId,
                deviceFingerprint: eventData.deviceFingerprint,
                riskLevel,
                riskScore,
                details: eventData.details || {},
                errorMessage: eventData.errorMessage,
                metadata: {
                    requestId: eventData.requestId,
                    correlationId: eventData.correlationId,
                    source: eventData.source || 'api-gateway',
                    version: '1.0'
                }
            });

            await logEntry.save();

            // Console log for development
            console.log(`[AUDIT-LOG] ${eventType} - ${outcome} - Risk: ${riskLevel}`);

            return logEntry;

        } catch (error) {
            // Critical: Audit logging should never fail silently
            console.error('[AUDIT-LOG-ERROR] Failed to create audit log:', error);

            // In production, send to fallback logging service
            // e.g., CloudWatch, Elasticsearch, Syslog

            throw error;
        }
    }

    /**
     * Log authentication events
     */
    async logAuthentication(eventType, req, user = null, details = {}) {
        const context = this.extractRequestContext(req);

        return this.log({
            eventType,
            eventCategory: 'AUTHENTICATION',
            userId: user?._id,
            userRole: user?.userType,
            userName: user?.name,
            userEmail: user?.email,
            action: eventType.replace(/_/g, ' ').toLowerCase(),
            outcome: eventType.includes('FAILED') ? 'FAILURE' : 'SUCCESS',
            statusCode: eventType.includes('FAILED') ? 401 : 200,
            ...context,
            details,
            requestId: req.id
        });
    }

    /**
     * Log authorization events
     */
    async logAuthorization(eventType, req, user, resource, details = {}) {
        const context = this.extractRequestContext(req);

        return this.log({
            eventType,
            eventCategory: 'AUTHORIZATION',
            userId: user?._id,
            userRole: user?.userType,
            userName: user?.name,
            action: `Access ${resource}`,
            resource,
            outcome: eventType.includes('DENIED') || eventType.includes('VIOLATION') ? 'BLOCKED' : 'SUCCESS',
            statusCode: eventType.includes('DENIED') ? 403 : 200,
            ...context,
            details,
            requestId: req.id
        });
    }

    /**
     * Log data access events
     */
    async logDataAccess(eventType, req, user, resource, details = {}) {
        const context = this.extractRequestContext(req);

        return this.log({
            eventType,
            eventCategory: 'DATA_ACCESS',
            userId: user?._id,
            userRole: user?.userType,
            userName: user?.name,
            action: eventType.replace(/_/g, ' ').toLowerCase(),
            resource,
            outcome: 'SUCCESS',
            statusCode: 200,
            ...context,
            details,
            requestId: req.id
        });
    }

    /**
     * Log security events
     */
    async logSecurity(eventType, req, user = null, details = {}) {
        const context = this.extractRequestContext(req);

        return this.log({
            eventType,
            eventCategory: 'SECURITY',
            userId: user?._id,
            userRole: user?.userType,
            userName: user?.name,
            action: eventType.replace(/_/g, ' ').toLowerCase(),
            outcome: 'BLOCKED',
            statusCode: 403,
            ...context,
            details,
            requestId: req.id,
            context: { suspiciousActivity: true }
        });
    }

    /**
     * Log privacy events
     */
    async logPrivacy(eventType, req, user, details = {}) {
        const context = this.extractRequestContext(req);

        return this.log({
            eventType,
            eventCategory: 'PRIVACY',
            userId: user?._id,
            userRole: user?.userType,
            userName: user?.name,
            userEmail: user?.email,
            action: eventType.replace(/_/g, ' ').toLowerCase(),
            outcome: 'SUCCESS',
            statusCode: 200,
            ...context,
            details,
            requestId: req.id
        });
    }

    /**
     * Log file upload events
     */
    async logFileUpload(eventType, req, user, details = {}) {
        const context = this.extractRequestContext(req);

        return this.log({
            eventType,
            eventCategory: 'FILE_UPLOAD',
            userId: user?._id,
            userRole: user?.userType,
            userName: user?.name,
            action: eventType.replace(/_/g, ' ').toLowerCase(),
            outcome: eventType.includes('FAILED') ? 'FAILURE' : 'SUCCESS',
            statusCode: eventType.includes('FAILED') ? 400 : 200,
            ...context,
            details,
            requestId: req.id
        });
    }

    /**
     * Log system events
     */
    async logSystem(eventType, details = {}) {
        return this.log({
            eventType,
            eventCategory: 'SYSTEM',
            userId: null,
            userRole: 'system',
            action: eventType.replace(/_/g, ' ').toLowerCase(),
            outcome: eventType.includes('ERROR') ? 'FAILURE' : 'SUCCESS',
            ipAddress: 'system',
            userAgent: 'system',
            details,
            source: 'system'
        });
    }

    /**
     * Get audit logs with filters
     */
    async getLogs(filters = {}, options = {}) {
        const {
            startDate,
            endDate,
            eventType,
            eventCategory,
            userId,
            userRole,
            outcome,
            riskLevel,
            ipAddress
        } = filters;

        const {
            limit = 100,
            skip = 0,
            sort = { timestamp: -1 }
        } = options;

        const query = {};

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        if (eventType) query.eventType = eventType;
        if (eventCategory) query.eventCategory = eventCategory;
        if (userId) query.userId = userId;
        if (userRole) query.userRole = userRole;
        if (outcome) query.outcome = outcome;
        if (riskLevel) query.riskLevel = riskLevel;
        if (ipAddress) query.ipAddress = ipAddress;

        const logs = await AuditLog.find(query)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .lean();

        const total = await AuditLog.countDocuments(query);

        return {
            logs,
            total,
            page: Math.floor(skip / limit) + 1,
            totalPages: Math.ceil(total / limit)
        };
    }

    /**
     * Get dashboard statistics
     */
    async getDashboardStats(hours = 24) {
        return AuditLog.getDashboardStats(hours);
    }

    /**
     * Get recent security events
     */
    async getRecentSecurityEvents(limit = 100) {
        return AuditLog.getRecentSecurityEvents(limit);
    }

    /**
     * Get failed login attempts
     */
    async getFailedLogins(hours = 24) {
        return AuditLog.getFailedLogins(hours);
    }

    /**
     * Get suspicious activities
     */
    async getSuspiciousActivities(limit = 50) {
        return AuditLog.getSuspiciousActivities(limit);
    }

    /**
     * Get user activity timeline
     */
    async getUserTimeline(userId, limit = 100) {
        return AuditLog.getUserTimeline(userId, limit);
    }
}

// Export singleton instance
export const auditLogger = new AuditLogger();

export default auditLogger;
