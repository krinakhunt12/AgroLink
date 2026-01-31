import mlService from '../services/mlService.js';

/**
 * Controller to handle all Intelligent ML requests
 */
export const predictPrice = async (req, res, next) => {
    try {
        const result = await mlService.predictPrice(req.body);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const analyzeGap = async (req, res, next) => {
    try {
        const result = await mlService.analyzeGap(req.body);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const evaluateBuyer = async (req, res, next) => {
    try {
        const { buyerId } = req.params;
        const result = await mlService.evaluateBuyer(buyerId, req.body);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getProfitDashboard = async (req, res, next) => {
    try {
        const result = await mlService.getProfitDashboard(req.body);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getPolicyAwareness = async (req, res, next) => {
    try {
        const result = await mlService.getPolicyAwareness(req.query);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const triggerAlerts = async (req, res, next) => {
    try {
        const result = await mlService.processAlerts();
        res.status(200).json({
            success: true,
            message: 'Alert processing triggered',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const sealTrade = async (req, res, next) => {
    try {
        const result = await mlService.sealTrade(req.body);
        res.status(200).json({
            success: true,
            message: 'Trade permanently sealed on Blockchain',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const verifyBlockchain = async (req, res, next) => {
    try {
        const result = await mlService.verifyBlockchain();
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const initiateContract = async (req, res, next) => {
    try {
        const result = await mlService.initiateContract(req.body);
        res.status(200).json({
            success: true,
            message: 'Smart Contract Escrow Initiated. Payment Locked.',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const dispatchTrade = async (req, res, next) => {
    try {
        const { contractId } = req.params;
        // The middleware ensures only farmers reach here, but we can log for security
        console.log(`[Trade-Security] Dispatch initiated by Farmer: ${req.user._id} for Contract: ${contractId}`);

        const result = await mlService.dispatchTrade(contractId);
        res.status(200).json({
            success: true,
            message: 'Crop marked as DISPATCHED on the Blockchain',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const confirmDelivery = async (req, res, next) => {
    try {
        const { contractId } = req.params;
        console.log(`[Trade-Security] Delivery confirmation initiated by Buyer: ${req.user._id} for Contract: ${contractId}`);

        const result = await mlService.confirmDelivery(contractId);
        res.status(200).json({
            success: true,
            message: 'Delivery Confirmed. Payment Released to Farmer via Smart Contract.',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getContract = async (req, res, next) => {
    try {
        const { contractId } = req.params;
        const result = await mlService.getContract(contractId);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const sealIntegrity = async (req, res, next) => {
    try {
        const result = await mlService.sealIntegrity(req.body);
        res.status(200).json({
            success: true,
            message: 'Cryptographic Integrity Seal generated',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const verifyIntegrity = async (req, res, next) => {
    try {
        const result = await mlService.verifyIntegrity(req.body);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const auditTransaction = async (req, res, next) => {
    try {
        const result = await mlService.auditTransaction(req.body);
        res.status(200).json({
            success: true,
            message: 'AI Anomaly Detection Audit Complete',
            data: result
        });
    } catch (error) {
        next(error);
    }
};
