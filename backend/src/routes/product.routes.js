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

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, restrictTo('farmer'), upload.single('image'), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, restrictTo('farmer'), upload.single('image'), updateProduct)
    .delete(protect, restrictTo('farmer'), deleteProduct);

router.get('/farmer/:farmerId', getFarmerProducts);

export default router;
