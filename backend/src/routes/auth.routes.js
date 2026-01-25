import express from 'express';
import { register, login, getMe, googleLogin, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:resetToken', authLimiter, resetPassword);
router.get('/me', protect, getMe);

export default router;
