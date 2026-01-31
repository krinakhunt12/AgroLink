import mongoose from 'mongoose';

/**
 * AUDIT LOG MODEL
 * 
 * Centralized audit logging for security monitoring and compliance
 * 
 * Tracks:
 * - Authentication events (login, logout, failures)
 * - Authorization violations (RBAC, policy denials)
 * - Data access (sensitive operations)
 * - Security events (fraud detection, anomalies)
 * - System events (account deletion, data export)
 * 
 * Compliance:
 * - GDPR Article 30 (Records of processing activities)
 * - GDPR Article 33 (Breach notification)
 * - SOC 2 (Security monitoring)
 * - ISO 27001 (Audit trails)
 */

const auditLogSchema = new mongoose.Schema({
    // Event Identification
    eventId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
    },

    // Event Type Classification
    eventType: {
        type: String,
        required: true,
        enum: [
            // Authentication Events
            'LOGIN_SUCCESS',
            'LOGIN_FAILED',
            'LOGOUT',
            'TOKEN_REFRESH',
            'TOKEN_REVOKED',
            'PASSWORD_RESET',
            'PASSWORD_CHANGED',

            // Authorization Events
            'ACCESS_GRANTED',
            'ACCESS_DENIED',
            'ROLE_VIOLATION',
            'POLICY_VIOLATION',
            'PERMISSION_DENIED',

            // Data Access Events
            'DATA_READ',
            'DATA_WRITE',
            'DATA_UPDATE',
            'DATA_DELETE',
            'DATA_EXPORT',
            'SENSITIVE_DATA_ACCESS',

            // Security Events
            'FRAUD_DETECTED',
            'ANOMALY_DETECTED',
            'SUSPICIOUS_ACTIVITY',
            'RATE_LIMIT_EXCEEDED',
            'MALICIOUS_FILE_UPLOAD',
            'INJECTION_ATTEMPT',
            'XSS_ATTEMPT',

            // Privacy Events
            'CONSENT_GRANTED',
            'CONSENT_WITHDRAWN',
            'DATA_DELETION_REQUESTED',
            'DATA_DELETION_COMPLETED',
            'ACCOUNT_ANONYMIZED',

            // File Upload Events
            'FILE_UPLOAD_SUCCESS',
            'FILE_UPLOAD_FAILED',
            'FILE_VALIDATION_FAILED',
            'FILE_DELETED',

            // System Events
            'SYSTEM_ERROR',
            'CONFIGURATION_CHANGED',
            'BACKUP_CREATED',
            'MAINTENANCE_MODE'
        ],
        index: true
    },

    eventCategory: {
        type: String,
        required: true,
        enum: ['AUTHENTICATION', 'AUTHORIZATION', 'DATA_ACCESS', 'SECURITY', 'PRIVACY', 'FILE_UPLOAD', 'SYSTEM'],
        index: true
    },

    // User Information
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },

    userRole: {
        type: String,
        enum: ['farmer', 'buyer', 'admin', 'guest', 'system'],
        index: true
    },

    userName: String,
    userEmail: String,

    // Request Information
    action: {
        type: String,
        required: true
    },

    resource: String, // Resource being accessed (e.g., '/api/products', 'User:123')

    method: {
        type: String,
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    },

    endpoint: String,

    // Outcome
    outcome: {
        type: String,
        required: true,
        enum: ['SUCCESS', 'FAILURE', 'BLOCKED', 'WARNING'],
        index: true
    },

    statusCode: Number,

    // Security Context
    ipAddress: {
        type: String,
        required: true,
        index: true
    },

    userAgent: String,

    sessionId: String,

    deviceFingerprint: String,

    // Risk Assessment
    riskLevel: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        default: 'LOW',
        index: true
    },

    riskScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },

    // Additional Context
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    errorMessage: String,

    // Metadata
    metadata: {
        requestId: String,
        correlationId: String,
        source: String, // 'api-gateway', 'ml-service', etc.
        version: String
    },

    // Retention
    retentionPeriod: {
        type: Number,
        default: 2555 // 7 years in days (legal requirement)
    },

    expiresAt: {
        type: Date,
        index: true
    }

}, {
    timestamps: false, // We use our own timestamp field
    collection: 'audit_logs'
});

// Indexes for efficient querying
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ eventType: 1, timestamp: -1 });
auditLogSchema.index({ riskLevel: 1, timestamp: -1 });
auditLogSchema.index({ ipAddress: 1, timestamp: -1 });
auditLogSchema.index({ outcome: 1, timestamp: -1 });
auditLogSchema.index({ eventCategory: 1, timestamp: -1 });

// Compound indexes for common queries
auditLogSchema.index({ eventType: 1, outcome: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, eventType: 1, timestamp: -1 });
auditLogSchema.index({ riskLevel: 1, outcome: 1, timestamp: -1 });

// TTL index for automatic deletion after retention period
auditLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Methods

/**
 * Mark log as high risk
 */
auditLogSchema.methods.markAsHighRisk = function (reason) {
    this.riskLevel = 'HIGH';
    this.riskScore = Math.max(this.riskScore, 75);
    this.details.riskReason = reason;
    return this.save();
};

/**
 * Add additional context
 */
auditLogSchema.methods.addContext = function (key, value) {
    this.details[key] = value;
    return this.save();
};

// Static Methods

/**
 * Get recent security events
 */
auditLogSchema.statics.getRecentSecurityEvents = async function (limit = 100) {
    return this.find({
        eventCategory: 'SECURITY',
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    })
        .sort({ timestamp: -1 })
        .limit(limit);
};

/**
 * Get failed login attempts
 */
auditLogSchema.statics.getFailedLogins = async function (hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    return this.aggregate([
        {
            $match: {
                eventType: 'LOGIN_FAILED',
                timestamp: { $gte: since }
            }
        },
        {
            $group: {
                _id: '$ipAddress',
                count: { $sum: 1 },
                lastAttempt: { $max: '$timestamp' },
                userIds: { $addToSet: '$userId' }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);
};

/**
 * Get suspicious activities
 */
auditLogSchema.statics.getSuspiciousActivities = async function (limit = 50) {
    return this.find({
        $or: [
            { riskLevel: { $in: ['HIGH', 'CRITICAL'] } },
            { eventType: { $in: ['FRAUD_DETECTED', 'ANOMALY_DETECTED', 'SUSPICIOUS_ACTIVITY'] } }
        ],
        timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    })
        .sort({ timestamp: -1 })
        .limit(limit);
};

/**
 * Get user activity timeline
 */
auditLogSchema.statics.getUserTimeline = async function (userId, limit = 100) {
    return this.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .select('-details -metadata');
};

/**
 * Get statistics for dashboard
 */
auditLogSchema.statics.getDashboardStats = async function (hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const stats = await this.aggregate([
        {
            $match: { timestamp: { $gte: since } }
        },
        {
            $facet: {
                totalEvents: [{ $count: 'count' }],

                byOutcome: [
                    {
                        $group: {
                            _id: '$outcome',
                            count: { $sum: 1 }
                        }
                    }
                ],

                byRiskLevel: [
                    {
                        $group: {
                            _id: '$riskLevel',
                            count: { $sum: 1 }
                        }
                    }
                ],

                byEventType: [
                    {
                        $group: {
                            _id: '$eventType',
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { count: -1 } },
                    { $limit: 10 }
                ],

                failedLogins: [
                    {
                        $match: { eventType: 'LOGIN_FAILED' }
                    },
                    { $count: 'count' }
                ],

                securityEvents: [
                    {
                        $match: { eventCategory: 'SECURITY' }
                    },
                    { $count: 'count' }
                ]
            }
        }
    ]);

    return stats[0];
};

/**
 * Prevent modification of existing logs (append-only)
 */
auditLogSchema.pre('save', function (next) {
    if (!this.isNew) {
        return next(new Error('Audit logs cannot be modified'));
    }

    // Set expiration date based on retention period
    if (!this.expiresAt) {
        this.expiresAt = new Date(Date.now() + this.retentionPeriod * 24 * 60 * 60 * 1000);
    }

    next();
});

/**
 * Prevent deletion of logs
 */
auditLogSchema.pre('remove', function (next) {
    next(new Error('Audit logs cannot be deleted manually'));
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
