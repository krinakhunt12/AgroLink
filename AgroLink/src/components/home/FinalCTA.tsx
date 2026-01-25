import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

interface FinalCTAProps {
    title: string;
    subtitle: string;
    buttonText: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = React.memo(({
    title,
    subtitle,
    buttonText
}) => {
    return (
        <section className="py-32 bg-gradient-to-br from-brand-primary-dark via-brand-primary to-emerald-900 text-center text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg width="100%" height="100%"><pattern id="grid-cta" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" /></pattern><rect width="100%" height="100%" fill="url(#grid-cta)" /></svg>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[1.05] tracking-tighter drop-shadow-2xl">{title}</h2>
                <p className="text-xl md:text-2xl text-white/80 mb-14 max-w-2xl mx-auto font-medium leading-relaxed">{subtitle}</p>
                <Button asChild size="lg" className="rounded-[24px] text-xl h-auto py-7 px-14 bg-status-warning hover:bg-white text-brand-primary-dark shadow-2xl shadow-black/20 hover:-translate-y-2 transition-all font-black uppercase tracking-widest border-none">
                    <Link to="/register">
                        {buttonText}
                    </Link>
                </Button>
            </div>
        </section>
    );
});

FinalCTA.displayName = 'FinalCTA';
