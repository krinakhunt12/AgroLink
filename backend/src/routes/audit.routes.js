import express from 'express';
import { zeroTrustAuth, contextualAccessControl } from '../middleware/zeroTrust.js';
import { auditLogger } from '../services/auditLogger.js';
import AuditLog from '../models/AuditLog.model.js';

const router = express.Router();

/**
 * AUDIT LOG & SECURITY MONITORING API ROUTES
 * 
 * Admin-only endpoints for security monitoring and audit log access
 * 
 * Security:
 * - Authentication required (Zero-Trust)
 * - Admin role only
 * - All access logged
 */

// ============================================
// DASHBOARD STATISTICS
// ============================================

/**
 * Get dashboard overview statistics
 * GET /api/audit/dashboard/stats
 */
router.get('/dashboard/stats',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    async (req, res) => {
        try {
            const { hours = 24 } = req.query;

            const stats = await auditLogger.getDashboardStats(parseInt(hours));

            res.json({
                success: true,
                data: stats,
                period: `Last ${hours} hours`
            });

        } catch (error) {
            console.error('[AUDIT-API-ERROR]', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch dashboard statistics'
            });
        }
    }
);

/**
 * Get recent security events
 * GET /api/audit/security/recent
 */
router.get('/security/recent',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    async (req, res) => {
        try {
            const { limit = 100 } = req.query;

            const events = await auditLogger.getRecentSecurityEvents(parseInt(limit));

            res.json({
                success: true,
                data: events,
                count: events.length
            });

        } catch (error) {
            console.error('[AUDIT-API-ERROR]', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch security events'
            });
        }
    }
);

/**
 * Get failed login attempts
 * GET /api/audit/security/failed-logins
 */
router.get('/security/failed-logins',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    async (req, res) => {
        try {
            const { hours = 24 } = req.query;

            const failedLogins = await auditLogger.getFailedLogins(parseInt(hours));

            res.json({
                success: true,
                data: failedLogins,
                count: failedLogins.length,
                period: `Last ${hours} hours`
            });

        } catch (error) {
            console.error('[AUDIT-API-ERROR]', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch failed login attempts'
            });
        }
    }
);

/**
 * Get suspicious activities
 * GET /api/audit/security/suspicious
 */
router.get('/security/suspicious',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    async (req, res) => {
        try {
            const { limit = 50 } = req.query;

            const activities = await auditLogger.getSuspiciousActivities(parseInt(limit));

            res.json({
                success: true,
                data: activities,
                count: activities.length
            });

        } catch (error) {
            console.error('[AUDIT-API-ERROR]', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch suspicious activities'
            });
        }
    }
);

// ============================================
// AUDIT LOG QUERIES
// ============================================

/**
 * Get audit logs with filters
 * GET /api/audit/logs
 */
router.get('/logs',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    async (req, res) => {
        try {
            const {
                startDate,
                endDate,
                eventType,
                eventCategory,
                userId,
                userRole,
                outcome,
                riskLevel,
                ipAddress,
                page = 1,
                limit = 50
            } = req.query;

            const filters = {
                startDate,
                endDate,
                eventType,
                eventCategory,
                userId,
                userRole,
                outcome,
                riskLevel,
                ipAddress
            };

            const options = {
                limit: parseInt(limit),
                skip: (parseInt(page) - 1) * parseInt(limit),
                sort: { timestamp: -1 }
            };

            const result = await auditLogger.getLogs(filters, options);

            res.json({
                success: true,
                ...result
            });

        } catch (error) {
            console.error('[AUDIT-API-ERROR]', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch audit logs'
            });
        }
    }
);

/**
 * Get user activity timeline
 * GET /api/audit/user/:userId/timeline
 */
router.get('/user/:userId/timeline',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    async (req, res) => {
        try {
            const { userId } = req.params;
            const { limit = 100 } = req.query;

            const timeline = await auditLogger.getUserTimeline(userId, parseInt(limit));

            res.json({
                success: true,
                data: timeline,
                count: timeline.length
            });

        } catch (error) {
            console.error('[AUDIT-API-ERROR]', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user timeline'
            });
        }
    }
);

// ============================================
// ANALYTICS & INSIGHTS
// ============================================

/**
 * Get event type distribution
 * GET /api/audit/analytics/event-distribution
 */
router.get('/analytics/event-distribution',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    async (req, res) => {
        try {
            const { hours = 24 } = req.query;
            const since = new Date(Date.now() - hours * 60 * 60 * 1000);

            const distribution = await AuditLog.aggregate([
                {
                    $match: { timestamp: { $gte: since } }
                },
                {
                    $group: {
                        _id: '$eventType',
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ]);

            res.json({
                success: true,
                data: distribution,
                period: `Last ${hours} hours`
            });

        } catch (error) {
            console.error('[AUDIT-API-ERROR]', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch event distribution'
            });
        }
    }
);

/**
 * Get risk level distribution
 * GET /api/audit/analytics/risk-distribution
 */
router.get('/analytics/risk-distribution',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    async (req, res) => {
        try {
            const { hours = 24 } = req.query;
            const since = new Date(Date.now() - hours * 60 * 60 * 1000);

            const distribution = await AuditLog.aggregate([
                {
                    $match: { timestamp: { $gte: since } }
                },
                {
                    $group: {
                        _id: '$riskLevel',
                        count: { $sum: 1 }
                    }
                }
            ]);

            res.json({
                success: true,
                data: distribution,
                period: `Last ${hours} hours`
            });

        } catch (error) {
            console.error('[AUDIT-API-ERROR]', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch risk distribution'
            });
        }
    }
);

/**
 * Get top IP addresses by activity
 * GET /api/audit/analytics/top-ips
 */
router.get('/analytics/top-ips',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    async (req, res) => {
        try {
            const { hours = 24, limit = 10 } = req.query;
            const since = new Date(Date.now() - hours * 60 * 60 * 1000);

            const topIPs = await AuditLog.aggregate([
                {
                    $match: {
                        timestamp: { $gte: since },
                        ipAddress: { $ne: 'system' }
                    }
                },
                {
                    $group: {
                        _id: '$ipAddress',
                        count: { $sum: 1 },
                        failedAttempts: {
                            $sum: { $cond: [{ $eq: ['$outcome', 'FAILURE'] }, 1, 0] }
                        },
                        highRiskEvents: {
                            $sum: { $cond: [{ $in: ['$riskLevel', ['HIGH', 'CRITICAL']] }, 1, 0] }
                        }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: parseInt(limit)
                }
            ]);

            res.json({
                success: true,
                data: topIPs,
                period: `Last ${hours} hours`
            });

        } catch (error) {
            console.error('[AUDIT-API-ERROR]', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch top IPs'
            });
        }
    }
);

/**
 * Get hourly activity trend
 * GET /api/audit/analytics/hourly-trend
 */
router.get('/analytics/hourly-trend',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    async (req, res) => {
        try {
            const { hours = 24 } = req.query;
            const since = new Date(Date.now() - hours * 60 * 60 * 1000);

            const trend = await AuditLog.aggregate([
                {
                    $match: { timestamp: { $gte: since } }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d %H:00',
                                date: '$timestamp'
                            }
                        },
                        total: { $sum: 1 },
                        success: {
                            $sum: { $cond: [{ $eq: ['$outcome', 'SUCCESS'] }, 1, 0] }
                        },
                        failure: {
                            $sum: { $cond: [{ $eq: ['$outcome', 'FAILURE'] }, 1, 0] }
                        },
                        blocked: {
                            $sum: { $cond: [{ $eq: ['$outcome', 'BLOCKED'] }, 1, 0] }
                        }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            res.json({
                success: true,
                data: trend,
                period: `Last ${hours} hours`
            });

        } catch (error) {
            console.error('[AUDIT-API-ERROR]', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch hourly trend'
            });
        }
    }
);

// ============================================
// ALERTS & NOTIFICATIONS
// ============================================

/**
 * Get active security alerts
 * GET /api/audit/alerts
 */
router.get('/alerts',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    async (req, res) => {
        try {
            const alerts = [];

            // Check for repeated failed logins
            const failedLogins = await auditLogger.getFailedLogins(1);
            const suspiciousIPs = failedLogins.filter(ip => ip.count >= 5);

            if (suspiciousIPs.length > 0) {
                alerts.push({
                    type: 'REPEATED_FAILED_LOGINS',
                    severity: 'HIGH',
                    message: `${suspiciousIPs.length} IP(s) with 5+ failed login attempts`,
                    data: suspiciousIPs,
                    timestamp: new Date()
                });
            }

            // Check for high-risk events
            const highRiskCount = await AuditLog.countDocuments({
                riskLevel: { $in: ['HIGH', 'CRITICAL'] },
                timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
            });

            if (highRiskCount > 10) {
                alerts.push({
                    type: 'HIGH_RISK_SPIKE',
                    severity: 'CRITICAL',
                    message: `${highRiskCount} high-risk events in the last hour`,
                    data: { count: highRiskCount },
                    timestamp: new Date()
                });
            }

            res.json({
                success: true,
                data: alerts,
                count: alerts.length
            });

        } catch (error) {
            console.error('[AUDIT-API-ERROR]', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch alerts'
            });
        }
    }
);

export default router;
