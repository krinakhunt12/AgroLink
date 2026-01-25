import React from 'react';
import { LiveMarketRates } from './LiveMarketRates';

export const MarketRatesSection: React.FC = () => {
    return (
        <section className="py-24 bg-bg-base relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-status-success/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <LiveMarketRates />
            </div>
        </section>
    );
};
