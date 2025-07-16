import Card from "../ui/Card";

const Testimonials = () => {

    const testimonials = [
        {
            quote: "I was skeptical at first, but Applaude delivered a stunning app in minutes. It's like magic for entrepreneurs.",
            name: "Jane Doe",
            title: "Founder of InnovateCo"
        },
        {
            quote: "As a non-technical founder, Applaude was a lifesaver. We had a professional app ready for our launch without writing a single line of code.",
            name: "John Smith",
            title: "CEO of TechStart"
        },
        {
            quote: "The speed and quality are just unbelievable. We saved tens of thousands of dollars and months of development time.",
            name: "Emily White",
            title: "Product Manager at Creative Solutions"
        }
    ]

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-12">
                    Loved by Creators Worldwide
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                         <Card key={index} className="p-8 flex flex-col justify-between transform hover:scale-105 transition-transform duration-300">
                            <p className="text-lg text-gray-700 mb-6">"{testimonial.quote}"</p>
                            <div>
                                <p className="font-bold text-black">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.title}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
