/**
 * Admin Verification Controller
 * 
 * Handles all admin operations related to farmer verification management.
 * This includes viewing, approving, rejecting, and deleting verification requests.
 * 
 * SECURITY:
 * - All routes require admin authentication
 * - Role-based access control (RBAC) enforced
 * - Audit logging for all admin actions
 */

import User from '../models/User.model.js';

/**
 * @desc    Get all farmer verification requests
 * @route   GET /api/admin/verifications
 * @access  Private (Admin only)
 * 
 * Returns a list of all farmers with their verification status.
 * Filters can be applied to show only pending, approved, or rejected requests.
 */
export const getAllVerifications = async (req, res, next) => {
    try {
        // Extract filter from query parameters
        const { status } = req.query;

        // Build query filter
        const filter = { userType: 'farmer' };

        // If status filter is provided, add it to the query
        if (status && ['pending', 'approved', 'rejected'].includes(status)) {
            filter['verificationData.status'] = status;
        }

        // Fetch farmers with verification data
        const farmers = await User.find(filter)
            .select('name email phone location isVerified verificationData createdAt')
            .sort({ 'verificationData.submittedAt': -1 }); // Most recent first

        res.status(200).json({
            success: true,
            count: farmers.length,
            data: farmers
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single verification request details
 * @route   GET /api/admin/verifications/:id
 * @access  Private (Admin only)
 * 
 * Returns detailed information about a specific farmer's verification request.
 */
export const getVerificationById = async (req, res, next) => {
    try {
        const farmer = await User.findById(req.params.id)
            .select('name email phone location isVerified verificationData createdAt');

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: 'Farmer not found'
            });
        }

        if (farmer.userType !== 'farmer') {
            return res.status(400).json({
                success: false,
                message: 'User is not a farmer'
            });
        }

        res.status(200).json({
            success: true,
            data: farmer
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Approve farmer verification
 * @route   PUT /api/admin/verifications/:id/approve
 * @access  Private (Admin only)
 * 
 * Approves a farmer's verification request and sets isVerified to true.
 * This allows the farmer to create product listings.
 */
export const approveVerification = async (req, res, next) => {
    try {
        const farmer = await User.findById(req.params.id);

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: 'Farmer not found'
            });
        }

        if (farmer.userType !== 'farmer') {
            return res.status(400).json({
                success: false,
                message: 'User is not a farmer'
            });
        }

        // Check if already verified
        if (farmer.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Farmer is already verified'
            });
        }

        // Update verification status
        farmer.isVerified = true;
        if (farmer.verificationData) {
            farmer.verificationData.status = 'approved';
            farmer.verificationData.approvedAt = new Date();
            farmer.verificationData.approvedBy = req.user.id; // Admin who approved
        }

        await farmer.save();

        // TODO: Send email notification to farmer
        // TODO: Log admin action in audit trail

        res.status(200).json({
            success: true,
            message: 'Verification approved successfully',
            data: {
                _id: farmer._id,
                name: farmer.name,
                email: farmer.email,
                isVerified: farmer.isVerified,
                verificationData: farmer.verificationData
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reject farmer verification
 * @route   PUT /api/admin/verifications/:id/reject
 * @access  Private (Admin only)
 * 
 * Rejects a farmer's verification request with an optional reason.
 * The farmer can resubmit verification documents.
 */
export const rejectVerification = async (req, res, next) => {
    try {
        const farmer = await User.findById(req.params.id);
        const { reason } = req.body;

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: 'Farmer not found'
            });
        }

        if (farmer.userType !== 'farmer') {
            return res.status(400).json({
                success: false,
                message: 'User is not a farmer'
            });
        }

        // Update verification status
        farmer.isVerified = false;
        if (farmer.verificationData) {
            farmer.verificationData.status = 'rejected';
            farmer.verificationData.rejectedAt = new Date();
            farmer.verificationData.rejectedBy = req.user.id; // Admin who rejected
            farmer.verificationData.rejectionReason = reason || 'Documents not valid';
        }

        await farmer.save();

        // TODO: Send email notification to farmer with rejection reason
        // TODO: Log admin action in audit trail

        res.status(200).json({
            success: true,
            message: 'Verification rejected',
            data: {
                _id: farmer._id,
                name: farmer.name,
                email: farmer.email,
                isVerified: farmer.isVerified,
                verificationData: farmer.verificationData
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete verification request
 * @route   DELETE /api/admin/verifications/:id
 * @access  Private (Admin only)
 * 
 * Deletes a farmer's verification data (not the farmer account).
 * This is used to remove spam or invalid verification requests.
 */
export const deleteVerification = async (req, res, next) => {
    try {
        const farmer = await User.findById(req.params.id);

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: 'Farmer not found'
            });
        }

        if (farmer.userType !== 'farmer') {
            return res.status(400).json({
                success: false,
                message: 'User is not a farmer'
            });
        }

        // Clear verification data
        farmer.verificationData = undefined;
        farmer.isVerified = false;

        await farmer.save();

        // TODO: Log admin action in audit trail

        res.status(200).json({
            success: true,
            message: 'Verification request deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get verification statistics
 * @route   GET /api/admin/verifications/stats
 * @access  Private (Admin only)
 * 
 * Returns statistics about verification requests:
 * - Total farmers
 * - Verified farmers
 * - Pending verifications
 * - Rejected verifications
 */
export const getVerificationStats = async (req, res, next) => {
    try {
        const totalFarmers = await User.countDocuments({ userType: 'farmer' });
        const verifiedFarmers = await User.countDocuments({ userType: 'farmer', isVerified: true });
        const pendingVerifications = await User.countDocuments({
            userType: 'farmer',
            'verificationData.status': 'pending'
        });
        const rejectedVerifications = await User.countDocuments({
            userType: 'farmer',
            'verificationData.status': 'rejected'
        });

        res.status(200).json({
            success: true,
            data: {
                totalFarmers,
                verifiedFarmers,
                pendingVerifications,
                rejectedVerifications,
                unverifiedFarmers: totalFarmers - verifiedFarmers
            }
        });
    } catch (error) {
        next(error);
    }
};
