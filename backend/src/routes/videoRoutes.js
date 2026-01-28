import express from 'express';
import videoController from '../controllers/videoController.js';

const router = express.Router();

/**
 * @route GET /api/videos/latest
 * @desc Get latest useful agriculture videos via RSS
 * @access Public
 */
router.get('/latest', videoController.getLatestVideos);

export default router;
