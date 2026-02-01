/**
 * Admin Verification Routes
 * 
 * Routes for admin to manage farmer verification requests.
 * All routes are protected and require admin role.
 * 
 * SECURITY:
 * - protect: Ensures user is authenticated
 * - restrictTo('admin'): Ensures user has admin role
 * - No verifiedFarmerOnly middleware (admins don't need verification)
 */

import express from 'express';
import {
    getAllVerifications,
    getVerificationById,
    approveVerification,
    rejectVerification,
    deleteVerification,
    getVerificationStats
} from '../controllers/adminVerification.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

/**
 * Apply authentication and admin-only middleware to all routes
 * This ensures only authenticated admins can access these endpoints
 */
router.use(protect);
router.use(restrictTo('admin'));

/**
 * GET /api/admin/verifications/stats
 * Get verification statistics (total, pending, approved, rejected)
 */
router.get('/stats', getVerificationStats);

/**
 * GET /api/admin/verifications
 * Get all verification requests with optional status filter
 * Query params: ?status=pending|approved|rejected
 */
router.get('/', getAllVerifications);

/**
 * GET /api/admin/verifications/:id
 * Get single verification request details
 */
router.get('/:id', getVerificationById);

/**
 * PUT /api/admin/verifications/:id/approve
 * Approve a farmer's verification request
 */
router.put('/:id/approve', approveVerification);

/**
 * PUT /api/admin/verifications/:id/reject
 * Reject a farmer's verification request
 * Body: { reason: string }
 */
router.put('/:id/reject', rejectVerification);

/**
 * DELETE /api/admin/verifications/:id
 * Delete a verification request (clears verification data)
 */
router.delete('/:id', deleteVerification);

export default router;
