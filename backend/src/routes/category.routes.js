// Simple category routes - categories are static in frontend
import express from 'express';

const router = express.Router();

const CATEGORIES = [
    'તમામ',
    'અનાજ',
    'શાકભાજી',
    'દાળ અને કઠોળ',
    'મસાલા',
    'ફળ',
    'ઓર્ગેનિક',
    'ડેરી પ્રોડક્ટ્સ',
    'બિયારણ',
    'ખેતી ઓજારો'
];

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: CATEGORIES
    });
});

export default router;
