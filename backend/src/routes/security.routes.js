import express from 'express';
import {
    zeroTrustAuth,
    contextualAccessControl,
    requestIntegrityCheck,
    revokeSession,
    clearSuspiciousIP,
    getSecurityMetrics
} from '../middleware/zeroTrust.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * ZERO-TRUST SECURITY DEMONSTRATION ROUTES
 * 
 * These routes showcase how to apply the Zero-Trust security architecture
 * to different types of endpoints with varying security requirements.
 */

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

/**
 * Health check endpoint - No security required
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// AUTHENTICATED ROUTES (Basic Zero-Trust)
// ============================================

/**
 * Get user profile - Requires authentication only
 * Security Layers: 1-9 (via zeroTrustAuth)
 */
router.get('/profile',
    zeroTrustAuth,
    (req, res) => {
        res.json({
            success: true,
            data: {
                id: req.user._id,
                name: req.user.name,
                userType: req.user.userType,
                email: req.user.email,
                isVerified: req.user.isVerified
            }
        });
    }
);

/**
 * Update user profile - Requires authentication + request integrity
 * Security Layers: 1-9 + Request Integrity Check
 */
router.put('/profile',
    zeroTrustAuth,
    requestIntegrityCheck,
    async (req, res) => {
        try {
            // Update user logic here
            res.json({
                success: true,
                message: 'Profile updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update profile'
            });
        }
    }
);

// ============================================
// ROLE-BASED ROUTES (Contextual Access Control)
// ============================================

/**
 * Farmer-only route - Create product listing
 * Security Layers: Full Zero-Trust + RBAC + Request Integrity
 */
router.post('/farmer/products',
    zeroTrustAuth,
    contextualAccessControl(['farmer']),
    requestIntegrityCheck,
    async (req, res) => {
        try {
            // Create product logic
            res.json({
                success: true,
                message: 'Product created successfully',
                data: req.body
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create product'
            });
        }
    }
);

/**
 * Buyer-only route - Place order
 * Security Layers: Full Zero-Trust + RBAC + Request Integrity
 */
router.post('/buyer/orders',
    zeroTrustAuth,
    contextualAccessControl(['buyer']),
    requestIntegrityCheck,
    async (req, res) => {
        try {
            // Create order logic
            res.json({
                success: true,
                message: 'Order placed successfully',
                data: req.body
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to place order'
            });
        }
    }
);

/**
 * Multi-role route - Both farmers and buyers can access
 * Security Layers: Full Zero-Trust + Multi-role RBAC
 */
router.get('/marketplace/products',
    zeroTrustAuth,
    contextualAccessControl(['farmer', 'buyer']),
    async (req, res) => {
        try {
            // Get products logic
            res.json({
                success: true,
                data: [],
                userType: req.user.userType
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch products'
            });
        }
    }
);

// ============================================
// ADMIN ROUTES (Highest Security Level)
// ============================================

/**
 * Admin-only route - View all users
 * Security Layers: Full Zero-Trust + Admin RBAC + Request Integrity
 */
router.get('/admin/users',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    requestIntegrityCheck,
    async (req, res) => {
        try {
            // Get all users logic
            res.json({
                success: true,
                data: [],
                message: 'Admin access granted'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch users'
            });
        }
    }
);

/**
 * Admin route - Delete user (Critical operation)
 * Security Layers: Full Zero-Trust + Admin RBAC + Request Integrity
 */
router.delete('/admin/users/:userId',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    requestIntegrityCheck,
    async (req, res) => {
        try {
            const { userId } = req.params;

            // Log critical admin action
            console.log(`[CRITICAL-ADMIN-ACTION] User ${req.user._id} deleting user ${userId}`);

            // Delete user logic
            res.json({
                success: true,
                message: `User ${userId} deleted successfully`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete user'
            });
        }
    }
);

// ============================================
// SECURITY MANAGEMENT ROUTES (Admin Only)
// ============================================

/**
 * Get security metrics and statistics
 */
router.get('/admin/security/metrics',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    (req, res) => {
        const metrics = getSecurityMetrics();
        res.json({
            success: true,
            data: metrics
        });
    }
);

/**
 * Clear suspicious IP flag (Admin action)
 */
router.post('/admin/security/clear-ip',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    requestIntegrityCheck,
    (req, res) => {
        const { ip } = req.body;

        if (!ip) {
            return res.status(400).json({
                success: false,
                message: 'IP address is required'
            });
        }

        clearSuspiciousIP(ip);

        console.log(`[ADMIN-ACTION] ${req.user.name} cleared suspicious flag for IP: ${ip}`);

        res.json({
            success: true,
            message: `Suspicious flag cleared for IP: ${ip}`
        });
    }
);

/**
 * Revoke user session (Admin action or user logout)
 */
router.post('/admin/security/revoke-session',
    zeroTrustAuth,
    contextualAccessControl(['admin']),
    requestIntegrityCheck,
    (req, res) => {
        const { userId, issuedAt } = req.body;

        if (!userId || !issuedAt) {
            return res.status(400).json({
                success: false,
                message: 'userId and issuedAt are required'
            });
        }

        revokeSession(userId, issuedAt);

        console.log(`[ADMIN-ACTION] ${req.user.name} revoked session for user: ${userId}`);

        res.json({
            success: true,
            message: 'Session revoked successfully'
        });
    }
);

// ============================================
// SESSION MANAGEMENT ROUTES
// ============================================

/**
 * User logout - Revoke own session
 */
router.post('/auth/logout',
    zeroTrustAuth,
    (req, res) => {
        try {
            // Extract token info
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);

            // Revoke the session
            revokeSession(decoded.id, decoded.iat);

            console.log(`[SESSION] User ${req.user.name} logged out`);

            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
    }
);

/**
 * Refresh authentication token
 */
router.post('/auth/refresh-token',
    zeroTrustAuth,
    (req, res) => {
        try {
            // Generate new token
            const newToken = jwt.sign(
                { id: req.user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '7d' }
            );

            console.log(`[SESSION] Token refreshed for user ${req.user.name}`);

            res.json({
                success: true,
                token: newToken,
                message: 'Token refreshed successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Token refresh failed'
            });
        }
    }
);

// ============================================
// TESTING ROUTES (Development Only)
// ============================================

/**
 * Test route to demonstrate security failure handling
 * This route intentionally triggers various security checks
 */
if (process.env.NODE_ENV === 'development') {
    router.get('/test/security-layers',
        zeroTrustAuth,
        requestIntegrityCheck,
        (req, res) => {
            res.json({
                success: true,
                message: 'All security layers passed',
                securityContext: req.securityContext,
                user: {
                    id: req.user._id,
                    name: req.user.name,
                    userType: req.user.userType
                }
            });
        }
    );
}

export default router;
