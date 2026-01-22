import React from 'react';
import { Download, Smartphone } from 'lucide-react';

interface DownloadBannerProps {
    title: string;
    subtitle: string;
    buttonText: string;
}

export const DownloadBanner: React.FC<DownloadBannerProps> = React.memo(({
    title,
    subtitle,
    buttonText
}) => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-yellow-400 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-xl">
                    <div className="md:w-2/3">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-4">{title}</h2>
                        <p className="text-green-900/80 text-lg font-medium mb-8">{subtitle}</p>
                        <button className="bg-green-900 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0">
                            <Download size={20} /> {buttonText}
                        </button>
                    </div>
                    <div className="mt-8 md:mt-0 md:w-1/3 flex justify-center">
                        <Smartphone className="w-32 h-32 text-green-900 rotate-12" />
                    </div>
                </div>
            </div>
        </section>
    );
});

DownloadBanner.displayName = 'DownloadBanner';
