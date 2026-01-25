import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Clock, MapPin } from 'lucide-react';
import type { MarketPriceRecord } from '../../../services/marketPriceService';

interface MarketRateCardProps {
    record: MarketPriceRecord;
}

export const MarketRateCard: React.FC<MarketRateCardProps> = ({ record }) => {
    const { t } = useTranslation('common');

    // Get trend color (using modal vs min/max ratio or hardcoded logic if no historical trend available)
    const isHighPrice = record.modal_price > (record.min_price + record.max_price) / 2;

    return (
        <div className="bg-bg-card rounded-3xl border border-border-subtle p-6 hover:shadow-premium-hover transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-status-success text-[10px] font-black tracking-widest uppercase bg-status-success/10 px-2 py-1 rounded-full border border-status-success/20 mb-2 inline-block">
                        {t('marketRates.live')}
                    </span>
                    <h3 className="text-xl font-black text-text-primary tracking-tight">
                        {t(`commodities.${record.commodity}`, { defaultValue: record.commodity })}
                    </h3>
                </div>
                <div className={`p-3 rounded-2xl ${isHighPrice ? 'bg-status-success/10 text-status-success' : 'bg-status-info/10 text-status-info'}`}>
                    {isHighPrice ? <TrendingUp size={24} strokeWidth={2.5} /> : <TrendingDown size={24} strokeWidth={2.5} />}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-text-secondary">
                    <MapPin size={16} />
                    <span className="text-sm font-bold truncate">
                        {record.market} ({record.district})
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-bg-muted/50 p-4 rounded-2xl border border-border-subtle/30">
                        <span className="text-[10px] font-black uppercase text-text-muted mb-1 block">
                            {t('marketRates.minPrice')}
                        </span>
                        <span className="text-lg font-black text-text-primary">
                            ₹{record.min_price.toLocaleString()}
                        </span>
                    </div>
                    <div className="bg-bg-muted/50 p-4 rounded-2xl border border-border-subtle/30">
                        <span className="text-[10px] font-black uppercase text-text-muted mb-1 block">
                            {t('marketRates.maxPrice')}
                        </span>
                        <span className="text-lg font-black text-text-primary">
                            ₹{record.max_price.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="bg-brand-primary/5 p-5 rounded-2xl border border-brand-primary/10 flex justify-between items-center group-hover:bg-brand-primary/10 transition-colors">
                    <div>
                        <span className="text-[10px] font-black uppercase text-brand-primary mb-1 block">
                            {t('marketRates.modalPrice')}
                        </span>
                        <span className="text-2xl font-black text-brand-primary">
                            ₹{record.modal_price.toLocaleString()}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-[10px] font-black text-text-muted uppercase">
                            <Clock size={12} />
                            {t('marketRates.updatedAt')}
                        </div>
                        <span className="text-xs font-bold text-text-secondary">
                            {record.arrival_date}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
