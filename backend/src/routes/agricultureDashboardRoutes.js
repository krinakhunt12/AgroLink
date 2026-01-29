import express from 'express';
import agricultureDashboardController from '../controllers/agricultureDashboardController.js';
import { preferenceMiddleware } from '../middleware/preferenceMiddleware.js';

const router = express.Router();

/**
 * @route GET /api/agriculture/dashboard
 * @desc Get categorized, ranked, and filtered agriculture information
 * @access Public
 */
router.get('/dashboard', preferenceMiddleware, agricultureDashboardController.getDashboardData);

export default router;
