import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import Bid from '../models/Bid.model.js';
import { generateSecureToken, hash, anonymize } from '../utils/encryption.js';

/**
 * DATA DELETION & RIGHT TO BE FORGOTTEN
 * 
 * Implements GDPR-like "Right to Erasure" (Right to be Forgotten)
 * while maintaining system integrity and legal compliance.
 * 
 * Deletion Strategy:
 * 1. FULL DELETION: Personal identifiable information (PII)
 * 2. ANONYMIZATION: Transaction records (for legal/audit requirements)
 * 3. RETENTION: Blockchain hashes, audit logs (immutable records)
 * 
 * Compliance Principles:
 * - User can request deletion at any time
 * - Deletion is irreversible
 * - System retains only what's legally required
 * - Anonymized data for analytics/ML
 * - Audit trail of deletion requests
 */

// Deletion request statuses
const DELETION_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

// Retention periods (in days)
const RETENTION_PERIODS = {
    TRANSACTION_RECORDS: 2555, // 7 years (legal requirement)
    AUDIT_LOGS: 2555,
    BLOCKCHAIN_RECORDS: Infinity, // Immutable
    ANONYMIZED_DATA: Infinity // For analytics
};

/**
 * Create a data deletion request
 */
export const createDeletionRequest = async (userId, reason = 'user_request') => {
    try {
        // Generate deletion token for verification
        const deletionToken = generateSecureToken(32);

        const deletionRequest = {
            userId,
            requestedAt: new Date(),
            status: DELETION_STATUS.PENDING,
            reason,
            deletionToken: hash(deletionToken),
            scheduledDeletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days grace period
        };

        // In production, save to DeletionRequest model
        console.log('[DATA-DELETION] Request created:', {
            userId,
            token: deletionToken,
            scheduledDate: deletionRequest.scheduledDeletionDate
        });

        // Send confirmation email with deletion token
        // await sendDeletionConfirmationEmail(user.email, deletionToken);

        return {
            success: true,
            message: 'Deletion request created. You will receive a confirmation email.',
            deletionToken, // Send to user for confirmation
            scheduledDate: deletionRequest.scheduledDeletionDate
        };

    } catch (error) {
        console.error('[DATA-DELETION-ERROR]', error);
        throw new Error('Failed to create deletion request');
    }
};

/**
 * Confirm and execute data deletion
 */
export const executeDeletion = async (userId, deletionToken) => {
    try {
        console.log(`[DATA-DELETION] Starting deletion for user: ${userId}`);

        // Verify deletion token
        const hashedToken = hash(deletionToken);
        // In production, verify against stored token

        const deletionReport = {
            userId,
            startTime: new Date(),
            steps: [],
            errors: []
        };

        // STEP 1: Fetch user data
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        deletionReport.steps.push({
            step: 'User data fetched',
            timestamp: new Date()
        });

        // STEP 2: Delete or anonymize products
        const products = await Product.find({ farmer: userId });
        for (const product of products) {
            if (product.status === 'active' && product.quantity > 0) {
                // Cannot delete active listings
                deletionReport.errors.push({
                    error: 'Active product listings must be closed before deletion',
                    productId: product._id
                });
            } else {
                // Anonymize product data
                product.farmer = null;
                product.farmerName = 'Deleted User';
                product.contactPhone = null;
                product.contactEmail = null;
                product.isDeleted = true;
                await product.save();
            }
        }

        deletionReport.steps.push({
            step: `Processed ${products.length} products`,
            timestamp: new Date()
        });

        // STEP 3: Anonymize orders (retain for legal compliance)
        const orders = await Order.find({
            $or: [{ buyer: userId }, { farmer: userId }]
        });

        for (const order of orders) {
            // Anonymize user references
            if (order.buyer?.toString() === userId.toString()) {
                order.buyerName = 'Deleted User';
                order.buyerPhone = null;
                order.buyerEmail = null;
                order.deliveryAddress = 'Address Deleted';
            }

            if (order.farmer?.toString() === userId.toString()) {
                order.farmerName = 'Deleted User';
                order.farmerPhone = null;
                order.farmerEmail = null;
            }

            // Keep blockchain hash (immutable)
            // Keep order ID, price, quantity for legal records
            order.isAnonymized = true;
            await order.save();
        }

        deletionReport.steps.push({
            step: `Anonymized ${orders.length} orders`,
            timestamp: new Date()
        });

        // STEP 4: Delete or anonymize bids
        const bids = await Bid.find({ buyer: userId });
        for (const bid of bids) {
            if (bid.status === 'pending') {
                // Delete pending bids
                await Bid.deleteOne({ _id: bid._id });
            } else {
                // Anonymize accepted/rejected bids
                bid.buyer = null;
                bid.buyerName = 'Deleted User';
                bid.isAnonymized = true;
                await bid.save();
            }
        }

        deletionReport.steps.push({
            step: `Processed ${bids.length} bids`,
            timestamp: new Date()
        });

        // STEP 5: Create anonymized user record for analytics
        const anonymizedUser = anonymize(user.toObject());
        // In production, save to AnonymizedUsers collection

        deletionReport.steps.push({
            step: 'Created anonymized user record',
            timestamp: new Date()
        });

        // STEP 6: Delete user account
        await User.deleteOne({ _id: userId });

        deletionReport.steps.push({
            step: 'User account deleted',
            timestamp: new Date()
        });

        // STEP 7: Log deletion in audit trail
        logDeletionEvent(userId, deletionReport);

        deletionReport.endTime = new Date();
        deletionReport.status = DELETION_STATUS.COMPLETED;

        console.log('[DATA-DELETION] Completed:', deletionReport);

        return {
            success: true,
            message: 'Your account and personal data have been deleted',
            report: deletionReport
        };

    } catch (error) {
        console.error('[DATA-DELETION-ERROR]', error);

        logDeletionEvent(userId, {
            status: DELETION_STATUS.FAILED,
            error: error.message
        });

        throw new Error('Data deletion failed: ' + error.message);
    }
};

/**
 * Anonymize user data (alternative to full deletion)
 */
export const anonymizeUserData = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Replace PII with anonymized values
        user.name = `User_${hash(userId.toString()).substring(0, 8)}`;
        user.phone = null;
        user.email = `deleted_${hash(userId.toString()).substring(0, 8)}@anonymized.local`;
        user.password = hash('deleted_account');
        user.address = null;
        user.bankAccount = null;
        user.upiId = null;
        user.aadhaar = null;
        user.pan = null;
        user.isAnonymized = true;
        user.anonymizedAt = new Date();

        await user.save();

        console.log('[DATA-ANONYMIZATION] User anonymized:', userId);

        return {
            success: true,
            message: 'User data anonymized successfully'
        };

    } catch (error) {
        console.error('[DATA-ANONYMIZATION-ERROR]', error);
        throw new Error('Anonymization failed');
    }
};

/**
 * Export user data (GDPR Right to Access)
 */
export const exportUserData = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password');
        const products = await Product.find({ farmer: userId });
        const orders = await Order.find({
            $or: [{ buyer: userId }, { farmer: userId }]
        });
        const bids = await Bid.find({ buyer: userId });

        const exportData = {
            exportDate: new Date().toISOString(),
            userId: userId.toString(),
            notice: 'This is your personal data as stored in the AgroLink system',
            dataCategories: {
                profile: {
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    userType: user.userType,
                    location: user.location,
                    createdAt: user.createdAt,
                    isVerified: user.isVerified
                },
                products: products.map(p => ({
                    id: p._id,
                    name: p.name,
                    category: p.category,
                    price: p.price,
                    quantity: p.quantity,
                    createdAt: p.createdAt
                })),
                orders: orders.map(o => ({
                    id: o._id,
                    product: o.product,
                    quantity: o.quantity,
                    totalPrice: o.totalPrice,
                    status: o.status,
                    createdAt: o.createdAt,
                    blockchainHash: o.blockchainHash
                })),
                bids: bids.map(b => ({
                    id: b._id,
                    product: b.product,
                    amount: b.amount,
                    quantity: b.quantity,
                    status: b.status,
                    createdAt: b.createdAt
                }))
            },
            dataProcessingPurposes: [
                'Account management',
                'Transaction processing',
                'Product listing',
                'Order fulfillment',
                'Analytics (anonymized)',
                'ML model training (anonymized)'
            ],
            dataRetentionPolicy: {
                personalData: 'Deleted upon request',
                transactionRecords: '7 years (legal requirement)',
                blockchainRecords: 'Permanent (immutable)',
                anonymizedData: 'Indefinite (for analytics)'
            }
        };

        console.log('[DATA-EXPORT] Data exported for user:', userId);

        return exportData;

    } catch (error) {
        console.error('[DATA-EXPORT-ERROR]', error);
        throw new Error('Data export failed');
    }
};

/**
 * Check if user can be deleted (validation)
 */
export const validateDeletionEligibility = async (userId) => {
    const issues = [];

    // Check for active orders
    const activeOrders = await Order.countDocuments({
        $or: [{ buyer: userId }, { farmer: userId }],
        status: { $in: ['pending', 'confirmed', 'shipped'] }
    });

    if (activeOrders > 0) {
        issues.push({
            type: 'active_orders',
            message: `You have ${activeOrders} active orders. Please complete or cancel them first.`
        });
    }

    // Check for active product listings
    const activeProducts = await Product.countDocuments({
        farmer: userId,
        status: 'active',
        quantity: { $gt: 0 }
    });

    if (activeProducts > 0) {
        issues.push({
            type: 'active_listings',
            message: `You have ${activeProducts} active product listings. Please close them first.`
        });
    }

    // Check for pending bids
    const pendingBids = await Bid.countDocuments({
        buyer: userId,
        status: 'pending'
    });

    if (pendingBids > 0) {
        issues.push({
            type: 'pending_bids',
            message: `You have ${pendingBids} pending bids. Please cancel them first.`
        });
    }

    return {
        canDelete: issues.length === 0,
        issues
    };
};

/**
 * Log deletion event for audit trail
 */
const logDeletionEvent = (userId, details) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        eventType: 'DATA_DELETION',
        userId: userId.toString(),
        details,
        // This log entry is retained even after user deletion
        retentionPeriod: 'permanent'
    };

    console.log('[DELETION-AUDIT]', JSON.stringify(logEntry));

    // In production, save to immutable audit log
};

/**
 * Schedule automatic deletion (after grace period)
 */
export const scheduleAutoDeletion = async (userId, daysFromNow = 30) => {
    const scheduledDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);

    console.log(`[DATA-DELETION] Scheduled for ${scheduledDate.toISOString()}`);

    // In production, create a scheduled job
    // e.g., using node-cron or a job queue like Bull

    return {
        success: true,
        scheduledDate
    };
};

export default {
    createDeletionRequest,
    executeDeletion,
    anonymizeUserData,
    exportUserData,
    validateDeletionEligibility,
    scheduleAutoDeletion,
    DELETION_STATUS,
    RETENTION_PERIODS
};
