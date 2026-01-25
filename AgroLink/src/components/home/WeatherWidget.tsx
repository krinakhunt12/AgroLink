import React from 'react';
import { Sun, Cloud, CloudRain } from 'lucide-react';
import { Card } from '../ui/card';

interface WeatherItem {
    city: string;
    condition: string;
    temp: string;
    icon: string;
}

interface WeatherWidgetProps {
    weatherData: WeatherItem[];
    title: string;
    subtitle: string;
    liveUpdatesLabel: string;
    liveNowLabel: string;
}

const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
        case 'Sun': return <Sun className="w-8 h-8 text-status-warning" />;
        case 'Cloud': return <Cloud className="w-8 h-8 text-text-muted" />;
        case 'CloudRain': return <CloudRain className="w-8 h-8 text-status-info" />;
        default: return <Sun className="w-8 h-8 text-status-warning" />;
    }
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = React.memo(({
    weatherData,
    title,
    subtitle,
    liveUpdatesLabel,
    liveNowLabel
}) => {
    return (
        <section className="py-20 bg-bg-base overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-status-info font-bold text-xs uppercase tracking-wider">
                            <span className="w-2 h-2 bg-status-info rounded-full"></span>
                            {liveUpdatesLabel}
                        </div>
                        <h2 className="text-3xl font-bold text-text-primary tracking-tight">{title}</h2>
                        <p className="text-text-muted text-lg max-w-xl">{subtitle}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {weatherData.length > 0 ? (
                        weatherData.map((w, idx) => (
                            <Card key={idx} className="p-6 bg-bg-surface border-border-base shadow-sm hover:border-brand-primary/50 transition-colors rounded-lg flex flex-col justify-between h-40">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-text-primary text-lg">{w.city}</h3>
                                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{w.condition}</p>
                                    </div>
                                    {getWeatherIcon(w.icon)}
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-text-primary">{w.temp}</span>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{liveNowLabel}</span>
                                </div>
                            </Card>
                        ))
                    ) : (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-40 bg-bg-muted rounded-lg"></div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
});

WeatherWidget.displayName = 'WeatherWidget';

