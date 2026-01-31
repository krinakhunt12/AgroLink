import express from 'express';
import { getUserProfile, updateProfile, deleteAccount } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.delete('/me', protect, deleteAccount);
router.get('/:id', getUserProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

export default router;
