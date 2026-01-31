/**
 * TradeDeliveryTracker Component - Blockchain Powered Logistics Tracking
 * 
 * This page allows Farmers and Buyers to track the physical delivery of agricultural goods
 * that are secured by a Smart Contract Escrow.
 * 
 * FLOW:
 * 1. Payment Locked (Escrow Initialized)
 * 2. Dispatched (Farmer sends goods, updates Blockchain)
 * 3. Delivered (Buyer confirms receipt, Smart Contract releases funds)
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Package,
    Truck,
    CheckCircle2,
    Clock,
    ShieldCheck,
    ShieldX,
    ArrowLeft,
    AlertCircle,
    Loader2,
    Lock,
    User,
    IndianRupee,
    Database
} from 'lucide-react';

// Custom Hooks for Auth and AI/Blockchain Logic
import { useAuth } from '../hooks/useAuth';
import { useIntelligence } from '../hooks/useIntelligence';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { TrustSafetyBadge } from '../components/TrustSafetyBadge';

const TradeDeliveryTracker: React.FC = () => {
    // 1. Setup Navigation and Route Params
    const { contractId } = useParams<{ contractId: string }>();
    const navigate = useNavigate();

    // 2. Auth State - Identify if current user is Farmer or Buyer
    const { user } = useAuth();

    // 3. Logic Layer - Using the Intelligence Hook for Blockchain data
    const {
        useContractStatus,
        dispatchTrade,
        isDispatching,
        confirmDelivery,
        isConfirming
    } = useIntelligence();

    // 4. Data Fetching - React Query handles loading/error and automatic polling (5s)
    const {
        data: contractResponse,
        isLoading: loading,
        error
    } = useContractStatus(contractId!);

    // Extracting nested data from the API response
    const contract = contractResponse?.data;

    // Check if any blockchain modification is currently in progress
    const actionLoading = isDispatching || isConfirming;

    // --- HELPER HANDLERS ---

    // Farmer marks the goods as out for delivery
    const handleDispatch = async () => {
        try {
            await dispatchTrade(contractId!);
        } catch (err) {
            // Errors are caught by the 'useIntelligence' mutation and shown via Toast
        }
    };

    // Buyer confirms receipt and releases payment from Escrow
    const handleConfirmDelivery = async () => {
        try {
            await confirmDelivery(contractId!);
        } catch (err) {
            // Errors are handled globally
        }
    };

    // --- LOADING & ERROR UI STATES ---

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
                <p className="text-text-muted font-medium">Updating from Blockchain...</p>
            </div>
        );
    }

    if (error || !contract) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Blockchain Error</AlertTitle>
                    <AlertDescription>
                        {(error as any)?.message || 'Contract record not found. Please verify the Contract ID.'}
                    </AlertDescription>
                </Alert>
                <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        );
    }

    // --- MAIN RENDER ---

    return (
        <div className="bg-bg-base min-h-screen py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* 1. Header with Breadcrumbs */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-text-muted hover:text-brand-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
                    </Button>
                    <div className="flex items-center gap-3">
                        <TrustSafetyBadge
                            transactionData={{
                                id: contract.id,
                                price: contract.price,
                                historical_prices: [contract.price * 0.9, contract.price * 1.1, contract.price]
                            }}
                            userData={{
                                id: user?.id || 'anon',
                                total_deals: 12,
                                cancelled_deals: 1,
                                failed_payments: 0,
                                recent_deal_frequency: 2
                            }}
                            showDetailedAudit={true}
                        />
                        <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 bg-brand-primary/5 text-brand-primary border-brand-primary/20">
                            <Database size={12} /> Blockchain Verified Trade
                        </Badge>
                    </div>
                </div>

                {/* AI POLICY ENGINE BANNER: Flagged accounts */}
                {user?.riskLevel === 'high' && (
                    <Alert variant="destructive" className="border-2 border-status-error bg-status-error/5 shadow-lg">
                        <ShieldX className="h-5 w-5" />
                        <AlertTitle className="font-black uppercase tracking-tight">AI Policy Engine: Access Restricted</AlertTitle>
                        <AlertDescription className="text-xs font-medium">
                            Our AI Anomaly Detection system has identified high-risk patterns associated with this account.
                            <strong> All trade actions are currently locked</strong> pending manual administrative audit.
                            Reference Code: #RE-AUDIT-2026.
                        </AlertDescription>
                    </Alert>
                )}

                {/* 2. visual Progress Tracker */}
                <Card className={`border-border-base bg-bg-surface overflow-hidden shadow-premium ${user?.riskLevel === 'high' ? 'opacity-60 grayscale-[0.5] pointer-events-none' : ''}`}>
                    <CardHeader className="bg-bg-muted/30 border-b border-border-subtle">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-bold flex items-center gap-3">
                                <Package className="text-brand-primary" /> Delivery Milestones
                            </CardTitle>
                            <span className="text-xs font-mono text-text-muted">CID: {contract.id.slice(0, 10)}...</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                            {/* Progressive Line Background */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-border-base -translate-y-1/2 z-0" />
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-brand-primary -translate-y-1/2 z-10 transition-all duration-1000"
                                style={{ width: contract.status === 'PAYMENT_RELEASED' ? '100%' : contract.status === 'DISPATCHED' ? '50%' : '0%' }}
                            />

                            {/* Step 1: Confirmed */}
                            <div className="relative z-20 flex flex-col items-center gap-2 group">
                                <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                    <CheckCircle2 size={24} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-tight text-brand-primary">Confirmed</span>
                            </div>

                            {/* Step 2: Transit */}
                            <div className="relative z-20 flex flex-col items-center gap-2 group">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform ${contract.status === 'DISPATCHED' || contract.status === 'PAYMENT_RELEASED' ? 'bg-brand-primary text-white' : 'bg-bg-muted text-text-muted border-2 border-border-base'
                                    }`}>
                                    <Truck size={24} className={contract.status === 'DISPATCHED' ? 'animate-bounce' : ''} />
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-tight ${contract.status === 'DISPATCHED' || contract.status === 'PAYMENT_RELEASED' ? 'text-brand-primary' : 'text-text-muted'}`}>In Transit</span>
                            </div>

                            {/* Step 3: Delivered */}
                            <div className="relative z-20 flex flex-col items-center gap-2 group">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform ${contract.status === 'PAYMENT_RELEASED' ? 'bg-status-success text-white' : 'bg-bg-muted text-text-muted border-2 border-border-base'
                                    }`}>
                                    <ShieldCheck size={24} />
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-tight ${contract.status === 'PAYMENT_RELEASED' ? 'text-status-success' : 'text-text-muted'}`}>Completed</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Trade Specifics Table */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 border-border-base bg-bg-surface shadow-sm">
                        <CardHeader className="border-b border-border-subtle pb-4">
                            <CardTitle className="text-md flex items-center gap-2">
                                <Package size={18} className="text-brand-primary" /> Cargo & Value Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border-subtle">
                                <div className="p-4 flex justify-between items-center bg-bg-muted/10">
                                    <span className="text-sm font-medium text-text-muted">Crop Variety</span>
                                    <span className="font-bold text-text-primary capitalize">{contract.crop}</span>
                                </div>
                                <div className="p-4 flex justify-between items-center">
                                    <span className="text-sm font-medium text-text-muted">Quantity (Weight)</span>
                                    <span className="font-bold text-text-primary uppercase tracking-tighter">{contract.quantity}</span>
                                </div>
                                <div className="p-4 flex justify-between items-center bg-bg-muted/10">
                                    <span className="text-sm font-medium text-text-muted">Agreed Trade Price</span>
                                    <span className="font-bold text-brand-primary flex items-center gap-1">
                                        <IndianRupee size={14} /> {contract.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. Security Sidebar */}
                    <Card className="border-status-info/20 bg-status-info/5 border-l-4 border-l-status-info shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-wider text-status-info flex items-center gap-2">
                                <Lock size={14} /> Escrow Guard
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-text-muted leading-relaxed">
                                The funds for this trade are currently <span className="text-status-info font-bold uppercase tracking-tighter">Locked</span> in a secure
                                decentralized Escrow.
                                No party can withdraw until {user?.userType === 'farmer' ? 'the buyer confirms receipt' : 'you confirm delivery'}.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* 5. Role-Based Action Center */}
                <Card className="bg-bg-surface border-2 border-brand-primary/20 shadow-xl overflow-hidden">
                    <CardContent className="p-0">
                        <div className="bg-brand-primary/5 p-4 border-b border-brand-primary/10">
                            <h3 className="text-sm font-bold text-brand-primary uppercase tracking-widest flex items-center gap-2 text-center justify-center">
                                <User size={16} /> User Control Panel ({user?.userType === 'farmer' ? 'Farmer' : 'Buyer'})
                            </h3>
                        </div>
                        <div className="p-8 flex flex-col items-center gap-6">

                            {/* FARMER ACTION: Mark as Dispatched */}
                            {user?.userType === 'farmer' && contract.status === 'PAYMENT_LOCKED' && (
                                <div className="w-full max-w-md text-center space-y-4">
                                    <p className="text-sm text-text-muted">Have you sent the crop? Marking as dispatched notifies the buyer and the blockchain ledger.</p>
                                    <Button
                                        className="w-full h-12 font-black uppercase tracking-widest bg-brand-primary hover:bg-brand-primary-dark shadow-lg shadow-brand-primary/20"
                                        onClick={handleDispatch}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? <Loader2 className="animate-spin mr-2" /> : <Truck className="mr-2" />}
                                        Signal Dispatch to Blockchain
                                    </Button>
                                </div>
                            )}

                            {/* BUYER ACTION: Confirm Receipt */}
                            {user?.userType === 'buyer' && contract.status === 'DISPATCHED' && (
                                <div className="w-full max-w-md text-center space-y-4">
                                    <p className="text-sm text-text-muted">By clicking below, you confirm that you have received the goods in expected condition. This will trigger immediate payment release.</p>
                                    <Button
                                        className="w-full h-12 font-black uppercase tracking-widest bg-status-success hover:bg-green-700 shadow-lg shadow-status-success/20"
                                        onClick={handleConfirmDelivery}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
                                        Final Delivery Confirmation
                                    </Button>
                                </div>
                            )}

                            {/* STATUS MESSAGES */}
                            {contract.status === 'PAYMENT_RELEASED' && (
                                <div className="flex flex-col items-center gap-4 py-4">
                                    <div className="w-16 h-16 rounded-full bg-status-success/20 flex items-center justify-center text-status-success">
                                        <ShieldCheck size={40} />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-xl font-black text-status-success uppercase tracking-tight">Trade Completed</h4>
                                        <p className="text-sm text-text-muted mt-1 font-medium">Agreement settled. Payment has been released.</p>
                                    </div>
                                </div>
                            )}

                            {user?.userType === 'farmer' && contract.status === 'DISPATCHED' && (
                                <div className="flex items-center gap-3 p-4 bg-bg-muted rounded-lg border border-border-subtle italic text-text-muted text-sm">
                                    <Clock size={16} /> Awaiting Buyer's Final confirmation on Blockchain...
                                </div>
                            )}

                            {user?.userType === 'buyer' && contract.status === 'PAYMENT_LOCKED' && (
                                <div className="flex items-center gap-3 p-4 bg-bg-muted rounded-lg border border-border-subtle italic text-text-muted text-sm">
                                    <Clock size={16} /> Awaiting Farmer to mark goods as Dispatched...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TradeDeliveryTracker;
