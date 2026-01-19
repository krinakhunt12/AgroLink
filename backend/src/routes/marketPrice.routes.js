import express from 'express';
import * as marketPriceController from '../controllers/marketPrice.controller.js';

const router = express.Router();

// Test endpoint - should be first to avoid conflicts
router.get('/test', marketPriceController.testApiConnection);

// Get all market prices with optional filters
router.get('/', marketPriceController.getMarketPrices);

// Get unique states
router.get('/states', marketPriceController.getStates);

// Get unique commodities
router.get('/commodities', marketPriceController.getCommodities);

// Get districts by state
router.get('/districts/:state', marketPriceController.getDistrictsByState);

// Get markets by district
router.get('/markets/:state/:district', marketPriceController.getMarketsByDistrict);

// Get commodity statistics
router.get('/stats/:commodity', marketPriceController.getCommodityStats);

// Compare prices across markets
router.get('/compare/:commodity', marketPriceController.comparePrices);

// Search with advanced filters
router.post('/search', marketPriceController.searchMarketPrices);

export default router;
