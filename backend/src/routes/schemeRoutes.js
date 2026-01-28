import express from 'express';
import schemeController from '../controllers/schemeController.js';

const router = express.Router();

/**
 * @route GET /api/agriculture-schemes/latest
 * @desc Get latest useful government schemes via RSS
 * @access Public
 */
router.get('/latest', schemeController.getLatestSchemes);

export default router;
