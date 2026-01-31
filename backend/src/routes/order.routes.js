import express from 'express';
import {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus
} from '../controllers/order.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { trustedBuyerOnly, antiFraudGuard } from '../middleware/policyEngine.js';

const router = express.Router();

router.route('/')
    .get(protect, getOrders)
    .post(protect, restrictTo('buyer'), antiFraudGuard, trustedBuyerOnly(75), createOrder);

router.route('/:id')
    .get(protect, getOrder)
    .put(protect, restrictTo('farmer'), antiFraudGuard, updateOrderStatus);

export default router;
