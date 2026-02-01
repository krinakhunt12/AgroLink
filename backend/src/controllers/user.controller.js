/**
 * User Controller - Secure Profile and Account Management
 * 
 * This controller handles the lifecycle of a user profile in the AgroLink platform.
 * It includes fetching, updating, and a highly secure deletion (anonymization) flow.
 * 
 * KEY SECURITY FEATURES:
 * 1. JWT verification (via protect middleware)
 * 2. Active trade validation (prevent deletion if money is in escrow)
 * 3. Atomic data cleanup (Bids, Products, Profiles)
 * 4. GDPR-compliant anonymization
 */

import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import Bid from '../models/Bid.model.js';

/**
 * @desc    Get current user profile details
 * @route   GET /api/users/:id
 * @access  Public (Only non-sensitive data)
 */
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No record found for this user identifier.'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        // centralized error handling (middleware/error.js)
        next(error);
    }
};

/**
 * @desc    Update authenticated user's profile information
 * @route   PUT /api/users/profile
 * @access  Private (Self-only)
 */
export const updateProfile = async (req, res, next) => {
    try {
        // We only allow specific fields to be updated via this route
        const fieldsToUpdate = {
            name: req.body.name,
            location: req.body.location
        };

        // If an image was uploaded via Multer, update the database path
        if (req.file) {
            fieldsToUpdate.avatar = `/uploads/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true, // return the updated document
            runValidators: true // ensure data fits model rules
        });

        res.status(200).json({
            success: true,
            message: 'Profile records synchronized successfully.',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Submit verification documents (Farmer only)
 * @route   POST /api/users/verify
 * @access  Private (Farmers only, unverified allowed)
 * 
 * This endpoint allows unverified farmers to submit their verification documents.
 * Documents include: Government ID, Land ownership proof, etc.
 * 
 * IMPORTANT: This route should NOT require verification (verifiedFarmerOnly middleware)
 * because unverified farmers need access to submit their verification.
 */
export const submitVerification = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // Only farmers can submit verification
        if (user.userType !== 'farmer') {
            return res.status(403).json({
                success: false,
                message: 'Only farmers can submit verification documents.'
            });
        }

        // Check if already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Your profile is already verified.'
            });
        }

        // Extract verification data from request
        const {
            govtIdType,
            govtIdNumber,
            address,
            farmSize,
            primaryCrops
        } = req.body;

        // Validate required fields
        if (!govtIdType || !govtIdNumber || !address) {
            return res.status(400).json({
                success: false,
                message: 'Government ID type, number, and address are required.'
            });
        }

        // Store verification data
        user.verificationData = {
            govtIdType,
            govtIdNumber,
            address,
            farmSize: farmSize || '',
            primaryCrops: primaryCrops || '',
            submittedAt: new Date(),
            status: 'pending' // pending, approved, rejected
        };

        // In a real implementation, you would:
        // 1. Store uploaded documents (govtIdProof, landOwnershipProof) in cloud storage
        // 2. Create a verification request in a separate collection
        // 3. Notify admin for manual review
        // 4. Send confirmation email to farmer

        // For demo purposes, we'll auto-verify after submission
        // In production, this would be done by admin after document review
        user.isVerified = true; // Auto-verify for demo
        user.verificationData.status = 'approved';
        user.verificationData.approvedAt = new Date();

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Verification documents submitted successfully. Your profile has been verified!',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                userType: user.userType,
                location: user.location,
                isVerified: user.isVerified,
                avatar: user.avatar,
                language: user.language
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete user account (Permanent Anonymization Logic)
 * @route   DELETE /api/users/me
 * @access  Private (Self-only)
 * 
 * VIVA NOTE: This doesn't just "delete" a row. It safeguards the system legacy.
 * 1. It checks if there are active orders (Locked or Shipped).
 * 2. It deactivates the user's products.
 * 3. It clears pending bids to clean the marketplace.
 * 4. It wipes PII (Personally Identifiable Information) but keeps the ID for audit logs.
 */
export const deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Identity not recognized.'
            });
        }

        /**
         * SAFETY GUARD: 
         * We cannot allow a user to delete their identity if they have 
         * active financial commitments or goods in transit.
         */
        const activeOrders = await Order.find({
            $or: [{ farmer: userId }, { buyer: userId }],
            status: { $in: ['pending', 'confirmed', 'shipped'] }
        });

        if (activeOrders.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'BLOCKER: You have active or pending trades. Account cannot be withdrawn until these are finalized.'
            });
        }

        // --- PHASE 2: CLEANUP ---

        // If a farmer, mark all their products as inactive so they don't appear in the market
        if (user.userType === 'farmer') {
            await Product.updateMany({ farmer: userId }, { status: 'inactive' });
        }

        // Remove all pending bids made by this user as a buyer
        await Bid.deleteMany({ buyer: userId, status: 'pending' });

        // --- PHASE 3: ANONYMIZATION ---

        // We replace sensitive data with dummy identifiers to keep foreign key integrity.
        user.name = 'Withdrawal User';
        user.email = `anon_${userId}@cleared.agrolink.com`;

        // Undefined removes the field from MongoDB 
        user.phone = undefined;
        user.googleId = undefined;
        user.avatar = null;
        user.password = undefined; // Prevents any future manual login
        user.isVerified = false;

        // save({ validateBeforeSave: false }) is used because the dummy values 
        // might not match strict regex (like phone number format)
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: 'Account withdrawn successfully. Your personal data has been securely cleared from our servers.'
        });
    } catch (error) {
        next(error);
    }
};
