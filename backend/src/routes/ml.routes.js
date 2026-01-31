import express from 'express';
import {
    predictPrice,
    analyzeGap,
    evaluateBuyer,
    getProfitDashboard,
    getPolicyAwareness,
    triggerAlerts,
    sealTrade,
    verifyBlockchain,
    initiateContract,
    confirmDelivery,
    getContract,
    dispatchTrade,
    sealIntegrity,
    verifyIntegrity,
    auditTransaction
} from '../controllers/mlController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { antiFraudGuard, adminReadOnly, verifiedFarmerOnly } from '../middleware/policyEngine.js';

const router = express.Router();

// Apply Admin Read-Only policy to all transactional ML routes
router.use(adminReadOnly);

/**
 * @route   POST /api/ml/predict-price
 * @desc    Get crop price prediction with XAI
 */
router.post('/predict-price', protect, antiFraudGuard, predictPrice);

/**
 * @route   POST /api/ml/analyze-gap
 * @desc    Perform Demand-Supply gap analysis
 */
router.post('/analyze-gap', protect, antiFraudGuard, analyzeGap);

/**
 * @route   POST /api/ml/buyer-trust/:buyerId
 * @desc    Evaluate buyer credibility score
 */
router.post('/buyer-trust/:buyerId', protect, evaluateBuyer);

/**
 * @route   POST /api/ml/profit-dashboard
 * @desc    Generate farmer profit dashboard
 */
router.post('/profit-dashboard', protect, restrictTo('farmer'), verifiedFarmerOnly, antiFraudGuard, getProfitDashboard);

/**
 * @route   GET /api/ml/policy-awareness
 * @desc    Check policy and MSP status
 */
router.get('/policy-awareness', protect, getPolicyAwareness);

/**
 * @route   POST /api/ml/alerts/trigger
 * @desc    Manually trigger price alert scanning
 */
router.post('/alerts/trigger', protect, triggerAlerts);

/**
 * @route   POST /api/ml/blockchain/seal
 * @desc    Permanently seal a trade on the Blockchain
 */
router.post('/blockchain/seal', protect, restrictTo('farmer'), verifiedFarmerOnly, antiFraudGuard, sealTrade);

/**
 * @route   GET /api/ml/blockchain/verify
 * @desc    Verify the integrity of the Blockchain ledger
 */
router.get('/blockchain/verify', protect, verifyBlockchain);

/**
 * @route   POST /api/ml/contracts/start-escrow
 * @desc    Lock payment in a Smart Contract Escrow
 */
router.post('/contracts/start-escrow', protect, restrictTo('buyer'), antiFraudGuard, initiateContract);

/**
 * @route   POST /api/ml/contracts/dispatch/:contractId
 * @desc    Farmer marks the product as dispatched
 */
router.post('/contracts/dispatch/:contractId', protect, restrictTo('farmer'), verifiedFarmerOnly, antiFraudGuard, dispatchTrade);

/**
 * @route   POST /api/ml/contracts/confirm-delivery/:contractId
 * @desc    Buyer confirms delivery and releases payment
 */
router.post('/contracts/confirm-delivery/:contractId', protect, restrictTo('buyer'), antiFraudGuard, confirmDelivery);

/**
 * @route   GET /api/ml/contracts/get/:contractId
 * @desc    Get current status of a Smart Contract
 */
router.get('/contracts/get/:contractId', protect, getContract);

/**
 * @route   POST /api/ml/blockchain/integrity/seal
 * @desc    Generate a cryptographic integrity seal for a trade
 */
router.post('/blockchain/integrity/seal', protect, antiFraudGuard, sealIntegrity);

/**
 * @route   POST /api/ml/blockchain/integrity/verify
 * @desc    Verify trade record against blockchain hash
 */
router.post('/blockchain/integrity/verify', protect, verifyIntegrity);

/**
 * @route   POST /api/ml/audit
 * @desc    Audit a transaction for anomalies and fraud
 */
router.post('/audit', protect, auditTransaction);

export default router;
