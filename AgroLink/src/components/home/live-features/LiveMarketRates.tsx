import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { marketPriceService } from '../../../services/marketPriceService';
import { MarketRateRow } from './MarketRateRow';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../ui/card';

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
        queryKey: ['liveMarketRates', 'GujaratCompact'],
        queryFn: async () => {
            const response = await marketPriceService.getMarketPrices({
                state: 'Gujarat',
                limit: 100
            });

            if (!response.success) throw new Error('Failed to fetch data');

            const records = response.data.records;
            const latestByCommodity = new Map();

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
        staleTime: 5 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
    });

    return (
        <Card className="bg-bg-surface text-text-primary rounded-[32px] overflow-hidden shadow-premium border border-border-base flex flex-col h-full transition-all hover:shadow-premium-hover">
            <CardHeader className="bg-bg-muted/30 backdrop-blur-sm p-8 border-b border-border-base flex flex-row justify-between items-center space-y-0">
                <CardTitle className="font-black text-2xl flex items-center gap-4 text-text-primary">
                    <div className="p-3 bg-brand-primary/10 rounded-2xl">
                        <TrendingUp className="text-brand-primary w-7 h-7" strokeWidth={2.5} />
                    </div>
                    {t('liveFeatures.liveUpdates')}
                </CardTitle>
                <div className="flex items-center gap-2 text-status-success text-[10px] font-black tracking-widest uppercase bg-status-success/10 px-4 py-2 rounded-full border border-status-success/20">
                    <span className="w-2 h-2 bg-status-success rounded-full animate-pulse"></span>
                    {t('liveFeatures.liveIndicator')}
                </div>
            </CardHeader>

            <CardContent className="p-8 space-y-4 flex-grow max-h-[500px] overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <RefreshCw className="text-brand-primary animate-spin" size={32} />
                        <p className="text-text-muted font-bold text-sm uppercase tracking-widest">{t('marketRates.loading')}</p>
                    </div>
                ) : isError ? (
                    <div className="text-center py-12 px-6">
                        <div className="w-16 h-16 bg-status-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="text-status-error" size={32} />
                        </div>
                        <p className="text-text-secondary font-bold mb-6">{t('marketRates.errorLoading')}</p>
                        <button
                            onClick={() => refetch()}
                            className="text-brand-primary font-black uppercase text-xs tracking-widest hover:underline"
                        >
                            Try Again
                        </button>
                    </div>
                ) : marketData?.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-text-muted font-bold">{t('marketRates.noData')}</p>
                    </div>
                ) : (
                    marketData?.map((record, i) => (
                        <MarketRateRow
                            key={i}
                            label={t(`commodities.${record.commodity}`, { defaultValue: record.commodity })}
                            value={`₹${record.modal_price.toLocaleString()}`}
                        />
                    ))
                )}
            </CardContent>

            <CardFooter className="px-8 py-6 bg-bg-muted/10 border-t border-border-subtle flex justify-between items-center">
                <span className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em]">
                    {isFetching ? 'Refreshing...' : `Last Refreshed: ${new Date().toLocaleTimeString()}`}
                </span>
                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="p-2 hover:bg-bg-muted rounded-xl transition-colors disabled:opacity-50"
                    title="Refresh Rates"
                >
                    <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
                </button>
            </CardFooter>
        </Card>
    );
};
