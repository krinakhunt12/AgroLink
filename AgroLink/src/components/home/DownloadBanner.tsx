import React from 'react';
import { Download, Smartphone } from 'lucide-react';

interface DownloadBannerProps {
    title: string;
    subtitle: string;
    buttonText: string;
}

import { Button } from '../ui/button';

export const DownloadBanner: React.FC<DownloadBannerProps> = React.memo(({
    title,
    subtitle,
    buttonText
}) => {
    return (
        <section className="py-20 bg-bg-base">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-status-warning rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-theme-lg border border-brand-primary-light/20 relative overflow-hidden">
                    <div className="md:w-2/3 relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-brand-primary-dark mb-4">{title}</h2>
                        <p className="text-brand-primary-dark/70 text-lg font-bold mb-8">{subtitle}</p>
                        <Button className="bg-brand-primary-dark text-white px-10 py-4 h-auto rounded-full text-lg shadow-xl hover:bg-brand-primary hover:-translate-y-1 transition-all">
                            <Download className="mr-2 w-5 h-5" /> {buttonText}
                        </Button>
                    </div>
                    <div className="mt-8 md:mt-0 md:w-1/3 flex justify-center relative z-10">
                        <Smartphone className="w-48 h-48 text-brand-primary-dark/20 -rotate-12 absolute -right-10 -bottom-10 opacity-50" />
                        <Smartphone className="w-40 h-40 text-brand-primary-dark rotate-12 drop-shadow-2xl" />
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                </div>
            </div>
        </section>
    );
});

DownloadBanner.displayName = 'DownloadBanner';
