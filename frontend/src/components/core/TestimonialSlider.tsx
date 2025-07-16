import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import TestimonialCard from './TestimonialCard';

interface TestimonialData {
    id: string;
    content: string;
    user: {
        username: string;
    };
}

const TestimonialSlider: React.FC = () => {
    const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await apiClient.get('/testimonials/published/');
                setTestimonials(response.data);
            } catch (error) {
                console.error("Failed to fetch testimonials:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Loading testimonials...</div>;
    }

    if (testimonials.length === 0) {
        return null; // Don't render the section if there are no testimonials
    }

    // Duplicate testimonials for a seamless loop effect
    const extendedTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                 <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-12">
                    Loved by Creators Worldwide
                </h2>
                <div className="relative h-96">
                    <div className="absolute top-0 left-0 w-full h-full flex items-center animate-marquee">
                        {extendedTestimonials.map((testimonial, index) => (
                            <div key={`${testimonial.id}-${index}`} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-4">
                                <TestimonialCard testimonial={testimonial} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Add keyframes to tailwind.config.js for the marquee animation
/*
// tailwind.config.js
theme: {
    extend: {
      animation: {
        marquee: 'marquee 60s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
*/


export default TestimonialSlider;
