// File: frontend/src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-6xl font-extrabold text-ion-blue sm:text-8xl">404</h1>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl">Page Not Found</h2>
            <p className="mt-6 text-base leading-7 text-gray-600">
                Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
            </p>
            <div className="mt-10">
                <Link to="/">
                    <Button size="lg">
                        Go back home
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
