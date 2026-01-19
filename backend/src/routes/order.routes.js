import express from 'express';
import {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus
} from '../controllers/order.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, getOrders)
    .post(protect, restrictTo('buyer'), createOrder);

router.route('/:id')
    .get(protect, getOrder)
    .put(protect, restrictTo('farmer'), updateOrderStatus);

export default router;
