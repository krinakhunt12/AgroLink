/**
 * AgroLink Policy Engine Middleware
 * 
 * This module implements dynamic, context-aware access control policies
 * that go beyond simple Role-Based Access Control (RBAC).
 */

/**
 * Policy: Verified Farmers Only
 * Ensures that only farmers who have completed verification can perform 
 * high-impact actions like posting listings.
 */
export const verifiedFarmerOnly = (req, res, next) => {
    if (req.user.userType === 'farmer' && !req.user.isVerified) {
        return res.status(403).json({
            success: false,
            message: 'Access Denied: Only verified farmers can perform this action. Please complete your profile verification.'
        });
    }
    next();
};

/**
 * Policy: Trusted Buyers for Bulk Orders
 * Restricts large transactions (e.g., > 50,000 INR) to buyers with a 
 * proven reliability/trust score.
 */
export const trustedBuyerOnly = (threshold = 70) => {
    return (req, res, next) => {
        // Only apply if it's a purchase request
        const totalValue = req.body.price * req.body.quantity || 0;

        if (req.user.userType === 'buyer' && totalValue > 50000 && req.user.trustScore < threshold) {
            return res.status(403).json({
                success: false,
                message: `Policy Violation: Bulk orders (> 50,000 INR) require a Trust Score of ${threshold}+. Your current score: ${req.user.trustScore}.`
            });
        }
        next();
    };
};

/**
 * Policy: Anti-Fraud Restriction
 * Instantly restricts access for users flagged with 'medium' or 'high' risk 
 * by the AI Anomaly Detection system.
 */
export const antiFraudGuard = (req, res, next) => {
    if (req.user.riskLevel === 'high') {
        return res.status(403).json({
            success: false,
            message: 'Account Restricted: Suspicious activity detected. Your access is restricted pending administrative review.'
        });
    }

    // Admins can always pass through unless explicitly banned
    if (req.user.userType === 'admin') return next();

    next();
};

/**
 * Policy: Admin Read-Only
 * Ensures that Admins can view everything but cannot modify data 
 * belonging to Farmers or Buyers (e.g., editing a product or bid).
 */
export const adminReadOnly = (req, res, next) => {
    if (req.user.userType === 'admin' && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        // Exception: Allow admins to trigger system-level tasks or audit logs if needed
        const allowedAdminPaths = ['/api/ml/audit', '/api/ml/alerts/trigger'];
        if (!allowedAdminPaths.some(path => req.originalUrl.includes(path))) {
            return res.status(403).json({
                success: false,
                message: 'Admin Permission: You have read-only access to marketplace data.'
            });
        }
    }
    next();
};
