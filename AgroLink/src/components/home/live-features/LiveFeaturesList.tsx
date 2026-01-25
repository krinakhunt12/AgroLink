import React from 'react';
import { TrendingUp, MapPin, ShieldCheck, Gavel } from 'lucide-react';
import { LiveFeatureItem } from './LiveFeatureItem';

interface FeatureData {
    title: string;
    desc: string;
}

interface LiveFeaturesListProps {
    features: FeatureData[];
}

const icons = [TrendingUp, MapPin, ShieldCheck, Gavel];

export const LiveFeaturesList: React.FC<LiveFeaturesListProps> = ({ features }) => {
    return (
        <div className="space-y-4 md:space-y-6">
            {features.map((feature, idx) => (
                <LiveFeatureItem
                    key={idx}
                    title={feature.title}
                    description={feature.desc}
                    icon={icons[idx] || TrendingUp}
                />
            ))}
        </div>
    );
};
