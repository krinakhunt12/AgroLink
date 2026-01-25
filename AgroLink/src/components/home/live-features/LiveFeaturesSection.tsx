import React from 'react';
import { LiveFeaturesList } from './LiveFeaturesList';
import { LiveMarketRates } from './LiveMarketRates';

interface FeatureData {
    title: string;
    desc: string;
}

interface LiveFeaturesSectionProps {
    title: string;
    features: FeatureData[];
}

export const LiveFeaturesSection: React.FC<LiveFeaturesSectionProps> = ({
    title,
    features
}) => {
    return (
        <section className="py-24 bg-bg-base overflow-hidden relative">
            {/* Background elements for theme consistency */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 -skew-x-12 translate-x-1/2 -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Left Column: Feature List */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-block bg-brand-primary/10 px-4 py-2 rounded-xl mb-6">
                            <span className="text-brand-primary font-black text-xs tracking-widest uppercase">Platform Excellence</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-12 leading-tight tracking-tight">
                            {title}
                        </h2>
                        <LiveFeaturesList features={features} />
                    </div>

                    {/* Right Column: Dynamic Market Rates Card */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <div className="w-full max-w-lg lg:max-w-md">
                            <LiveMarketRates />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
