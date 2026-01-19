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

export const WeatherWidget: React.FC<WeatherWidgetProps> = React.memo(({
    weatherData,
    title,
    subtitle,
    liveUpdatesLabel
}) => {
    return (
        <section className="py-20 bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {liveUpdatesLabel}
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                    <p className="text-gray-600 mt-2">{subtitle}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {weatherData.map((w, idx) => (
                        <div key={idx} className={`relative overflow-hidden rounded-2xl shadow-lg p-6 bg-gradient-to-br ${w.bg} text-white`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{w.city}</h3>
                                    <p className="text-white/80 text-sm font-medium">{w.condition}</p>
                                </div>
                                {getWeatherIcon(w.icon)}
                            </div>
                            <div className="mt-6">
                                <span className="text-4xl font-bold">{w.temp}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

WeatherWidget.displayName = 'WeatherWidget';
