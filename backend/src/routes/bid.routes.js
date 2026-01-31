import express from 'express';
import {
    createBid,
    getProductBids,
    updateBidStatus,
    getMyBids
} from '../controllers/bid.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { antiFraudGuard, verifiedFarmerOnly } from '../middleware/policyEngine.js';

const router = express.Router();

router.post('/', protect, restrictTo('buyer'), antiFraudGuard, createBid);
router.get('/my-bids', protect, restrictTo('buyer'), getMyBids);
router.get('/product/:productId', protect, restrictTo('farmer'), getProductBids);
router.put('/:id', protect, restrictTo('farmer'), antiFraudGuard, verifiedFarmerOnly, updateBidStatus);

export default router;
