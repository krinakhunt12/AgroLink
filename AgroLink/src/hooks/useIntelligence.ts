import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import intelligenceService from '../services/intelligenceService';
import type {
    PricePredictionData,
    GapAnalysisData,
    BuyerHistory
} from '../services/intelligenceService';
import { QUERY_KEYS } from '../constants/query-keys';
import { toast } from 'sonner';

/**
 * Custom hook for all AI & Intelligence features
 */
export const useIntelligence = () => {
    const queryClient = useQueryClient();

    // --- QUERIES (GET DATA) ---

    /**
     * AI Price Prediction with XAI
     */
    const usePricePrediction = (data: PricePredictionData, enabled = false) => {
        return useQuery({
            queryKey: QUERY_KEYS.INTELLIGENCE.PRICE_PREDICTION(data),
            queryFn: () => intelligenceService.getPricePrediction(data),
            enabled: enabled && !!data.crop_name,
            staleTime: 1000 * 60 * 30, // 30 minutes (Price data is relatively stable)
        });
    };

    /**
     * Demand-Supply Gap Analysis
     */
    const useGapAnalysis = (data: GapAnalysisData, enabled = false) => {
        return useQuery({
            queryKey: QUERY_KEYS.INTELLIGENCE.GAP_ANALYSIS(data),
            queryFn: () => intelligenceService.getGapAnalysis(data),
            enabled: enabled && !!data.crop_name,
        });
    };

    /**
     * Buyer Trust Scoring
     */
    const useBuyerTrust = (buyerId: string, history: BuyerHistory, enabled = false) => {
        return useQuery({
            queryKey: QUERY_KEYS.INTELLIGENCE.BUYER_TRUST(buyerId, history),
            queryFn: () => intelligenceService.getBuyerTrust(buyerId, history),
            enabled: enabled && !!buyerId,
        });
    };

    /**
     * Policy & MSP Awareness Analysis
     */
    const usePolicyAwareness = (crop: string, district: string, market: string, price?: number, enabled = false) => {
        return useQuery({
            queryKey: QUERY_KEYS.INTELLIGENCE.POLICY_AWARENESS(crop, district, market),
            queryFn: () => intelligenceService.getPolicyAwareness(crop, district, market, price),
            enabled: enabled && !!crop,
        });
    };

    /**
     * Blockchain Ledger Integrity Verification
     */
    const useVerifyBlockchain = () => {
        return useQuery({
            queryKey: QUERY_KEYS.BLOCKCHAIN.VERIFY,
            queryFn: () => intelligenceService.verifyBlockchain(),
            staleTime: 1000 * 60 * 5, // 5 minutes
        });
    };

    /**
    * Smart Contract Status Tracker
    */
    const useContractStatus = (contractId: string) => {
        return useQuery({
            queryKey: QUERY_KEYS.BLOCKCHAIN.CONTRACT_STATUS(contractId),
            queryFn: () => intelligenceService.getContractStatus(contractId),
            enabled: !!contractId,
            refetchInterval: (query) => {
                // Poll if the contract is still in transit
                const status = query.state.data?.data?.status;
                return (status === 'PAYMENT_LOCKED' || status === 'DISPATCHED') ? 5000 : false;
            }
        });
    };

    // --- MUTATIONS (POST/UPDATE DATA) ---

    /**
     * Manually trigger Price Alerts scan
     */
    const triggerAlertsMutation = useMutation({
        mutationFn: () => intelligenceService.triggerAlerts(),
        onSuccess: () => {
            toast.success('Price alert scanning initiated successfully.');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to trigger alerts.');
        }
    });

    /**
     * Permanently seal a trade on Blockchain
     */
    const sealTradeMutation = useMutation({
        mutationFn: (data: any) => intelligenceService.sealTradeOnBlockchain(data),
        onSuccess: () => {
            toast.success('Trade sealed on Blockchain ledger.');
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BLOCKCHAIN.VERIFY });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Blockchain sealing failed.');
        }
    });

    /**
     * Initiate Smart Contract Escrow
     */
    const initiateEscrowMutation = useMutation({
        mutationFn: (data: any) => intelligenceService.initiateEscrow(data),
        onSuccess: (data) => {
            toast.success('Smart Contract Escrow activated. Funds locked.');
            return data;
        },
        onError: (error: any) => {
            toast.error(error.message || 'Escrow initiation failed.');
        }
    });

    /**
     * Farmer marks trade as Dispatched
     */
    const dispatchTradeMutation = useMutation({
        mutationFn: (contractId: string) => intelligenceService.dispatchTrade(contractId),
        onSuccess: (_, contractId) => {
            toast.success('Market as Dispatched on Blockchain.');
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BLOCKCHAIN.CONTRACT_STATUS(contractId) });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Dispatch update failed.');
        }
    });

    /**
     * Buyer confirms delivery and releases funds
     */
    const confirmDeliveryMutation = useMutation({
        mutationFn: (contractId: string) => intelligenceService.confirmDeliveryRelease(contractId),
        onSuccess: (_, contractId) => {
            toast.success('Delivery confirmed! Payment released to farmer.');
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BLOCKCHAIN.CONTRACT_STATUS(contractId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BLOCKCHAIN.VERIFY });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Delivery confirmation failed.');
        }
    });

    /**
     * AI Audit: Check transaction for fraud or anomalies
     */
    const auditTransactionMutation = useMutation({
        mutationFn: (data: { transaction_data: any; user_data: any }) => intelligenceService.auditTransaction(data),
        onSuccess: (data) => {
            const risk = data.data.risk_level;
            if (risk === 'High Risk') {
                toast.error('Flagged: This transaction shows high anomalous activity.');
            } else if (risk === 'Medium Risk') {
                toast.warning('Warning: AI detected minor anomalies in this pattern.');
            }
            return data;
        },
        onError: (error: any) => {
            toast.error(error.message || 'Audit failed.');
        }
    });

    /**
     * Blockchain Integrity: Verify record against ledger hash
     */
    const verifyIntegrityMutation = useMutation({
        mutationFn: (data: any) => intelligenceService.verifyIntegrity(data),
        onSuccess: (response: any) => {
            if (response?.data?.is_authentic) {
                toast.success('Blockchain Verified: Record matches immutable ledger.');
            } else {
                toast.error('Integrity Violation: Local data does not match Blockchain record!');
            }
            return response;
        },
        onError: (error: any) => {
            toast.error(error.message || 'Integrity check failed.');
        }
    });

    return {
        // Queries
        usePricePrediction,
        useGapAnalysis,
        useBuyerTrust,
        usePolicyAwareness,
        useVerifyBlockchain,
        useContractStatus,

        // Mutations
        triggerAlerts: triggerAlertsMutation.mutateAsync,
        isTriggeringAlerts: triggerAlertsMutation.isPending,

        sealTrade: sealTradeMutation.mutateAsync,
        isSealingTrade: sealTradeMutation.isPending,

        initiateEscrow: initiateEscrowMutation.mutateAsync,
        isInitiatingEscrow: initiateEscrowMutation.isPending,

        dispatchTrade: dispatchTradeMutation.mutateAsync,
        isDispatching: dispatchTradeMutation.isPending,

        confirmDelivery: confirmDeliveryMutation.mutateAsync,
        isConfirming: confirmDeliveryMutation.isPending,

        auditTransaction: auditTransactionMutation.mutateAsync,
        isAuditing: auditTransactionMutation.isPending,

        verifyIntegrity: verifyIntegrityMutation.mutateAsync,
        isVerifyingIntegrity: verifyIntegrityMutation.isPending
    };
};
