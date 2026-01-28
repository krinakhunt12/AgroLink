import express from 'express';
import newsController from '../controllers/newsController.js';

const router = express.Router();

/**
 * @route GET /api/news/latest
 * @desc Get latest useful agriculture news via RSS
 * @access Public
 */
router.get('/latest', newsController.getLatestNews);

export default router;
