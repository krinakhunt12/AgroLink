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

export const Testimonials: React.FC<TestimonialsProps> = React.memo(({
    title,
    subtitle,
    testimonials
}) => {
    return (
        <section className="py-20 bg-stone-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-green-900">{title}</h2>
                    <p className="mt-3 text-lg text-gray-600">{subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {testimonials.map((testimonial, idx) => (
                        <div
                            key={idx}
                            className={`bg-white p-10 rounded-3xl shadow-xl border-t-4 ${testimonial.color === 'green' ? 'border-green-500' : 'border-yellow-500'
                                }`}
                        >
                            <p className="text-gray-700 italic mb-8 text-lg leading-relaxed">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${testimonial.color === 'green' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    } rounded-full flex items-center justify-center font-bold text-lg`}>
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                    <p className={`text-xs ${testimonial.color === 'green' ? 'text-green-600' : 'text-yellow-600'
                                        } font-bold uppercase tracking-wider`}>
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

Testimonials.displayName = 'Testimonials';
