import React from 'react';
import { LiveFeaturesList } from './LiveFeaturesList';
import { LiveUpdatesCard } from './LiveUpdatesCard';

interface FeatureData {
    title: string;
    desc: string;
}

interface LiveFeaturesSectionProps {
    title: string;
    features: FeatureData[];
    marketRates: string[];
    liveUpdatesLabel: string;
    liveIndicatorLabel: string;
}

export const LiveFeaturesSection: React.FC<LiveFeaturesSectionProps> = ({
    title,
    features,
    marketRates,
    liveUpdatesLabel,
    liveIndicatorLabel
}) => {
    return (
        <section className="py-24 bg-stone-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Left Column: Feature List */}
                    <div className="order-2 lg:order-1">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-10 leading-tight">
                            {title}
                        </h2>
                        <LiveFeaturesList features={features} />
                    </div>

                    {/* Right Column: Market Rates Card */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <div className="w-full max-w-lg lg:max-w-md">
                            <LiveUpdatesCard
                                title={liveUpdatesLabel}
                                liveLabel={liveIndicatorLabel}
                                rates={marketRates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
