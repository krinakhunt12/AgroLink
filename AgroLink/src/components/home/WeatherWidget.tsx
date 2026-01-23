import React from 'react';
import { Sun, Cloud, CloudRain } from 'lucide-react';

interface WeatherItem {
    city: string;
    condition: string;
    temp: string;
    icon: string;
    bg: string;
}

interface WeatherWidgetProps {
    weatherData: WeatherItem[];
    title: string;
    subtitle: string;
    liveUpdatesLabel: string;
}

const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
        case 'Sun': return <Sun className="w-10 h-10 text-white drop-shadow-md" />;
        case 'Cloud': return <Cloud className="w-10 h-10 text-white drop-shadow-md" />;
        case 'CloudRain': return <CloudRain className="w-10 h-10 text-white drop-shadow-md" />;
        default: return <Sun className="w-10 h-10 text-white drop-shadow-md" />;
    }
};

import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export const WeatherWidget: React.FC<WeatherWidgetProps> = React.memo(({
    weatherData,
    title,
    subtitle,
    liveUpdatesLabel
}) => {
    return (
        <section className="py-24 bg-bg-surface relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] -ml-80 -mt-40 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Badge variant="secondary" className="bg-status-info/10 text-status-info border-none px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2 h-2 bg-status-info rounded-full animate-pulse"></span>
                            {liveUpdatesLabel}
                        </Badge>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight leading-tight">{title}</h2>
                    <p className="text-text-secondary mt-4 font-medium text-lg md:text-xl max-w-2xl mx-auto">{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {weatherData.length > 0 ? (
                        weatherData.map((w, idx) => (
                            <Card key={idx} className={`relative overflow-hidden border-none shadow-theme-sm hover:shadow-theme-lg transition-all duration-500 group hover:-translate-y-2 rounded-[32px] p-8 bg-gradient-to-br ${w.bg} text-white`}>
                                {/* Glassmorphism Effect Overlay */}
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <h3 className="font-black text-xl mb-2 tracking-tight drop-shadow-sm">{w.city}</h3>
                                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                                            {w.condition}
                                        </Badge>
                                    </div>
                                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        {getWeatherIcon(w.icon)}
                                    </div>
                                </div>

                                <div className="mt-10 relative z-10">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black tracking-tighter drop-shadow-lg">{w.temp}</span>
                                        <span className="text-white/60 font-bold text-sm tracking-widest uppercase">Live Now</span>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        // Skeleton/Fallback state handled by global loading, but safe to have something here
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-48 bg-bg-muted animate-pulse rounded-[32px]"></div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
});

WeatherWidget.displayName = 'WeatherWidget';
