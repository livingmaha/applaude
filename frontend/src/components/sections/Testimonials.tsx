import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Star } from 'lucide-react';

// Using the actual images from the repository
const testimonials = [
  {
    quote: "Applaude transformed how we demonstrate our app to stakeholders. The interactive previews are a game-changer for our business.",
    name: "Tsion Tamirat",
    title: "Co-Founder & Software Engineer",
    image: "/src/assets/images/tsion_tamirat.jpg.jpg",
    rating: 5
  },
  {
    quote: "The speed from repo to a live, shareable demo is just unbelievable. It has streamlined our feedback loop immensely and saved us months of development time.",
    name: "Mugambi John Ndeke",
    title: "Co-Founder & AI Lead",
    image: "/src/assets/images/mugambi_john_ndeke.jpg.jpg",
    rating: 5
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by Developers Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of developers and businesses who trust Applaude to bring their mobile app visions to life.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter className="flex items-center pt-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-gray-200"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=6366f1&color=fff`;
                  }}
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;