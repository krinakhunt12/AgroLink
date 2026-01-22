import React from 'react';
import { Link } from 'react-router-dom';

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
        <section className="py-24 bg-green-900 text-center text-white">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{title}</h2>
                <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">{subtitle}</p>
                <Link
                    to="/register"
                    className="inline-block px-10 py-4 bg-yellow-400 text-green-900 font-bold rounded-full text-lg shadow-lg hover:bg-yellow-300 transition-all hover:-translate-y-1"
                >
                    {buttonText}
                </Link>
            </div>
        </section>
    );
});

FinalCTA.displayName = 'FinalCTA';
