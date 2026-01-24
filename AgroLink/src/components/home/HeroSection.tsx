import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Sprout, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export const HeroSection: React.FC = () => {
    const { t } = useTranslation('common');
    const [currentSlide, setCurrentSlide] = useState(0);

    // Get slides from translation
    const slides = t('hero.slides', { returnObjects: true }) as Array<{
        title: string;
        subtitle: string;
        image: string;
    }>;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <section className="relative bg-white border-b border-border-base overflow-hidden h-[600px] md:h-[700px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <img
                            src={slides[currentSlide].image}
                            alt={slides[currentSlide].title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-white/40" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
                        <div className="max-w-2xl space-y-6 md:space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                                    {t('hero.tagline')}
                                </div>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.1] tracking-tight">
                                    {slides[currentSlide].title}
                                </h1>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="text-base md:text-lg text-text-secondary leading-relaxed max-w-lg"
                            >
                                {slides[currentSlide].subtitle}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold rounded shadow-sm h-12 px-8 cursor-pointer border-none">
                                    <Link to="/register" className="flex items-center gap-2">
                                        <Sprout size={18} />
                                        {t('hero.ctaFarmer')}
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="bg-white/80 backdrop-blur-sm border-border-base text-text-primary font-bold rounded shadow-sm h-12 px-8 cursor-pointer hover:bg-bg-muted">
                                    <Link to="/market" className="flex items-center gap-2">
                                        <ShoppingCart size={18} />
                                        {t('hero.ctaBuyer')}
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute bottom-12 left-0 right-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex gap-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-1.5 transition-all rounded-full cursor-pointer ${currentSlide === idx ? 'w-8 bg-brand-primary' : 'w-2 bg-text-muted/30'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="absolute right-8 bottom-12 z-20 flex gap-4">
                <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-white/80 hover:bg-white text-text-primary border border-border-base shadow-sm transition-colors cursor-pointer"
                    aria-label="Previous Slide"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-white/80 hover:bg-white text-text-primary border border-border-base shadow-sm transition-colors cursor-pointer"
                    aria-label="Next Slide"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </section>
    );
};

