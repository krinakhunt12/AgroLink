import express from 'express';
import {
    createBid,
    getProductBids,
    updateBidStatus,
    getMyBids
} from '../controllers/bid.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, restrictTo('buyer'), createBid);
router.get('/my-bids', protect, restrictTo('buyer'), getMyBids);
router.get('/product/:productId', protect, restrictTo('farmer'), getProductBids);
router.put('/:id', protect, restrictTo('farmer'), updateBidStatus);

export default router;
