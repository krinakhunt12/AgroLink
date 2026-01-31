import axios from 'axios';
import NodeCache from 'node-cache';
import crypto from 'crypto';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const ML_SERVICE_API_KEY = process.env.ML_SERVICE_API_KEY || 'agrolink_secure_ml_key_2026';
const ML_SERVICE_SECRET = process.env.ML_SERVICE_SECRET || 'super_secret_ml_protection_code';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minute cache

class MLService {
    constructor() {
        this.api = axios.create({
            baseURL: ML_SERVICE_URL,
            timeout: 10000, // 10s timeout
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add Security Interceptor: Every request to the ML service must be signed
        this.api.interceptors.request.use((config) => {
            const timestamp = Math.floor(Date.now() / 1000).toString();
            const body = config.data ? JSON.stringify(config.data) : '';
            const path = config.url;

            // Signature Logic: HMAC_SHA256(Secret, Timestamp + Path + Body)
            const payload = `${timestamp}${path}${body}`;
            const signature = crypto
                .createHmac('sha256', ML_SERVICE_SECRET)
                .update(payload)
                .digest('hex');

            config.headers['X-ML-API-Key'] = ML_SERVICE_API_KEY;
            config.headers['X-ML-Timestamp'] = timestamp;
            config.headers['X-ML-Signature'] = signature;

            return config;
        });
    }

    /**
     * Get crop price prediction with XAI
     */
    async predictPrice(data) {
        const cacheKey = `price_${JSON.stringify(data)}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.api.post('/api/predict-price', data);
            cache.set(cacheKey, response.data);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Analyze Demand-Supply Gap
     */
    async analyzeGap(data) {
        const cacheKey = `gap_${JSON.stringify(data)}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.api.post('/api/analyze-gap', data);
            cache.set(cacheKey, response.data);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Evaluate Buyer Trust
     */
    async evaluateBuyer(buyerId, history) {
        const cacheKey = `trust_${buyerId}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.api.post(`/api/buyer-trust/${buyerId}`, history);
            cache.set(cacheKey, response.data);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Generate Profit Dashboard Analytics
     */
    async getProfitDashboard(transactions) {
        try {
            const response = await this.api.post('/api/profit-dashboard', transactions);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Get Policy & MSP Awareness analysis
     */
    async getPolicyAwareness(params) {
        const cacheKey = `policy_${JSON.stringify(params)}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.api.get('/api/policy-awareness', { params });
            cache.set(cacheKey, response.data);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Seal a trade on the Blockchain
     */
    async sealTrade(tradeData) {
        try {
            const response = await this.api.post('/api/blockchain/seal-trade', tradeData);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Seal a transaction on the Blockchain for audit and non-repudiation
     */
    async sealIntegrity(data) {
        try {
            const response = await this.api.post('/api/blockchain/seal-integrity', data);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Verify a transaction's integrity against the Blockchain ledger
     */
    async verifyIntegrity(data) {
        try {
            const response = await this.api.post('/api/blockchain/verify-integrity', data);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Verify Blockchain Integrity
     */
    async verifyBlockchain() {
        try {
            const response = await this.api.get('/api/blockchain/verify-ledger');
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Initiate a Smart Contract (Escrow)
     */
    async initiateContract(contractData) {
        try {
            const response = await this.api.post('/api/contracts/initiate', contractData);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Mark a trade as Dispatched (Farmer action)
     */
    async dispatchTrade(contractId) {
        try {
            const response = await this.api.post(`/api/contracts/dispatch/${contractId}`);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Confirm Delivery and Release Payment
     */
    async confirmDelivery(contractId) {
        try {
            const response = await this.api.post(`/api/contracts/confirm/${contractId}`);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Get Contract Current Status
     */
    async getContract(contractId) {
        try {
            const response = await this.api.get(`/api/contracts/${contractId}`);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Trigger Background Alert Process
     */
    async processAlerts() {
        try {
            const response = await this.api.post('/api/alerts/process');
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Audit a transaction for potential anomalies or fraud
     */
    async auditTransaction(data) {
        try {
            const response = await this.api.post('/api/audit-transaction', data);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    _handleError(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('ML Service Error:', error.response.data);
            throw new Error(error.response.data.detail || 'ML Service Failure');
        } else if (error.request) {
            // The request was made but no response was received
            console.error('ML Service Unreachable:', error.message);
            throw new Error('ML Service Connection Timeout');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('ML Gateway Error:', error.message);
            throw new Error('Internal Gateway Error');
        }
    }
}

export default new MLService();
