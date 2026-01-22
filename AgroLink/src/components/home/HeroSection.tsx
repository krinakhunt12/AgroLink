import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShoppingCart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Slide {
    title: string;
    subtitle: string;
    image: string;
}

export const HeroSection: React.FC = () => {
    const { t } = useTranslation();
    const slides = t('hero.slides', { returnObjects: true }) as Slide[];
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        if (!slides || slides.length === 0) return;
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides?.length]);

    const prevSlide = () => {
        if (!slides || slides.length === 0) return;
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (!isPaused && slides && slides.length > 0) {
            const timer = setInterval(nextSlide, 5000);
            return () => clearInterval(timer);
        }
    }, [nextSlide, isPaused, slides?.length]);

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
        return (
            <section className="relative h-[80vh] flex items-center justify-center bg-green-900 text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">{t('hero.title')}</h1>
                    <p className="text-xl">{t('hero.subtitle')}</p>
                </div>
            </section>
        );
    }

    return (
        <section
            className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-stone-900 font-sans"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Carousel Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 transition-transform duration-[5000ms] ease-linear overflow-hidden">
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className={`h-full w-full object-cover transition-transform duration-[10000ms] ${index === currentSlide ? 'scale-110' : 'scale-100'
                                }`}
                            loading={index === 0 ? "eager" : "lazy"}
                        />
                        {/* Overlay Gradient for readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-20 flex h-full items-center px-4 sm:px-6 lg:px-20">
                        <div className={`max-w-4xl ${index === currentSlide ? 'animate-fade-in' : ''}`}>
                            <div className="inline-block px-4 py-1.5 mb-6 border border-emerald-400/30 rounded-full bg-emerald-400/10 backdrop-blur-sm">
                                <span className="text-emerald-400 font-bold tracking-wide text-xs md:text-sm uppercase flex items-center gap-2">
                                    <Star className="w-4 h-4 fill-emerald-400" />
                                    {t('hero.tagline')}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.15] drop-shadow-sm">
                                {slide.title}
                            </h1>
                            <p className="text-lg md:text-xl text-stone-200 mb-10 max-w-2xl leading-relaxed">
                                {slide.subtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full text-lg transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                                >
                                    <Sprout className="w-5 h-5" />
                                    {t('hero.ctaFarmer')}
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-white hover:bg-stone-100 text-stone-900 font-bold rounded-full text-lg transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {t('hero.ctaBuyer')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-4 pointer-events-none">
                <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all pointer-events-auto group"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all pointer-events-auto group"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Carousel Indicators (Dots) */}
            <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 transition-all duration-300 rounded-full ${index === currentSlide ? 'w-12 bg-emerald-500' : 'w-2 bg-white/40 hover:bg-white'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 animate-bounce opacity-50">
                <div className="w-1 h-8 rounded-full bg-gradient-to-b from-white to-transparent"></div>
            </div>
        </section>
    );
};
