import { apiRequest } from './api';

export interface LocationContext {
    state: string;
    district: string;
    market: string;
}

export interface PricePredictionData {
    crop_name: string;
    location: LocationContext;
    month: number;
    quantity: number;
    recent_prices: number[];
}

export interface GapAnalysisData {
    crop_name: string;
    market: string;
    current_arrival: number;
    recent_prices: number[];
}

export interface BuyerHistory {
    total_deals: number;
    completed_deals: number;
    on_time_payments: number;
    delayed_payments: number;
    failed_payments: number;
    disputes_count: number;
    years_on_platform: number;
}

class IntelligenceService {
    /**
     * Verify transaction integrity against Blockchain ledger hash
     */
    async verifyIntegrity(data: {
        farmer_id: string;
        buyer_id: string;
        crop_type: string;
        quantity: number;
        agreed_price: number;
        order_id: string;
        stored_hash: string;
    }) {
        return await apiRequest('/intelligence/blockchain/integrity/verify', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Fetch AI Price Prediction with XAI
     */
    async getPricePrediction(data: PricePredictionData) {
        return await apiRequest('/intelligence/predict-price', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Fetch Demand-Supply Gap Analysis
     */
    async getGapAnalysis(data: GapAnalysisData) {
        return await apiRequest('/intelligence/analyze-gap', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Fetch Buyer Trust Score & Level
     */
    async getBuyerTrust(buyerId: string, history: BuyerHistory) {
        return await apiRequest(`/intelligence/buyer-trust/${buyerId}`, {
            method: 'POST',
            body: JSON.stringify(history),
        });
    }

    /**
     * Fetch Policy & MSP Awareness analysis
     */
    async getPolicyAwareness(crop: string, district: string, market: string, currentPrice?: number) {
        const params = new URLSearchParams({
            crop,
            district,
            market,
            ...(currentPrice ? { current_price: currentPrice.toString() } : {})
        });
        return await apiRequest(`/intelligence/policy-awareness?${params.toString()}`);
    }

    /**
     * Fetch Farmer Profit Analytics Dashboard
     */
    async getProfitDashboard(transactions: any[]) {
        return await apiRequest('/intelligence/profit-dashboard', {
            method: 'POST',
            body: JSON.stringify(transactions),
        });
    }

    /**
     * Trigger Manual Alert Scan
     */
    async triggerAlerts() {
        return await apiRequest('/intelligence/alerts/trigger', {
            method: 'POST',
        });
    }

    /**
     * Permanently seal a trade record on the Blockchain
     */
    async sealTradeOnBlockchain(tradeData: {
        farmer_id: string;
        buyer_id: string;
        crop_type: string;
        quantity: number;
        agreed_price: number;
    }) {
        return await apiRequest('/intelligence/blockchain/seal', {
            method: 'POST',
            body: JSON.stringify(tradeData),
        });
    }

    /**
   * Verify the integrity of the Blockchain ledger
   */
    async verifyBlockchain() {
        return await apiRequest('/intelligence/blockchain/verify');
    }

    /**
     * Initiate a Smart Contract (Escrow) for a crop sale
     */
    async initiateEscrow(data: {
        farmer_id: string;
        buyer_id: string;
        crop: string;
        quantity: number;
        price: number;
    }) {
        return await apiRequest('/intelligence/contracts/start-escrow', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Farmer marks the order as Dispatched
     */
    async dispatchTrade(contractId: string) {
        return await apiRequest(`/intelligence/contracts/dispatch/${contractId}`, {
            method: 'POST',
        });
    }

    /**
     * Buyer confirms delivery and releases funds from Escrow
     */
    async confirmDeliveryRelease(contractId: string) {
        return await apiRequest(`/intelligence/contracts/confirm-delivery/${contractId}`, {
            method: 'POST',
        });
    }

    /**
     * Get the current status of an Escrow Smart Contract
     */
    async getContractStatus(contractId: string) {
        return await apiRequest(`/intelligence/contracts/get/${contractId}`);
    }

    /**
     * AI Audit: Check for fraud, pricing anomalies, or suspicious behavior
     */
    async auditTransaction(auditData: { transaction_data: any; user_data: any }) {
        return await apiRequest('/intelligence/audit', {
            method: 'POST',
            body: JSON.stringify(auditData),
        });
    }
}

export default new IntelligenceService();
