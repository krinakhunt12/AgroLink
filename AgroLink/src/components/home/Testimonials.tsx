import React from 'react';

interface Testimonial {
    quote: string;
    name: string;
    role: string;
    color: string;
}

interface TestimonialsProps {
    title: string;
    subtitle: string;
    testimonials: Testimonial[];
}

import { Card, CardContent } from '../ui/card';

export const Testimonials: React.FC<TestimonialsProps> = React.memo(({
    title,
    subtitle,
    testimonials
}) => {
    return (
        <section className="py-24 bg-stone-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-extrabold text-brand-primary-dark tracking-tight">{title}</h2>
                    <p className="mt-4 text-xl text-text-secondary font-medium">{subtitle}</p>
                    <div className="w-24 h-1.5 bg-status-warning mx-auto mt-6 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {testimonials.map((testimonial, idx) => (
                        <Card
                            key={idx}
                            className={`bg-bg-surface p-2 rounded-[32px] shadow-theme-lg border-t-[6px] transition-all hover:-translate-y-2 ${testimonial.color === 'green' ? 'border-brand-primary' : 'border-status-warning'
                                }`}
                        >
                            <CardContent className="p-10">
                                <p className="text-text-secondary italic mb-10 text-xl leading-relaxed font-medium">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 ${testimonial.color === 'green' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-status-warning/10 text-status-warning'
                                        } rounded-2xl flex items-center justify-center font-black text-xl shadow-inner`}>
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-text-primary text-lg">{testimonial.name}</h4>
                                        <p className={`text-xs ${testimonial.color === 'green' ? 'text-brand-primary' : 'text-status-warning'
                                            } font-black uppercase tracking-[0.1em]`}>
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
});

Testimonials.displayName = 'Testimonials';
