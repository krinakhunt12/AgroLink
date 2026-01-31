import mongoose from 'mongoose';

/**
 * CONSENT MANAGEMENT MODEL
 * 
 * Tracks user consent for various data processing purposes
 * following GDPR Article 6 (Lawfulness of processing)
 * 
 * Consent Principles:
 * - Freely given
 * - Specific
 * - Informed
 * - Unambiguous
 * - Withdrawable at any time
 */

const consentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Consent for different processing purposes
    consents: {
        // Essential (cannot be withdrawn - required for service)
        accountManagement: {
            granted: { type: Boolean, default: true },
            required: { type: Boolean, default: true },
            description: 'Required for account creation and management'
        },
        transactionProcessing: {
            granted: { type: Boolean, default: true },
            required: { type: Boolean, default: true },
            description: 'Required for processing orders and payments'
        },

        // Optional (can be withdrawn)
        analytics: {
            granted: { type: Boolean, default: false },
            required: { type: Boolean, default: false },
            description: 'Anonymized data for platform analytics and improvements',
            grantedAt: Date,
            withdrawnAt: Date
        },
        mlTraining: {
            granted: { type: Boolean, default: false },
            required: { type: Boolean, default: false },
            description: 'Anonymized data for ML model training (price prediction, recommendations)',
            grantedAt: Date,
            withdrawnAt: Date
        },
        marketing: {
            granted: { type: Boolean, default: false },
            required: { type: Boolean, default: false },
            description: 'Marketing communications and promotional offers',
            grantedAt: Date,
            withdrawnAt: Date
        },
        thirdPartySharing: {
            granted: { type: Boolean, default: false },
            required: { type: Boolean, default: false },
            description: 'Sharing data with trusted third-party partners',
            grantedAt: Date,
            withdrawnAt: Date
        },
        locationTracking: {
            granted: { type: Boolean, default: false },
            required: { type: Boolean, default: false },
            description: 'Location-based services and recommendations',
            grantedAt: Date,
            withdrawnAt: Date
        }
    },

    // Consent version (for tracking policy changes)
    consentVersion: {
        type: String,
        default: '1.0'
    },

    // IP address when consent was given
    consentIpAddress: String,

    // User agent when consent was given
    consentUserAgent: String,

    // Consent history (for audit trail)
    consentHistory: [{
        purpose: String,
        action: { type: String, enum: ['granted', 'withdrawn'] },
        timestamp: { type: Date, default: Date.now },
        ipAddress: String,
        version: String
    }],

    // Privacy preferences
    privacyPreferences: {
        dataRetention: {
            type: String,
            enum: ['minimal', 'standard', 'extended'],
            default: 'standard',
            description: 'How long to retain data after account closure'
        },
        communicationChannel: {
            type: String,
            enum: ['email', 'sms', 'both', 'none'],
            default: 'email'
        },
        dataExportFormat: {
            type: String,
            enum: ['json', 'csv'],
            default: 'json'
        }
    },

    // Last updated
    lastUpdated: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});

// Indexes for efficient queries
consentSchema.index({ userId: 1 });
consentSchema.index({ 'consents.analytics.granted': 1 });
consentSchema.index({ 'consents.mlTraining.granted': 1 });

// Methods

/**
 * Grant consent for a specific purpose
 */
consentSchema.methods.grantConsent = function (purpose, ipAddress, version = '1.0') {
    if (!this.consents[purpose]) {
        throw new Error(`Invalid consent purpose: ${purpose}`);
    }

    this.consents[purpose].granted = true;
    this.consents[purpose].grantedAt = new Date();
    this.consents[purpose].withdrawnAt = null;

    this.consentHistory.push({
        purpose,
        action: 'granted',
        timestamp: new Date(),
        ipAddress,
        version
    });

    this.lastUpdated = new Date();

    return this.save();
};

/**
 * Withdraw consent for a specific purpose
 */
consentSchema.methods.withdrawConsent = function (purpose, ipAddress) {
    if (!this.consents[purpose]) {
        throw new Error(`Invalid consent purpose: ${purpose}`);
    }

    if (this.consents[purpose].required) {
        throw new Error(`Cannot withdraw consent for required purpose: ${purpose}`);
    }

    this.consents[purpose].granted = false;
    this.consents[purpose].withdrawnAt = new Date();

    this.consentHistory.push({
        purpose,
        action: 'withdrawn',
        timestamp: new Date(),
        ipAddress,
        version: this.consentVersion
    });

    this.lastUpdated = new Date();

    return this.save();
};

/**
 * Check if consent is granted for a purpose
 */
consentSchema.methods.hasConsent = function (purpose) {
    return this.consents[purpose]?.granted || false;
};

/**
 * Get all granted consents
 */
consentSchema.methods.getGrantedConsents = function () {
    const granted = [];
    for (const [purpose, consent] of Object.entries(this.consents)) {
        if (consent.granted) {
            granted.push(purpose);
        }
    }
    return granted;
};

/**
 * Export consent record (for data portability)
 */
consentSchema.methods.exportConsents = function () {
    return {
        userId: this.userId,
        consents: this.consents,
        consentVersion: this.consentVersion,
        consentHistory: this.consentHistory,
        privacyPreferences: this.privacyPreferences,
        lastUpdated: this.lastUpdated
    };
};

// Static methods

/**
 * Create default consent record for new user
 */
consentSchema.statics.createDefaultConsent = async function (userId, ipAddress, userAgent) {
    const consent = new this({
        userId,
        consentIpAddress: ipAddress,
        consentUserAgent: userAgent,
        consentVersion: '1.0'
    });

    // Log initial consent
    consent.consentHistory.push({
        purpose: 'accountManagement',
        action: 'granted',
        timestamp: new Date(),
        ipAddress,
        version: '1.0'
    });

    return consent.save();
};

/**
 * Get users who consented to analytics
 */
consentSchema.statics.getUsersWithAnalyticsConsent = async function () {
    return this.find({ 'consents.analytics.granted': true }).select('userId');
};

/**
 * Get users who consented to ML training
 */
consentSchema.statics.getUsersWithMLConsent = async function () {
    return this.find({ 'consents.mlTraining.granted': true }).select('userId');
};

const Consent = mongoose.model('Consent', consentSchema);

export default Consent;
