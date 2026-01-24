import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { Button } from '../ui/button';

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
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-bg-muted/50 rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between border border-border-base gap-8">
                    <div className="md:w-2/3 space-y-4">
                        <h2 className="text-3xl font-bold text-text-primary tracking-tight">{title}</h2>
                        <p className="text-text-muted text-lg max-w-xl">{subtitle}</p>
                        <Button className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold px-8 h-12 shadow-sm">
                            <Download size={18} className="mr-2" /> {buttonText}
                        </Button>
                    </div>
                    <div className="md:w-1/3 flex justify-center">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-brand-primary/5 rounded-full blur-2xl"></div>
                            <Smartphone className="w-32 h-32 text-brand-primary relative" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

DownloadBanner.displayName = 'DownloadBanner';

