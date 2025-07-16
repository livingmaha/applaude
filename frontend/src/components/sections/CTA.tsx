import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const CTA = () => {
    return (
        <section className="bg-ion-blue text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                    Ready to Build Your Dream App?
                </h2>
                <p className="text-lg sm:text-xl mb-8">
                    Join thousands of creators who have turned their websites into powerful mobile apps with Applaude. No code, no hassle.
                </p>
                <Link to="/signup">
                    <Button size="lg" variant="secondary" className="bg-white text-ion-blue hover:bg-gray-100 transition-transform transform hover:scale-105">
                        Start Building for Free
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default CTA;
