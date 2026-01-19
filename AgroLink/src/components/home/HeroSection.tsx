import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShoppingCart, Star } from 'lucide-react';

interface HeroSectionProps {
    tagline: string;
    title: string;
    subtitle: string;
    ctaFarmer: string;
    ctaBuyer: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
    tagline,
    title,
    subtitle,
    ctaFarmer,
    ctaBuyer
}) => {
    const [titlePart1, titlePart2] = title.split('.');

    return (
        <section className="relative bg-green-900 text-white overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-36">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div className="text-center lg:text-left flex flex-col items-center lg:items-start animate-slide-up">
                        <div className="inline-block px-4 py-1.5 mb-6 border border-yellow-400/50 rounded-full bg-yellow-400/10 backdrop-blur-sm">
                            <span className="text-yellow-300 font-bold tracking-wide text-xs md:text-sm uppercase flex items-center gap-2">
                                <Star className="w-4 h-4 fill-yellow-300" />
                                {tagline}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
                            <span className="text-white block">{titlePart1}</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 block mt-2">
                                {titlePart2}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl mb-10 max-w-2xl text-green-100 font-medium leading-relaxed">
                            {subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link to="/register" className="px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-full text-lg transition shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 hover:-translate-y-1">
                                <Sprout className="w-5 h-5" />
                                {ctaFarmer}
                            </Link>
                            <Link to="/register" className="px-8 py-4 bg-white text-green-900 font-bold rounded-full text-lg transition shadow-lg hover:shadow-xl hover:bg-gray-50 flex items-center justify-center gap-2 hover:-translate-y-1">
                                <ShoppingCart className="w-5 h-5" />
                                {ctaBuyer}
                            </Link>
                        </div>
                    </div>

                    <div className="relative hidden lg:block h-[600px] w-full animate-fade-in delay-200">
                        <div className="absolute top-0 right-0 w-[85%] h-[75%] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10 z-10 transform rotate-2">
                            <img src="https://images.unsplash.com/photo-1628352081506-83c43123ed6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Farmer" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
