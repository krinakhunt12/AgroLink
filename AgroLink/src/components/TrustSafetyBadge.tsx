import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Loader2, Info } from 'lucide-react';
import { useIntelligence } from '../hooks/useIntelligence';
import { Badge } from '../components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip";

interface TrustSafetyBadgeProps {
    transactionData: {
        id?: string;
        price: number;
        historical_prices: number[];
    };
    userData: {
        id: string;
        total_deals: number;
        cancelled_deals: number;
        failed_payments: number;
        recent_deal_frequency: number;
    };
    showDetailedAudit?: boolean;
}

export const TrustSafetyBadge: React.FC<TrustSafetyBadgeProps> = ({
    transactionData,
    userData,
    showDetailedAudit = false
}) => {
    const { auditTransaction, isAuditing } = useIntelligence();
    const [auditResult, setAuditResult] = useState<any>(null);

    useEffect(() => {
        const performAudit = async () => {
            try {
                const result = await auditTransaction({
                    transaction_data: transactionData,
                    user_data: userData
                });
                setAuditResult(result.data);
            } catch (err) {
                console.error("Audit performance failed", err);
            }
        };

        if (transactionData && userData) {
            performAudit();
        }
    }, [transactionData, userData, auditTransaction]);

    if (isAuditing || !auditResult) {
        return (
            <div className="flex items-center gap-2 text-text-muted text-xs animate-pulse">
                <Loader2 size={12} className="animate-spin" />
                Scanning AI Fraud Signatures...
            </div>
        );
    }

    const { risk_level, audit_code, flags } = auditResult;

    const getBadgeConfig = () => {
        switch (risk_level) {
            case 'High Risk':
                return {
                    color: 'bg-status-error/10 text-status-error border-status-error/20',
                    icon: <ShieldX size={14} />,
                    label: 'High Risk Flagged',
                    desc: 'This activity deviates significantly from normal marketplace patterns.'
                };
            case 'Medium Risk':
                return {
                    color: 'bg-status-warning/10 text-status-warning border-status-warning/20',
                    icon: <ShieldAlert size={14} />,
                    label: 'Moderate Risk',
                    desc: 'Minor behavioral anomalies detected. Transaction marked for review.'
                };
            default:
                return {
                    color: 'bg-status-success/10 text-status-success border-status-success/20',
                    icon: <ShieldCheck size={14} />,
                    label: 'AI Verified Safe',
                    desc: 'Pricing and behavior patterns align with historical safety standards.'
                };
        }
    };

    const config = getBadgeConfig();

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant="outline" className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider cursor-help transition-all hover:scale-105 ${config.color}`}>
                            {config.icon}
                            {config.label}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3 bg-bg-surface border-border-base shadow-xl">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                                <span className="font-black text-xs uppercase tracking-tighter">AI Security Protocol</span>
                                <span className="text-[10px] text-text-muted font-mono ml-auto">REF: {audit_code}</span>
                            </div>
                            <p className="text-xs text-text-muted leading-relaxed">
                                {config.desc}
                            </p>
                            {flags && flags.length > 0 && (
                                <div className="pt-1">
                                    <p className="text-[10px] font-black text-text-primary uppercase mb-1">Risk Signals:</p>
                                    <ul className="space-y-1">
                                        {flags.map((flag: string, i: number) => (
                                            <li key={i} className="text-[9px] flex items-center gap-1.5 text-status-error font-medium">
                                                <div className="w-1 h-1 rounded-full bg-status-error" /> {flag}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </TooltipContent>
                </Tooltip>

                {showDetailedAudit && risk_level !== 'Low Risk' && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-status-error/5 border border-status-error/10 rounded text-[10px] text-status-error font-bold italic">
                        <Info size={10} /> Account is currently under AI specialized observation
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
};
