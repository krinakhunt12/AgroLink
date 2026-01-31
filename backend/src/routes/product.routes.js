import express from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getFarmerProducts
} from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { verifiedFarmerOnly, antiFraudGuard } from '../middleware/policyEngine.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, restrictTo('farmer'), antiFraudGuard, verifiedFarmerOnly, upload.single('image'), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, restrictTo('farmer'), antiFraudGuard, verifiedFarmerOnly, upload.single('image'), updateProduct)
    .delete(protect, restrictTo('farmer'), antiFraudGuard, deleteProduct);

router.get('/farmer/:farmerId', getFarmerProducts);

export default router;
