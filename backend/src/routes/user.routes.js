import express from 'express';
import { getUserProfile, updateProfile, deleteAccount, submitVerification } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/:id', getUserProfile);

// Protected routes (require authentication)
router.put('/profile', protect, upload.single('avatar'), updateProfile);

/**
 * Verification route - IMPORTANT: No verifiedFarmerOnly middleware
 * This allows unverified farmers to submit their verification documents
 */
router.post('/verify', protect, upload.fields([
    { name: 'govtIdProof', maxCount: 1 },
    { name: 'landOwnershipProof', maxCount: 1 }
]), submitVerification);

router.delete('/me', protect, deleteAccount);

export default router;
