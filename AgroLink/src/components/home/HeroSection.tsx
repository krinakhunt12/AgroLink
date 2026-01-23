import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';
import { Sprout, ShoppingCart, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Slide {
    title: string;
    subtitle: string;
    image: string;
}

import { Badge } from '../ui/badge';

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
            <section className="relative h-[80vh] flex items-center justify-center bg-brand-primary-dark text-white">
                <div className="text-center px-4">
                    <h1 className="text-5xl font-black mb-6 tracking-tight">{t('hero.title')}</h1>
                    <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto">{t('hero.subtitle')}</p>
                </div>
            </section>
        );
    }

    return (
        <section
            className="relative h-[90vh] min-h-[700px] w-full overflow-hidden bg-bg-base font-sans"
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
                            className={`h-full w-full object-cover transition-transform duration-[10000ms] brightness-[0.7] ${index === currentSlide ? 'scale-110' : 'scale-100'
                                }`}
                            loading={index === 0 ? "eager" : "lazy"}
                        />
                        {/* Overlay Gradient for readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-20 flex h-full items-center px-6 sm:px-12 lg:px-24">
                        <div className={`max-w-4xl transition-all duration-1000 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="inline-block mb-8">
                                <Badge variant="outline" className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white font-black text-xs md:text-sm uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Star className="w-4 h-4 text-status-warning fill-status-warning" />
                                    {t('hero.tagline')}
                                </Badge>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tighter drop-shadow-2xl">
                                {slide.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl leading-relaxed font-medium">
                                {slide.subtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <Button asChild size="lg" className="rounded-2xl text-xl h-auto py-6 px-10 bg-brand-primary hover:bg-brand-primary-dark text-white shadow-xl shadow-brand-primary/20 transition-all hover:-translate-y-1">
                                    <Link to="/register">
                                        <Sprout className="w-6 h-6 mr-3" />
                                        {t('hero.ctaFarmer')}
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="rounded-2xl text-xl h-auto py-6 px-10 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all hover:-translate-y-1">
                                    <Link to="/register">
                                        <ShoppingCart className="w-6 h-6 mr-3" />
                                        {t('hero.ctaBuyer')}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-6 pointer-events-none">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevSlide}
                    className="w-14 h-14 rounded-2xl bg-black/20 text-white backdrop-blur-md hover:bg-black/40 pointer-events-auto border border-white/10 group shadow-2xl"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextSlide}
                    className="w-14 h-14 rounded-2xl bg-black/20 text-white backdrop-blur-md hover:bg-black/40 pointer-events-auto border border-white/10 group shadow-2xl"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

            {/* Carousel Indicators (Dots) */}
            <div className="absolute bottom-12 left-1/2 z-30 flex -translate-x-1/2 gap-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2.5 transition-all duration-500 rounded-full shadow-lg ${index === currentSlide ? 'w-16 bg-brand-primary' : 'w-4 bg-white/30 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce opacity-40">
                <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-white to-transparent"></div>
            </div>
        </section>
    );
};
