import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { marketPriceService } from '../../../services/marketPriceService';
import { MarketRateCard } from './MarketRateCard';
import { AlertCircle, RefreshCw, BarChart3 } from 'lucide-react';

// Popular commodities for Gujarat
const POPULAR_COMMODITIES = [
    'Cotton',
    'Groundnut',
    'Cumin Seed(Jeera)',
    'Castor Seed',
    'Wheat',
    'Bajra(Pearl Millet/Cumbu)',
    'Onion',
    'Potato'
];

export const LiveMarketRates: React.FC = () => {
    const { t } = useTranslation('common');

    const {
        data: marketData,
        isLoading,
        isError,
        refetch,
        isFetching
    } = useQuery({
        queryKey: ['liveMarketRates', 'Gujarat'],
        queryFn: async () => {
            // Fetch latest 100 records for Gujarat to ensure we get a diverse set
            const response = await marketPriceService.getMarketPrices({
                state: 'Gujarat',
                limit: 100
            });

            if (!response.success) throw new Error('Failed to fetch data');

            // Filter only the most recent record for each popular commodity
            const records = response.data.records;
            const latestByCommodity = new Map();

            // Look for both exact matches and partial matches for the popular list
            records.forEach(record => {
                const foundPopular = POPULAR_COMMODITIES.find(pc =>
                    record.commodity.toLowerCase().includes(pc.split('(')[0].toLowerCase().trim())
                );

                if (foundPopular && !latestByCommodity.has(foundPopular)) {
                    latestByCommodity.set(foundPopular, record);
                }
            });

            return Array.from(latestByCommodity.values());
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-bg-card rounded-[40px] border border-border-subtle/50">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                    <RefreshCw className="absolute inset-0 m-auto text-brand-primary animate-pulse" size={24} />
                </div>
                <p className="mt-6 text-text-secondary font-bold animate-pulse">
                    {t('marketRates.loading')}
                </p>
            </div>
        );
    }

    if (isError || (!isLoading && marketData?.length === 0)) {
        return (
            <div className="bg-status-error/5 border border-status-error/20 rounded-[40px] p-12 text-center">
                <div className="w-20 h-20 bg-status-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="text-status-error" size={40} />
                </div>
                <h4 className="text-xl font-black text-text-primary mb-2">
                    {t('marketRates.errorLoading')}
                </h4>
                <p className="text-text-muted mb-8 max-w-md mx-auto">
                    {t('help.faq2')} {/* Placeholder for "Our team is working on it" */}
                </p>
                <button
                    onClick={() => refetch()}
                    className="bg-bg-card border border-border-subtle px-8 py-4 rounded-2xl font-black text-text-primary hover:bg-bg-muted transition-all flex items-center gap-3 mx-auto"
                >
                    <RefreshCw size={20} className={isFetching ? 'animate-spin' : ''} />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                            <BarChart3 className="text-brand-primary" size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-status-success font-black text-xs tracking-widest uppercase bg-status-success/10 px-3 py-1 transparent-border rounded-full">
                            {t('marketRates.live')}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-4">
                        {t('marketRates.title')}
                    </h2>
                    <p className="text-lg text-text-muted font-medium">
                        {t('marketRates.subtitle')}
                    </p>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="bg-bg-card border border-border-subtle px-6 py-4 rounded-2xl font-bold text-text-secondary hover:border-brand-primary/30 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                    <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} />
                    {isFetching ? 'Updating...' : 'Refresh'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {marketData?.map((record, index) => (
                    <MarketRateCard key={`${record.commodity}-${index}`} record={record} />
                ))}
            </div>

            <div className="bg-bg-muted/30 border border-border-subtle/50 p-8 rounded-[32px] flex flex-col items-center text-center">
                <p className="text-text-muted font-bold mb-6">
                    Want to see price trends and detailed analysis?
                </p>
                <button className="bg-brand-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-brand-secondary hover:shadow-premium transition-all flex items-center gap-3">
                    {t('marketRates.viewMore')}
                </button>
            </div>
        </div>
    );
};
